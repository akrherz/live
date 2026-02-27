/**
 * MapPanel Module - OpenLayers 8 Version
 * Modern OpenLayers 8 map with ExtJS 6 integration (no GeoExt)
 */

import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import {defaults as defaultControls} from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import KML from 'ol/format/KML';
import GeoJSON from 'ol/format/GeoJSON';
import {Style, Fill, Stroke, Icon} from 'ol/style';
import {createLSRStore, createSBWStore} from './feature-stores.js';
import {lsrStyles} from './lsr-styles.js';
import { Application } from '../app-state.js';

// Global reference to the OpenLayers map
let olMap = null;

const lsrStyleCache = {};

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/**
 * Get the OpenLayers map instance
 */
export function getMap() {
    return olMap;
}

/**
 * Style function for SPC Convective Outlook
 */
function spcConvStyleFunction(feature) {
    const name = feature.get('name');
    const styles = {
        "General Thunder": { fill: "#c0e8c0", stroke: "#3c783c" },
        "Marginal Risk": { fill: "#7fc57f", stroke: "#3c783c" },
        "Slight Risk": { fill: "#f6f67f", stroke: "#ff9600" },
        "Enhanced Risk": { fill: "#e6c27f", stroke: "#ff7f00" },
        "Moderate Risk": { fill: "#e67f7f", stroke: "#cd0000" },
        "High Risk": { fill: "#ff00ff", stroke: "#000000" },
    };

    const styleConfig = styles[name] || { fill: "#000000", stroke: "#000000" };

    return new Style({
        fill: new Fill({
            color: styleConfig.fill + 'cc', // Add alpha
        }),
        stroke: new Stroke({
            color: styleConfig.stroke,
            width: 3,
        }),
    });
}

/**
 * Style function for Storm Based Warnings
 */
function sbwStyleFunction(feature) {
    const ptype = feature.get('ptype');
    const styles = {
        TO: { stroke: "red" },
        MA: { stroke: "purple" },
        FF: { stroke: "green" },
        EW: { stroke: "green" },
        FA: { stroke: "green" },
        FL: { stroke: "green" },
        SQ: { stroke: "yellow" },
        SV: { stroke: "yellow" },
    };

    const styleConfig = styles[ptype] || { stroke: "#000000" };

    return new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
        }),
        stroke: new Stroke({
            color: styleConfig.stroke,
            width: 3,
        }),
    });
}

/**
 * Style function for Local Storm Reports
 * Uses the imported lsrStyles configuration
 */
function lsrStyleFunction(feature) {
    const ptype = feature?.get('ptype');
    const styleKey = ptype ?? 'default';

    if (lsrStyleCache[styleKey]) {
        return lsrStyleCache[styleKey];
    }

    const iconPath = lsrStyles[styleKey]?.externalGraphic;
    const style = new Style({
        image: new Icon({
            src: iconPath || 'lsr-icons/other.png',
            anchor: [0.5, 1],
            scale: 0.9,
            crossOrigin: 'anonymous',
        }),
    });

    lsrStyleCache[styleKey] = style;
    return style;
}

function createIEMTileLayer(name, layername, checkedGroup) {
    const layer = new TileLayer({
        source: new XYZ({
            url: `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${layername}/{z}/{x}/{y}.png`,
            crossOrigin: 'anonymous',
        }),
        visible: false,
        opacity: 0.8,
    });
    layer.set('name', name);
    layer.set('checkedGroup', checkedGroup);
    layer.set('refreshable', true);
    return layer;
}

/**
 * Create vector layers for the map
 */
