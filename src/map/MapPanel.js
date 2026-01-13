/**
 * MapPanel Module
 * Map layers, styles, stores, and GeoExt components for the weather mapping interface
 */

import { lsrStyles } from './lsr-styles.js';

// SPC Convective Outlook Styles
const spcConvStyles = {
  "General Thunder": {
    fillColor: '#c0e8c0',
    strokeColor: '#3c783c',
    graphicZIndex: 2
  },
  "Marginal Risk": {
    fillColor: '#7fc57f',
    strokeColor: '#3c783c',
    graphicZIndex: 3
  },
  "Slight Risk": {
    fillColor: '#f6f67f',
    strokeColor: '#ff9600',
    graphicZIndex: 4
  },
  "Enhanced Risk": {
    fillColor: '#e6c27f',
    strokeColor: '#ff7f00',
    graphicZIndex: 5
  },
  "Moderate Risk": {
    fillColor: '#e67f7f',
    strokeColor: '#cd0000',
    graphicZIndex: 6
  },
  "High Risk": {
    fillColor: '#ff00ff',
    strokeColor: '#000000',
    graphicZIndex: 7
  }
};

const spcConvStyleMap = new OpenLayers.StyleMap({
  'default': {
    fillColor: '#000000',
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 0.8
  }
});
spcConvStyleMap.addUniqueValueRules('default', 'name', spcConvStyles);

const sigcStyleMap = new OpenLayers.StyleMap({
  'default': {
    strokeColor: '#ff0000',
    graphicZIndex: 4,
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 0.8
  }
});

const sbwStyleMap = new OpenLayers.StyleMap({
  'default': {
    graphicZIndex: 1,
    strokeWidth: 3,
    fillOpacity: 0.4,
    strokeOpacity: 1
  },
  'select': {
    fillOpacity: 1
  }
});

const sbwStyles = {
  "TO": { strokeColor: 'red', graphicZIndex: 9 },
  "MA": { strokeColor: 'purple', graphicZIndex: 7 },
  "FF": { strokeColor: 'green', graphicZIndex: 7 },
  "EW": { strokeColor: 'green', graphicZIndex: 6 },
  "FA": { strokeColor: 'green', graphicZIndex: 6 },
  "FL": { strokeColor: 'green', graphicZIndex: 6 },
  "SQ": { strokeColor: 'yellow', graphicZIndex: 8 },
  "SV": { strokeColor: 'yellow', graphicZIndex: 8 }
};

const lsrStyleMap = new OpenLayers.StyleMap({
  'default': {
    pointRadius: 10,
    fillOpacity: 1,
    graphicZIndex: 6
  },
  'select': {
    fillOpacity: 1
  }
});

// Import shared LSR styles
// const lsrStyles defined in lsr-styles.js

lsrStyleMap.addUniqueValueRules('default', 'ptype', lsrStyles);
sbwStyleMap.addUniqueValueRules('default', 'ptype', sbwStyles);

// Vector Layers
const sigc = new OpenLayers.Layer.Vector("Convective Sigmets", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'Aviation Weather Center Products',
  sphericalMercator: true,
  styleMap: sigcStyleMap,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://mesonet.agron.iastate.edu/geojson/convective_sigmet.php",
    format: new OpenLayers.Format.GeoJSON({
      projection: new OpenLayers.Projection("EPSG:4326"),
      internalProjection: new OpenLayers.Projection("EPSG:900913"),
      extractAttributes: true
    })
  })
});

