/**
 * MapPanel Module - OpenLayers 8 Version
 * Modern OpenLayers 8 map with ExtJS 6 integration (no GeoExt)
 */

import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat, transformExtent} from 'ol/proj';
import {defaults as defaultControls} from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import KML from 'ol/format/KML';
import GeoJSON from 'ol/format/GeoJSON';
import {Style, Fill, Stroke, Circle as CircleStyle} from 'ol/style';
import {createLSRStore, createSBWStore} from './feature-stores.js';

// Global reference to the OpenLayers map
let olMap = null;

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
function lsrStyleFunction() {
    // TODO: Import and use lsrStyles from lsr-styles.js
    // For now, using a simple circle
    return new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: '#ff0000',
            }),
        }),
    });
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
    if (!olMap) return;

    olMap.on('click', function(evt) {
        const features = [];
        olMap.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            features.push({feature, layer});
        });

        if (features.length > 0) {
            const {feature, layer} = features[0];
            const props = feature.getProperties();
            const layerName = layer.get('name') || 'Feature';

            // Build HTML content for popup
            let html = `<h3>${layerName}</h3><table>`;
            for (const [key, value] of Object.entries(props)) {
                if (key !== 'geometry') {
                    html += `<tr><td><b>${key}:</b></td><td>${value}</td></tr>`;
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
                if (!window.olMap) return;
                window.olMap.getLayers().forEach(layer => {
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
            if (!window.olMap) return index;
            window.olMap.getLayers().forEach((layer, idx) => {
                if (layer.get(field) === value || layer.get('name') === value) {
                    index = idx;
                }
            });
            return index;
        },
        getAt: function(index) {
            if (!window.olMap) return null;
            const layer = window.olMap.getLayers().item(index);
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
            extent: transformExtent([-130, 20, -65, 50], 'EPSG:4326', 'EPSG:3857'),
        }),
        controls: defaultControls(),
    });

    return olMap;
}

/**
 * Custom ExtJS panel that hosts an OpenLayers 8 map
 */
export function createMapPanel() {
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
                        this.map = window.olMap;
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
                                if (!Ext.getCmp('lsrgrid')) {
                                    new Application.LSRGrid({ id: 'lsrgrid' });
                                }
                                Ext.getCmp('lsrgrid').show();
                            },
                        },
                        {
                            text: 'SBW Grid',
                            handler: function() {
                                if (!Ext.getCmp('sbwgrid')) {
                                    new Application.SBWGrid({ id: 'sbwgrid' });
                                }
                                Ext.getCmp('sbwgrid').show();
                            },
                        },
                        {
                            text: 'Show Legend',
                            handler: function() {
                                if (!Ext.getCmp('maplegend')) {
                                    new Application.MapLegend({
                                        id: 'maplegend',
                                        contentEl: 'legends',
                                    });
                                }
                                Ext.getCmp('maplegend').show();
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
                        if (window.olMap) {
                            window.olMap.getLayers().forEach(layer => {
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
            checkchange: (node, checked) => {
                if (node.data && node.data.layerName && olMap) {
                    const layers = olMap.getLayers().getArray();
                    const layer = layers.find(l =>
                        l.get('name') === node.data.layerName
                    );
                    if (layer) {
                        layer.setVisible(checked);
                    }
                }
            },
        },
    };
}

// Map refresh task - periodically reloads visible layers
if (typeof window !== 'undefined' && window.Application) {
    window.Application.MapTask = {
        skipFirst: true,
        run: function () {
            if (this.skipFirst) {
                this.skipFirst = false;
                return;
            }
            // Reload all vector layers to get fresh data
            const map = window.olMap;
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
if (typeof window !== 'undefined' && window.Application) {
    window.Application.LayerTree = createLayerTree();
}

export default createMapPanel();