function createVectorLayers() {
    // Local Storm Reports layer
    const lsrsLayer = new VectorLayer({
        source: new VectorSource(),
        style: lsrStyleFunction,
        visible: true,
        properties: {
            name: 'Local Storm Reports',
            checkedGroup: 'Chatroom Products',
        },
    });

    // Storm Based Warnings layer
    const sbwsLayer = new VectorLayer({
        source: new VectorSource(),
        style: sbwStyleFunction,
        visible: true,
        properties: {
            name: 'Storm Based Warnings',
            checkedGroup: 'Chatroom Products',
        },
    });

    // Convective Sigmets layer
    const sigcLayer = new VectorLayer({
        source: new VectorSource({
            url: 'https://mesonet.agron.iastate.edu/geojson/convective_sigmet.php',
            format: new GeoJSON(),
        }),
        style: new Style({
            stroke: new Stroke({
                color: '#ff0000',
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.8)',
            }),
        }),
        visible: false,
        properties: {
            name: 'Convective Sigmets',
            checkedGroup: 'Aviation Weather Center Products',
        },
    });

    // SPC Day 1 Outlook
    const spc1Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.spc.noaa.gov/products/outlook/day1otlk.kml',
            format: new KML({ extractStyles: false }),
        }),
        style: spcConvStyleFunction,
        visible: false,
        properties: {
            name: 'Day 1 Convective Outlook',
            checkedGroup: 'Storm Prediction Center Products',
        },
    });

    // SPC Day 2 Outlook
    const spc2Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.spc.noaa.gov/products/outlook/day2otlk.kml',
            format: new KML({ extractStyles: false }),
        }),
        style: spcConvStyleFunction,
        visible: false,
        properties: {
            name: 'Day 2 Convective Outlook',
            checkedGroup: 'Storm Prediction Center Products',
        },
    });

    // SPC Day 3 Outlook
    const spc3Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.spc.noaa.gov/products/outlook/day3otlk.kml',
            format: new KML({ extractStyles: false }),
        }),
        style: spcConvStyleFunction,
        visible: false,
        properties: {
            name: 'Day 3 Convective Outlook',
            checkedGroup: 'Storm Prediction Center Products',
        },
    });

    // QPF Layers
    const qpf1Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day1_latest_netlink.kml',
            format: new KML({ extractStyles: true }),
        }),
        visible: false,
        properties: {
            name: 'Day 1 QPF',
            checkedGroup: 'HPC Precipitation Forecasts',
        },
    });

    const qpf2Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day2_latest_netlink.kml',
            format: new KML({ extractStyles: true }),
        }),
        visible: false,
        properties: {
            name: 'Day 2 QPF',
            checkedGroup: 'HPC Precipitation Forecasts',
        },
    });

    const qpf15Layer = new VectorLayer({
        source: new VectorSource({
            url: 'https://www.wpc.ncep.noaa.gov/kml/qpf/QPF120hr_Day1-5_latest_netlink.kml',
            format: new KML({ extractStyles: true }),
        }),
        visible: false,
        properties: {
            name: 'Day 1-5 QPF',
            checkedGroup: 'HPC Precipitation Forecasts',
        },
    });

    const ridgeIILayer = createIEMTileLayer(
        'NEXRAD Base Reflectivity',
        'nexrad-n0q-900913',
        'Precip',
    );

    const q2hsrLayer = createIEMTileLayer(
        'NMQ Hybrid Scan Reflectivity',
        'q2-hsr-900913',
        'Precip',
    );

    const q21hLayer = createIEMTileLayer(
        'NMQ Q2 1 Hour Precip',
        'q2-n1p-900913',
        'Precip',
    );

    const q21dLayer = createIEMTileLayer(
        'NMQ Q2 1 Day Precip',
        'q2-p24h-900913',
        'Precip',
    );

    const q22dLayer = createIEMTileLayer(
        'NMQ Q2 2 Day Precip',
        'q2-p48h-900913',
        'Precip',
    );

    const q23dLayer = createIEMTileLayer(
        'NMQ Q2 3 Day Precip',
        'q2-p72h-900913',
        'Precip',
    );

    const goesEastM1VISLayer = createIEMTileLayer(
        'GOES East Mesoscale1 Visible',
        'goes_east_mesoscale-1_ch02',
        'Satellite',
    );

    const goesWestM1VISLayer = createIEMTileLayer(
        'GOES West Mesoscale1 Visible',
        'goes_west_mesoscale-1_ch02',
        'Satellite',
    );

    const goesWestVISLayer = createIEMTileLayer(
        'GOES West Visible',
        'goes_west_conus_ch02',
        'Satellite',
    );

    const goesEastVISLayer = createIEMTileLayer(
        'GOES East Visible',
        'goes_west_conus_ch13',
        'Satellite',
    );

    return {
        lsrsLayer,
        sbwsLayer,
        sigcLayer,
        spc1Layer,
        spc2Layer,
        spc3Layer,
        qpf1Layer,
        qpf2Layer,
        qpf15Layer,
        ridgeIILayer,
        q2hsrLayer,
        q21hLayer,
        q21dLayer,
        q22dLayer,
        q23dLayer,
        goesEastM1VISLayer,
        goesWestM1VISLayer,
        goesWestVISLayer,
        goesEastVISLayer,
    };
}