const qpf1 = new OpenLayers.Layer.Vector("Day 1 QPF", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'HPC Precipitation Forecasts',
  sphericalMercator: true,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day1_latest_netlink.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: true,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const qpf2 = new OpenLayers.Layer.Vector("Day 2 QPF", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'HPC Precipitation Forecasts',
  sphericalMercator: true,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day2_latest_netlink.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: true,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const spc1 = new OpenLayers.Layer.Vector("Day 1 Convective Outlook", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'Storm Prediction Center Products',
  sphericalMercator: true,
  styleMap: spcConvStyleMap,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.spc.noaa.gov/products/outlook/day1otlk.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: false,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const spc2 = new OpenLayers.Layer.Vector("Day 2 Convective Outlook", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'Storm Prediction Center Products',
  sphericalMercator: true,
  styleMap: spcConvStyleMap,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.spc.noaa.gov/products/outlook/day2otlk.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: false,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const spc3 = new OpenLayers.Layer.Vector("Day 3 Convective Outlook", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'Storm Prediction Center Products',
  sphericalMercator: true,
  styleMap: spcConvStyleMap,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.spc.noaa.gov/products/outlook/day3otlk.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: false,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const qpf15 = new OpenLayers.Layer.Vector("Day 1-5 QPF", {
  strategies: [new OpenLayers.Strategy.Fixed()],
  checkedGroup: 'HPC Precipitation Forecasts',
  sphericalMercator: true,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326"),
  visibility: false,
  protocol: new OpenLayers.Protocol.HTTP({
    url: "https://www.wpc.ncep.noaa.gov/kml/qpf/QPF120hr_Day1-5_latest_netlink.kml",
    format: new OpenLayers.Format.KML({
      extractStyles: true,
      extractAttributes: true,
      maxDepth: 2
    })
  })
});

const lsrs = new OpenLayers.Layer.Vector("Local Storm Reports", {
  styleMap: lsrStyleMap,
  checkedGroup: 'Chatroom Products',
  sphericalMercator: true,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326")
});

const sbws = new OpenLayers.Layer.Vector("Storm Based Warnings", {
  styleMap: sbwStyleMap,
  checkedGroup: 'Chatroom Products',
  sphericalMercator: true,
  rendererOptions: { zIndexing: true },
  projection: new OpenLayers.Projection("EPSG:4326")
});

// Feature Stores
if (typeof window !== 'undefined') {
  Application.lsrStore = new GeoExt.data.FeatureStore({
    layer: lsrs,
    sortInfo: {
      field: 'valid',
      direction: 'DESC'
    },
    fields: [{
      name: 'message'
    }, {
      name: 'valid',
      type: 'date'
    }]
  });

  Application.sbwStore = new GeoExt.data.FeatureStore({
    layer: sbws,
    id: 'vtec',
    sortInfo: {
      field: 'expire',
      direction: 'ASC'
    },
    fields: [{
      name: 'message'
    }, {
      name: 'expire',
      type: 'date'
    }, {
      name: 'vtec'
    }]
  });
}

// Link Interceptor for opening links in new tabs
const LinkInterceptor = {
  render: function(p) {
    p.body.on({
      'mousedown': function(e, t) {
        t.target = '_blank';
      },
      'click': function(e, t) {
        if (String(t.target).toLowerCase() != '_blank') {
          e.stopEvent();
          window.open(t.href);
        }
      },
      delegate: 'a'
    });
  }
};

// LSR Grid Window
if (typeof window !== 'undefined') {
  Application.LSRGrid = Ext.extend(Ext.Window, {
    title: 'Local Storm Reports',
    closeAction: 'hide',
    width: 500,
    height: 300,
    layout: 'fit',
    constrain: true,
    hidden: true,
    initComponent: function() {
      this.items = [{
        xtype: 'grid',
        sm: new Ext.grid.RowSelectionModel({
          singleSelect: true,
          listeners: {
            rowselect: function(sm, rowIdx, record) {
              const lonlat = new OpenLayers.LonLat(
                record.data.feature.geometry.x,
                record.data.feature.geometry.y
              );
              Ext.getCmp("map").map.panTo(lonlat, 5);
            }
          }
        }),
        store: Application.lsrStore,
        stripeRows: true,
        listeners: LinkInterceptor,
        autoExpandColumn: 'message',
        autoScroll: true,
        columns: [{
          dataIndex: 'valid',
          header: 'Valid',
          width: 100,
          sortable: true,
          renderer: function(value) {
            return value.fromUTC().format('j M g:i A');
          }
        }, {
          id: 'message',
          dataIndex: 'message',
          header: 'Message'
        }]
      }];
      Application.LSRGrid.superclass.initComponent.apply(this, arguments);
    }
  });

  Application.SBWGrid = Ext.extend(Ext.Window, {
    title: 'Storm Based Warnings',
    closeAction: 'hide',
    width: 500,
    height: 300,
    layout: 'fit',
    constrain: true,
    hidden: true,
    initComponent: function() {
      this.items = [{
        xtype: 'grid',
        sm: new Ext.grid.RowSelectionModel({
          singleSelect: true,
          listeners: {
            rowselect: function(sm, rowIdx, record) {
              Ext.getCmp("map").map.zoomToExtent(
                record.data.feature.geometry.getBounds()
              );
            }
          }
        }),
        store: Application.sbwStore,
        stripeRows: true,
        listeners: LinkInterceptor,
        autoExpandColumn: 'message',
        autoScroll: true,
        columns: [{
          dataIndex: 'expire',
          header: 'Expires',
          width: 100,
          sortable: true,
          renderer: function(value) {
            return value.fromUTC().format('j M g:i A');
          }
        }, {
          id: 'message',
          dataIndex: 'message',
          header: 'Message'
        }]
      }];
      Application.SBWGrid.superclass.initComponent.apply(this, arguments);
    }
  });
}

// Feature selection handlers
sbws.events.on({
  featureselected: function(e) {
    const html = e.feature.attributes.message;
    const popup = new GeoExt.Popup({
      map: this.map,
      location: e.feature,
      feature: e.feature,
      title: "Event",
      width: 200,
      html: html,
      listeners: LinkInterceptor,
      collapsible: true
    });
    popup.on({
      close: function() {
        if (OpenLayers.Util.indexOf(sbws.selectedFeatures, this.feature) > -1) {
          Ext.getCmp('map').map.controls[3].unselect(this.feature);
        }
      }
    });
    popup.show();
  }
});

lsrs.events.on({
  featureselected: function(e) {
    const html = e.feature.attributes.message;
    const popup = new GeoExt.Popup({
      map: this.map,
      location: e.feature,
      feature: e.feature,
      title: "Event",
      width: 200,
      html: html,
      listeners: LinkInterceptor,
      collapsible: true
    });
    popup.on({
      close: function() {
        if (OpenLayers.Util.indexOf(lsrs.selectedFeatures, this.feature) > -1) {
          Ext.getCmp('map').map.controls[3].unselect(this.feature);
        }
      }
    });
    popup.show();
  }
});

// TMS Layer URL generator
function get_my_url(bounds) {
  const res = this.map.getResolution();
  const x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
  const y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
  const z = this.map.getZoom();
  const path = z + "/" + x + "/" + y + "." + this.type + "?" + parseInt(Math.random() * 9999);
  let url = this.url;
  if (url instanceof Array) {
    url = this.selectUrl(path, url);
  }
  return url + this.service + "/" + this.layername + "/" + path;
}

// NEXRAD and Weather Layers
const ridgeII = new OpenLayers.Layer.TMS('NEXRAD Base Reflectivity',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'nexrad-n0q-900913',
    service: '1.0.0',
    type: 'png',
    checkedGroup: 'Precip',
    visibility: false,
    refreshable: true,
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const q2hsr = new OpenLayers.Layer.TMS('NMQ Hybrid Scan Reflectivity',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'q2-hsr-900913',
    service: '1.0.0',
    type: 'png',
    checkedGroup: 'Precip',
    opacity: 0.8,
    visibility: false,
    refreshable: true,
    getURL: get_my_url,
    isBaseLayer: false
  });

const q21h = new OpenLayers.Layer.TMS('NMQ Q2 1 Hour Precip',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'q2-n1p-900913',
    service: '1.0.0',
    type: 'png',
    checkedGroup: 'Precip',
    opacity: 0.8,
    visibility: false,
    refreshable: true,
    getURL: get_my_url,
    isBaseLayer: false
  });

const q21d = new OpenLayers.Layer.TMS('NMQ Q2 1 Day Precip',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'q2-p24h-900913',
    service: '1.0.0',
    type: 'png',
    checkedGroup: 'Precip',
    visibility: false,
    refreshable: true,
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const q22d = new OpenLayers.Layer.TMS('NMQ Q2 2 Day Precip',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'q2-p48h-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Precip',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const q23d = new OpenLayers.Layer.TMS('NMQ Q2 3 Day Precip',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'q2-p72h-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Precip',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

// GOES Satellite Layers
const goesEastM1VIS = new OpenLayers.Layer.TMS('GOES East Mesoscale1 Visible',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_east_mesoscale-1_ch02',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const goesWestM1VIS = new OpenLayers.Layer.TMS('GOES West Mesoscale1 Visible',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_west_mesoscale-1_ch02',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const goesWestVIS = new OpenLayers.Layer.TMS('GOES West Visible',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_west_conus_ch02',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const goesEastVIS = new OpenLayers.Layer.TMS('GOES East Visible',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_west_conus_ch13',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const goesEastWV = new OpenLayers.Layer.TMS('GOES East Water Vapor',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_east_conus_ch09',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

const goesWestWV = new OpenLayers.Layer.TMS('GOES West Water Vapor',
  'https://mesonet.agron.iastate.edu/cache/tile.py/', {
    layername: 'goes_west_conus_ch09',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    refreshable: true,
    checkedGroup: 'Satellite',
    opacity: 0.8,
    getURL: get_my_url,
    isBaseLayer: false
  });

// Political Boundary Layers
const firezones = new OpenLayers.Layer.TMS('NWS Fire Zones',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'fz-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const counties = new OpenLayers.Layer.TMS('US Counties',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'uscounties',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const states = new OpenLayers.Layer.TMS('US States',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'usstates',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const wfo = new OpenLayers.Layer.TMS('NWS WFO CWA',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'wfo-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const cwsu = new OpenLayers.Layer.TMS('NWS CWSU',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'cwsu-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const tribal = new OpenLayers.Layer.TMS('Tribal Boundaries',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'tribal-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

const rfc = new OpenLayers.Layer.TMS('NWS RFC HSA',
  'https://mesonet.agron.iastate.edu/c/c.py/', {
    layername: 'rfc-900913',
    service: '1.0.0',
    type: 'png',
    visibility: false,
    checkedGroup: 'Political Boundaries',
    opacity: 1,
    getURL: get_my_url,
    isBaseLayer: false
  });

// Set the time display above the map
function setAppTime() {
  const now = new Date();
  const now5 = now.add(Date.MINUTE, 0 - (parseInt(now.format('i')) % 5));
  if (Ext.getCmp('appTime')) {
    Ext.getCmp('appTime').setText('Map Valid: ' + now5.format('g:i A'));
  }
}

// ESRI Base Layer (long layerInfo definition)
const baseESRILayer = new OpenLayers.Layer.ArcGISCache("ESRI Topo",
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", {
    layerInfo: {
      "currentVersion": 10.2,
      "serviceDescription": "This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone.",
      "mapName": "Layers",
      "copyrightText": "Sources: Esri, HERE, DeLorme, TomTom, and others",
      "supportsDynamicLayers": false,
      "layers": [{ "id": 0, "name": "Citations", "parentLayerId": -1, "defaultVisibility": false, "subLayerIds": null, "minScale": 0, "maxScale": 0 }],
      "tables": [],
      "spatialReference": { "wkid": 102100, "latestWkid": 3857 },
      "singleFusedMapCache": true,
      "tileInfo": {
        "rows": 256,
        "cols": 256,
        "dpi": 96,
        "format": "JPEG",
        "compressionQuality": 90,
        "origin": { "x": -2.0037508342787E7, "y": 2.0037508342787E7 },
        "spatialReference": { "wkid": 102100, "latestWkid": 3857 },
        "lods": [
          { "level": 0, "resolution": 156543.03392800014, "scale": 5.91657527591555E8 },
          { "level": 1, "resolution": 78271.51696399994, "scale": 2.95828763795777E8 },
          { "level": 2, "resolution": 39135.75848200009, "scale": 1.47914381897889E8 },
          { "level": 3, "resolution": 19567.87924099992, "scale": 7.3957190948944E7 },
          { "level": 4, "resolution": 9783.93962049996, "scale": 3.6978595474472E7 },
          { "level": 5, "resolution": 4891.96981024998, "scale": 1.8489297737236E7 },
          { "level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618 },
          { "level": 7, "resolution": 1222.992452562495, "scale": 4622324.434309 },
          { "level": 8, "resolution": 611.4962262813797, "scale": 2311162.217155 },
          { "level": 9, "resolution": 305.74811314055756, "scale": 1155581.108577 },
          { "level": 10, "resolution": 152.87405657041106, "scale": 577790.554289 },
          { "level": 11, "resolution": 76.43702828507324, "scale": 288895.277144 },
          { "level": 12, "resolution": 38.21851414253662, "scale": 144447.638572 },
          { "level": 13, "resolution": 19.10925707126831, "scale": 72223.819286 },
          { "level": 14, "resolution": 9.554628535634155, "scale": 36111.909643 },
          { "level": 15, "resolution": 4.77731426794937, "scale": 18055.954822 },
          { "level": 16, "resolution": 2.388657133974685, "scale": 9027.977411 },
          { "level": 17, "resolution": 1.1943285668550503, "scale": 4513.988705 },
          { "level": 18, "resolution": 0.5971642835598172, "scale": 2256.994353 },
          { "level": 19, "resolution": 0.29858214164761665, "scale": 1128.497176 }
        ]
      },
      "initialExtent": {
        "xmin": -1.9003965069419548E7,
        "ymin": -236074.10024122056,
        "xmax": 1.9003965069419548E7,
        "ymax": 1.458937939490844E7,
        "spatialReference": { "cs": "pcs", "wkid": 102100 }
      },
      "fullExtent": {
        "xmin": -2.0037507067161843E7,
        "ymin": -1.9971868880408604E7,
        "xmax": 2.0037507067161843E7,
        "ymax": 1.997186888040863E7,
        "spatialReference": { "cs": "pcs", "wkid": 102100 }
      },
      "minScale": 5.91657527591555E8,
      "maxScale": 1128.497176,
      "units": "esriMeters"
    }
  });

// Layer Store
if (typeof window !== 'undefined') {
  Application.layerstore = new GeoExt.data.LayerStore({
    layers: [
      baseESRILayer,
      new OpenLayers.Layer("No Overlay", { checkedGroup: 'Precip', isBaseLayer: false, visibility: true }),
      q2hsr, ridgeII, goesEastVIS, goesEastWV, goesEastM1VIS,
      goesWestVIS, goesWestWV, goesWestM1VIS,
      q21h, q21d, q22d, q23d,
      sbws, lsrs,
      qpf15, qpf2, qpf1,
      spc3, spc2, spc1,
      new OpenLayers.Layer("Blank", { isBaseLayer: true, visibility: false }),
      counties, states, tribal, cwsu, firezones, rfc, wfo
    ]
  });

  // Map refresh task
  Application.MapTask = {
    skipFirst: true,
    run: function() {
      if (this.skipFirst) {
        this.skipFirst = false;
        return;
      }
      Application.layerstore.data.each(function(record) {
        const layer = record.getLayer();
        if (layer.refreshable && layer.getVisibility()) {
          layer.redraw(true);
        }
        setAppTime();
      });
    },
    interval: 300000
  };

  // Layer Tree Configuration
  const layerRoot = new Ext.tree.TreeNode({
    text: "All Layers",
    expanded: true
  });

  layerRoot.appendChild(new GeoExt.tree.BaseLayerContainer({
    text: "Base Layer",
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "Satellite",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        return layer.checkedGroup === 'Satellite';
      },
      baseAttrs: {
        iconCls: 'gx-tree-baselayer-icon',
        checkedGroup: 'rasters'
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "Precip/RADAR",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        if (layer.isBaseLayer) return false;
        return layer.checkedGroup === 'Precip';
      },
      baseAttrs: {
        iconCls: 'gx-tree-baselayer-icon',
        checkedGroup: 'rasters'
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "Chatroom Products",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        if (layer.isBaseLayer) return false;
        return layer.checkedGroup === 'Chatroom Products';
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "HPC Precipitation Forecasts",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        if (layer.isBaseLayer) return false;
        return layer.checkedGroup === 'HPC Precipitation Forecasts';
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "Storm Prediction Center Products",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        if (layer.isBaseLayer) return false;
        return layer.checkedGroup === 'Storm Prediction Center Products';
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text: "Political Boundaries",
    loader: {
      filter: function(record) {
        const layer = record.getLayer();
        if (layer.isBaseLayer) return false;
        return layer.checkedGroup === 'Political Boundaries';
      }
    },
    layerstore: Application.layerstore,
    expanded: true
  }));

  // Layer controls
  Application.LayerSlider = {
    'xtype': 'gx_opacityslider',
    id: 'layerslider',
    width: 200,
    value: 80,
    layer: ridgeII
  };

  Application.LayerTree = {
    region: 'east',
    xtype: 'treepanel',
    root: layerRoot,
    autoScroll: true,
    rootVisible: false,
    width: 150,
    collapsible: true,
    split: true,
    title: 'Layers Control',
    listeners: {
      click: function(n) {
        Ext.getCmp("layerslider").setLayer(n.attributes.layer);
      }
    }
  };

  // MapPanel Configuration
  Application.MapPanel = {
    region: 'center',
    height: 600,
    split: true,
    xtype: 'gx_mappanel',
    id: 'map',
    listeners: {
      afterrender: function(mp) {
        setAppTime();
      }
    },
    map: {
      projection: new OpenLayers.Projection("EPSG:900913"),
      units: "m",
      numZoomLevels: 18,
      maxResolution: 156543.0339,
      controls: [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoom(),
        new OpenLayers.Control.ArgParser()
      ],
      maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
    },
    layers: Application.layerstore,
    extent: new OpenLayers.Bounds(-14427682, 1423562, -7197350, 8673462),
    tbar: [{
      xtype: 'splitbutton',
      icon: 'icons/favorites.png',
      handler: function() {
        const bnds = Ext.getCmp("mfv1").bounds;
        if (bnds) {
          Ext.getCmp("map").map.zoomToExtent(bnds, true);
        }
      },
      menu: {
        items: [{
          id: 'fm1',
          text: 'Favorite 1',
          handler: function(item) {
            const bnds = Ext.getCmp("mfv1").bounds;
            if (bnds) Ext.getCmp("map").map.zoomToExtent(bnds, true);
          }
        }, {
          id: 'fm2',
          text: 'Favorite 2',
          handler: function(item) {
            const bnds = Ext.getCmp("mfv2").bounds;
            if (bnds) Ext.getCmp("map").map.zoomToExtent(bnds, true);
          }
        }, {
          id: 'fm3',
          text: 'Favorite 3',
          handler: function(item) {
            const bnds = Ext.getCmp("mfv3").bounds;
            if (bnds) Ext.getCmp("map").map.zoomToExtent(bnds, true);
          }
        }, {
          id: 'fm4',
          text: 'Favorite 4',
          handler: function(item) {
            const bnds = Ext.getCmp("mfv4").bounds;
            if (bnds) Ext.getCmp("map").map.zoomToExtent(bnds, true);
          }
        }, {
          id: 'fm5',
          text: 'Favorite 5',
          handler: function(item) {
            const bnds = Ext.getCmp("mfv5").bounds;
            if (bnds) Ext.getCmp("map").map.zoomToExtent(bnds, true);
          }
        }, {
          text: 'Edit Favorites',
          handler: function(item) {
            Application.boundsFavorites.show();
          }
        }]
      }
    }, {
      xtype: 'tbtext',
      text: 'Map Valid: 12:00 AM',
      id: 'appTime'
    }, '-', {
      text: "Tools",
      menu: {
        items: [{
          text: 'LSR Grid',
          icon: 'icons/prop.gif',
          handler: function() {
            if (!Ext.getCmp("lsrgrid")) {
              new Application.LSRGrid({ id: 'lsrgrid' });
            }
            Ext.getCmp("lsrgrid").show();
          }
        }, {
          text: 'SBW Grid',
          icon: 'icons/prop.gif',
          handler: function() {
            if (!Ext.getCmp("sbwgrid")) {
              new Application.SBWGrid({ id: 'sbwgrid' });
            }
            Ext.getCmp("sbwgrid").show();
          }
        }, {
          text: 'Show Legend',
          handler: function() {
            if (!Ext.getCmp("maplegend")) {
              (new Application.MapLegend({ id: 'maplegend', contentEl: 'legends' }));
            }
            Ext.getCmp("maplegend").show();
          }
        }]
      }
    }, '-', 'Opacity', Application.LayerSlider]
  };
}

export { setAppTime };
export default Application.MapPanel;