/**
 * Set the app time display in the toolbar
 */
export function setAppTime() {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes - (minutes % 5);
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);

    const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const appTime = Ext.getCmp('appTime');
    if (appTime) {
        appTime.setText('Map Valid: ' + timeStr);
    }
}

/**
 * Setup click handlers for feature info popups
 */
function setupFeatureClickHandlers() {
    if (!olMap) {return;}

    olMap.on('click', function(evt) {
        const features = [];
        olMap.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            features.push({feature, layer});
        });

        if (features.length > 0) {
            const {feature, layer} = features[0];
            const props = feature.getProperties();
            const layerName = escapeHtml(layer.get('name') || 'Feature');

            // Build HTML content for popup
            let html = `<h3>${layerName}</h3><table>`;
            for (const [key, value] of Object.entries(props)) {
                if (key !== 'geometry') {
                    html += `<tr><td><b>${escapeHtml(key)}:</b></td><td>${escapeHtml(value)}</td></tr>`;
                }
            }
            html += '</table>';

            // Create ExtJS window as popup
            const popup = new Ext.Window({
                title: `${layerName} Information`,
                width: 400,
                maxHeight: 500,
                autoScroll: true,
                html: html,
                closable: true,
                closeAction: 'destroy',
            });
            popup.show();
        }
    });
}

/**
 * Create the OpenLayers 8 map
 */
export function createOLMap(targetDiv) {
    const vectorLayers = createVectorLayers();

    // Store references for backward compatibility
    Application.lsrsLayer = vectorLayers.lsrsLayer;
    Application.sbwsLayer = vectorLayers.sbwsLayer;

    // Create feature stores that sync with vector layers
    Application.lsrStore = createLSRStore(vectorLayers.lsrsLayer);
    Application.sbwStore = createSBWStore(vectorLayers.sbwsLayer);

    // Create a simple layer store for backward compatibility
    Application.layerstore = {
        data: {
            each: function(callback, scope) {
                if (!olMap) {return;}
                olMap.getLayers().forEach(layer => {
                    const record = {
                        getLayer: () => layer,
                        get: (key) => layer.get(key),
                    };
                    callback.call(scope, record);
                });
            }
        },
        find: function(field, value) {
            let index = -1;
            if (!olMap) {return index;}
            olMap.getLayers().forEach((layer, idx) => {
                if (layer.get(field) === value || layer.get('name') === value) {
                    index = idx;
                }
            });
            return index;
        },
        getAt: function(index) {
            if (!olMap) {return null;}
            const layer = olMap.getLayers().item(index);
            return layer ? {
                getLayer: () => layer,
                get: (key) => layer.get(key),
            } : null;
        }
    };

    olMap = new Map({
        target: targetDiv,
        layers: [
            new TileLayer({
                source: new OSM(),
                properties: {
                    name: 'OpenStreetMap',
                    type: 'base',
                },
            }),
            ...Object.values(vectorLayers),
        ],
        view: new View({
            center: fromLonLat([-95.0, 42.0]),
            zoom: 5,
        }),
        controls: defaultControls(),
    });

    const layersByName = {};
    olMap.getLayers().forEach((layer) => {
        const layerName = layer.get('name') || (layer.getProperties && layer.getProperties().name);
        if (layerName) {
            layersByName[layerName] = layer;
        }
    });
    Application.mapLayersByName = layersByName;

    return olMap;
}

/**
 * Custom ExtJS panel that hosts an OpenLayers 8 map
 */
export function createMapPanel() {
    function ensureLSRGridWindow() {
        let win = Ext.getCmp('lsrgrid');
        if (win) {
            return win;
        }
        win = new Ext.Window({
            id: 'lsrgrid',
            title: 'Local Storm Reports',
            width: 950,
            height: 360,
            closeAction: 'hide',
            layout: 'fit',
            items: [
                new Ext.grid.GridPanel({
                    store: Application.lsrStore,
                    stripeRows: true,
                    columns: [
                        { header: 'Valid', dataIndex: 'valid', width: 160 },
                        { header: 'Message', dataIndex: 'message', flex: 1 },
                    ],
                }),
            ],
        });
        return win;
    }

    function ensureSBWGridWindow() {
        let win = Ext.getCmp('sbwgrid');
        if (win) {
            return win;
        }
        win = new Ext.Window({
            id: 'sbwgrid',
            title: 'Storm Based Warnings',
            width: 900,
            height: 320,
            closeAction: 'hide',
            layout: 'fit',
            items: [
                new Ext.grid.GridPanel({
                    store: Application.sbwStore,
                    stripeRows: true,
                    columns: [
                        { header: 'Issue', dataIndex: 'issue', width: 150 },
                        { header: 'Expire', dataIndex: 'expire', width: 150 },
                        { header: 'Phenomena', dataIndex: 'phenomena', width: 90 },
                        { header: 'Significance', dataIndex: 'significance', width: 100 },
                        { header: 'WFO', dataIndex: 'wfo', width: 80 },
                        { header: 'Status', dataIndex: 'status', width: 80 },
                        { header: 'Type', dataIndex: 'ptype', id: 'sbw-type-col' },
                    ],
                    autoExpandColumn: 'sbw-type-col',
                }),
            ],
        });
        return win;
    }

    return {
        xtype: 'panel',
        region: 'center',
        id: 'map',
        layout: 'fit',
        height: 600,
        split: true,
        html: '<div id="ol-map" style="width:100%; height:100%;"></div>',
        listeners: {
            afterrender: function() {
                // Create the OpenLayers map after the panel renders
                // Use a short delay to ensure the container has proper dimensions
                setTimeout(() => {
                    const mapDiv = document.getElementById('ol-map');
                    if (mapDiv) {
                        createOLMap(mapDiv);
                        setAppTime();
                        setupFeatureClickHandlers();

                        // Store map reference on the panel
                        this.map = getMap();
                    }
                }, 100);
            },
            resize: function() {
                // Update map size when panel resizes
                if (olMap) {
                    olMap.updateSize();
                }
            },
        },
        tbar: [
            {
                xtype: 'splitbutton',
                text: 'Favorites',
                handler: function() {
                    // TODO: Implement favorites
                    console.log('Favorites clicked');
                },
            },
            {
                xtype: 'tbtext',
                text: 'Map Valid: 12:00 AM',
                id: 'appTime',
            },
            '-',
            {
                text: 'Tools',
                menu: {
                    items: [
                        {
                            text: 'LSR Grid',
                            handler: function() {
                                ensureLSRGridWindow().show();
                            },
                        },
                        {
                            text: 'SBW Grid',
                            handler: function() {
                                ensureSBWGridWindow().show();
                            },
                        },
                        {
                            text: 'Show Legend',
                            handler: function() {
                                const legendsHtml = document.getElementById('legends')
                                    ? document.getElementById('legends').innerHTML
                                    : '<p>Legend content unavailable.</p>';
                                let legendWindow = Ext.getCmp('maplegend');
                                if (!legendWindow) {
                                    legendWindow = new Application.MapLegend({
                                        id: 'maplegend',
                                        html: legendsHtml,
                                    });
                                } else if (legendWindow.body && legendWindow.body.update) {
                                    legendWindow.body.update(legendsHtml);
                                }
                                legendWindow.show();
                            },
                        },
                    ],
                },
            },
            '-',
            'Opacity',
            {
                xtype: 'slider',
                width: 100,
                value: 100,
                minValue: 0,
                maxValue: 100,
                increment: 5,
                plugins: new Ext.slider.Tip({
                    getText: function(thumb) {
                        return String(thumb.value) + '%';
                    }
                }),
                listeners: {
                    change: function(slider, value) {
                        // Update opacity for all vector layers
                        const opacity = value / 100;
                        const map = getMap();
                        if (map) {
                            map.getLayers().forEach(layer => {
                                if (layer instanceof VectorLayer) {
                                    layer.setOpacity(opacity);
                                }
                            });
                        }
                    }
                }
            },
        ],
    };
}

/**
 * Create layer tree panel that controls map layers
 */
export function createLayerTree() {
    function handleLayerToggle(layerName, visible) {
        if (!layerName) {
            return;
        }
        setLayerVisibleByName(layerName, visible);
    }

    function setLayerVisibleByName(layerName, visible) {
        if (!layerName || !olMap) {
            return;
        }
        let layer =
            Application.mapLayersByName && Application.mapLayersByName[layerName]
                ? Application.mapLayersByName[layerName]
                : null;
        if (!layer) {
            const layers = olMap.getLayers().getArray();
            layer = layers.find((candidateLayer) =>
                candidateLayer.get('name') === layerName ||
                candidateLayer.getProperties().name === layerName
            );
        }
        if (layer) {
            layer.setVisible(visible);
            if (visible) {
                const source = layer.getSource && layer.getSource();
                if (source && source.refresh) {
                    source.refresh();
                }
            }
            if (olMap.renderSync) {
                olMap.renderSync();
            }
        }
    }

    return {
        xtype: 'treepanel',
        region: 'east',
        width: 150,
        collapsible: true,
        split: true,
        title: 'Layers Control',
        autoScroll: true,
        rootVisible: false,
        root: {
            nodeType: 'async',
            children: [
                {
                    text: 'Base Layers',
                    expanded: true,
                    children: [
                        {
                            text: 'OpenStreetMap',
                            checked: true,
                            leaf: true,
                        },
                    ],
                },
                {
                    text: 'Precip',
                    children: [
                        {
                            text: 'NEXRAD Base Reflectivity',
                            checked: false,
                            leaf: true,
                            layerName: 'NEXRAD Base Reflectivity',
                        },
                        {
                            text: 'NMQ Hybrid Scan Reflectivity',
                            checked: false,
                            leaf: true,
                            layerName: 'NMQ Hybrid Scan Reflectivity',
                        },
                        {
                            text: 'NMQ Q2 1 Hour Precip',
                            checked: false,
                            leaf: true,
                            layerName: 'NMQ Q2 1 Hour Precip',
                        },
                        {
                            text: 'NMQ Q2 1 Day Precip',
                            checked: false,
                            leaf: true,
                            layerName: 'NMQ Q2 1 Day Precip',
                        },
                        {
                            text: 'NMQ Q2 2 Day Precip',
                            checked: false,
                            leaf: true,
                            layerName: 'NMQ Q2 2 Day Precip',
                        },
                        {
                            text: 'NMQ Q2 3 Day Precip',
                            checked: false,
                            leaf: true,
                            layerName: 'NMQ Q2 3 Day Precip',
                        },
                    ],
                },
                {
                    text: 'Satellite',
                    children: [
                        {
                            text: 'GOES East Mesoscale1 Visible',
                            checked: false,
                            leaf: true,
                            layerName: 'GOES East Mesoscale1 Visible',
                        },
                        {
                            text: 'GOES West Mesoscale1 Visible',
                            checked: false,
                            leaf: true,
                            layerName: 'GOES West Mesoscale1 Visible',
                        },
                        {
                            text: 'GOES West Visible',
                            checked: false,
                            leaf: true,
                            layerName: 'GOES West Visible',
                        },
                        {
                            text: 'GOES East Visible',
                            checked: false,
                            leaf: true,
                            layerName: 'GOES East Visible',
                        },
                    ],
                },
                {
                    text: 'Chatroom Products',
                    expanded: true,
                    children: [
                        {
                            text: 'Local Storm Reports',
                            checked: true,
                            leaf: true,
                            layerName: 'Local Storm Reports',
                        },
                        {
                            text: 'Storm Based Warnings',
                            checked: true,
                            leaf: true,
                            layerName: 'Storm Based Warnings',
                        },
                    ],
                },
                {
                    text: 'Storm Prediction Center Products',
                    children: [
                        {
                            text: 'Day 1 Convective Outlook',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 1 Convective Outlook',
                        },
                        {
                            text: 'Day 2 Convective Outlook',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 2 Convective Outlook',
                        },
                        {
                            text: 'Day 3 Convective Outlook',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 3 Convective Outlook',
                        },
                    ],
                },
                {
                    text: 'HPC Precipitation Forecasts',
                    children: [
                        {
                            text: 'Day 1 QPF',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 1 QPF',
                        },
                        {
                            text: 'Day 2 QPF',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 2 QPF',
                        },
                        {
                            text: 'Day 1-5 QPF',
                            checked: false,
                            leaf: true,
                            layerName: 'Day 1-5 QPF',
                        },
                    ],
                },
                {
                    text: 'Aviation Weather Center Products',
                    children: [
                        {
                            text: 'Convective Sigmets',
                            checked: false,
                            leaf: true,
                            layerName: 'Convective Sigmets',
                        },
                    ],
                },
            ],
        },
        listeners: {
            afterrender: function(tree) {
                tree.on('checkchange', function(node, checked) {
                    if (node && node.data && node.data.layerName) {
                        handleLayerToggle(node.data.layerName, checked);
                    }
                });

                const view = tree.getView && tree.getView();
                if (view && view.on) {
                    view.on('itemclick', function(_view, record, item, _index, event) {
                        if (!record || !record.data || !record.data.layerName) {
                            return;
                        }
                        const isCheckboxClick = Boolean(
                            event && event.getTarget && event.getTarget('.x-tree-checkbox', item),
                        );
                        if (isCheckboxClick) {
                            return;
                        }
                        const currentChecked = Boolean(record.get('checked'));
                        const nextChecked = !currentChecked;
                        record.set('checked', nextChecked);
                        handleLayerToggle(record.data.layerName, nextChecked);
                    });
                }
            },
        },
    };
}

// Map refresh task - periodically reloads visible layers
if (typeof Application !== 'undefined') {
    Application.MapTask = {
        skipFirst: true,
        run: function () {
            if (this.skipFirst) {
                this.skipFirst = false;
                return;
            }
            // Reload all vector layers to get fresh data
            const map = getMap();
            if (map) {
                map.getLayers().forEach(layer => {
                    const source = layer.getSource();
                    if (source && source.refresh && layer.getVisible()) {
                        source.refresh();
                    }
                });
                setAppTime();
            }
        },
        interval: 300000, // 5 minutes
    };
}

// Export Application.LayerTree for backward compatibility
if (typeof Application !== 'undefined') {
    Application.LayerTree = createLayerTree();
}

export default createMapPanel();
