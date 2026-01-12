// Import Strophe.js from npm package and set up plugins
import './lib/strophe-setup.js';
import './lib/strophe-disco-plugin.js';

// Import ExtJS utilities and extensions
import './lib/extjs-utilities.js';

// Import login components
import './auth/LoginPanel.js';

/*
 * https://groups.google.com/forum/#!topic/strophe/glSI-BCNzls
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */

// --- MapPanel.js content (concatenated for migration) ---
Ext.ns("Application");

  var spcConvStyles = {
    "General Thunder" : {
        fillColor : '#c0e8c0',
        strokeColor : '#3c783c',
        graphicZIndex : 2
    },
    "Marginal Risk" : {
        fillColor : '#7fc57f',
        strokeColor : '#3c783c',
        graphicZIndex : 3
    },
    "Slight Risk" : {
        fillColor : '#f6f67f',
        strokeColor : '#ff9600',
        graphicZIndex : 4
    },
    "Enhanced Risk" : {
        fillColor : '#e6c27f',
        strokeColor : '#ff7f00',
        graphicZIndex : 5
    },
    "Moderate Risk" : {
        fillColor : '#e67f7f',
        strokeColor : '#cd0000',
        graphicZIndex : 6
    },
    "High Risk" : {
        fillColor : '#ff00ff',
        strokeColor : '#000000',
        graphicZIndex : 7
    }
};
var spcConvStyleMap = new OpenLayers.StyleMap({
            'default' : {
                fillColor : '#000000',
                strokeWidth : 3,
                strokeOpacity : 1,
                fillOpacity : 0.8
            }
        });
spcConvStyleMap.addUniqueValueRules('default', 'name', spcConvStyles);

var sigcStyleMap = new OpenLayers.StyleMap({
            'default' : {
                strokeColor : '#ff0000',
                graphicZIndex : 4,
                strokeWidth : 3,
                strokeOpacity : 1,
                fillOpacity : 0.8
            }
        });

var sbwStyleMap = new OpenLayers.StyleMap({
            'default' : {
                graphicZIndex : 1,
                strokeWidth : 3,
                fillOpacity : 0.4,
                strokeOpacity : 1
            },
            'select' : {
                fillOpacity : 1
            }
        });

var sbwStyles = {
    "TO" : {
        strokeColor : 'red',
        graphicZIndex : 9
    },
    "MA" : {
        strokeColor : 'purple',
        graphicZIndex : 7
    },
    "FF" : {
        strokeColor : 'green',
        graphicZIndex : 7
    },
    "EW" : {
        strokeColor : 'green',
        graphicZIndex : 6
    },
    "FA" : {
        strokeColor : 'green',
        graphicZIndex : 6
    },
    "FL" : {
        strokeColor : 'green',
        graphicZIndex : 6
    },
    "SQ" : {
        strokeColor : 'yellow',
        graphicZIndex : 8
    },
    "SV" : {
        strokeColor : 'yellow',
        graphicZIndex : 8
    }
};
var lsrStyleMap = new OpenLayers.StyleMap({
            'default' : {
                pointRadius : 10,
                fillOpacity : 1,
                graphicZIndex : 6
            },
            'select' : {
                fillOpacity : 1
            }
        });
var lsrStyles = {
    "UA" : {
        externalGraphic : "../lsr/icons/airplaneUA.png"
    },
    "UUA" : {
        externalGraphic : "../lsr/icons/airplaneUUA.png"
    },
    "0" : {
        externalGraphic : "../lsr/icons/tropicalstorm.gif"
    },
    "1" : {
        externalGraphic : "../lsr/icons/flood.png"
    },
    "2" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "3" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "4" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "5" : {
        externalGraphic : "../lsr/icons/ice.png"
    },
    "6" : {
        externalGraphic : "../lsr/icons/cold.png"
    },
    "7" : {
        externalGraphic : "../lsr/icons/cold.png"
    },
    "8" : {
        externalGraphic : "../lsr/icons/fire.png"
    },
    "9" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "a" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "A" : {
        externalGraphic : "../lsr/icons/wind.png"
    },
    "B" : {
        externalGraphic : "../lsr/icons/downburst.png"
    },
    "C" : {
        externalGraphic : "../lsr/icons/funnelcloud.png"
    },
    "D" : {
        externalGraphic : "../lsr/icons/winddamage.png"
    },
    "E" : {
        externalGraphic : "../lsr/icons/flood.png"
    },
    "F" : {
        externalGraphic : "../lsr/icons/flood.png"
    },
    "G" : {
        externalGraphic : "../lsr/icons/wind.png"
    },
    "H" : {
        externalGraphic : "../lsr/icons/hail.png"
    },
    "I" : {
        externalGraphic : "../lsr/icons/hot.png"
    },
    "J" : {
        externalGraphic : "../lsr/icons/fog.png"
    },
    "K" : {
        externalGraphic : "../lsr/icons/lightning.gif"
    },
    "L" : {
        externalGraphic : "../lsr/icons/lightning.gif"
    },
    "M" : {
        externalGraphic : "../lsr/icons/wind.png"
    },
    "N" : {
        externalGraphic : "../lsr/icons/wind.png"
    },
    "O" : {
        externalGraphic : "../lsr/icons/wind.png"
    },
    "P" : {
        externalGraphic : "../lsr/icons/other.png"
    },
    "Q" : {
        externalGraphic : "../lsr/icons/tropicalstorm.gif"
    },
    "R" : {
        externalGraphic : "../lsr/icons/heavyrain.png"
    },
    "s" : {
        externalGraphic : "../lsr/icons/sleet.png"
    },
    "S" : {
        externalGraphic : "../lsr/icons/snow.png"
    },
    "T" : {
        externalGraphic : "../lsr/icons/tornado.png"
    },
    "U" : {
        externalGraphic : "../lsr/icons/fire.png"
    },
    "V" : {
        externalGraphic : "../lsr/icons/avalanche.gif"
    },
    "W" : {
        externalGraphic : "../lsr/icons/waterspout.png"
    },
    "X" : {
        externalGraphic : "../lsr/icons/funnelcloud.png"
    },
    "Z" : {
        externalGraphic : "../lsr/icons/blizzard.png"
    }
};
lsrStyleMap.addUniqueValueRules('default', 'ptype', lsrStyles);
sbwStyleMap.addUniqueValueRules('default', 'ptype', sbwStyles);

var sigc = new OpenLayers.Layer.Vector("Convective Sigmets", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'Aviation Weather Center Products',
    sphericalMercator : true,
    styleMap : sigcStyleMap,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=7",
        format: new OpenLayers.Format.GeoJSON({
            projection: new OpenLayers.Projection("EPSG:4326"),
            internalProjection: new OpenLayers.Projection("EPSG:900913"),
            extractAttributes: true
        })
    })
});

var qpf1 = new OpenLayers.Layer.Vector("Day 1 QPF", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'HPC Precipitation Forecasts',
    sphericalMercator : true,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=0",
        format: new OpenLayers.Format.KML({
            extractStyles: true, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var qpf2 = new OpenLayers.Layer.Vector("Day 2 QPF", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'HPC Precipitation Forecasts',
    sphericalMercator : true,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=1",
        format: new OpenLayers.Format.KML({
            extractStyles: true, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var spc1 = new OpenLayers.Layer.Vector("Day 1 Convective Outlook", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'Storm Prediction Center Products',
    sphericalMercator : true,
    styleMap : spcConvStyleMap,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=3",
        format: new OpenLayers.Format.KML({
            extractStyles: false, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var spc2 = new OpenLayers.Layer.Vector("Day 2 Convective Outlook", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'Storm Prediction Center Products',
    sphericalMercator : true,
    styleMap : spcConvStyleMap,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=4",
        format: new OpenLayers.Format.KML({
            extractStyles: false, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var spc3 = new OpenLayers.Layer.Vector("Day 3 Convective Outlook", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'Storm Prediction Center Products',
    sphericalMercator : true,
    styleMap : spcConvStyleMap,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=5",
        format: new OpenLayers.Format.KML({
            extractStyles: false, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var qpf15 = new OpenLayers.Layer.Vector("Day 1-5 QPF", {
    strategies: [new OpenLayers.Strategy.Fixed()],
    checkedGroup : 'HPC Precipitation Forecasts',
    sphericalMercator : true,
    rendererOptions : {zIndexing : true},
    projection : new OpenLayers.Projection("EPSG:4326"),
    visibility : false,
    protocol: new OpenLayers.Protocol.HTTP({
        url: "data-proxy.php?id=2",
        format: new OpenLayers.Format.KML({
            extractStyles: true, 
            extractAttributes: true,
            maxDepth: 2
        })
    })
});
var lsrs = new OpenLayers.Layer.Vector("Local Storm Reports", {
            styleMap : lsrStyleMap,
            checkedGroup : 'Chatroom Products',
            sphericalMercator : true,
            rendererOptions : {zIndexing : true},
            projection : new OpenLayers.Projection("EPSG:4326")
        });
var sbws = new OpenLayers.Layer.Vector("Storm Based Warnings", {
            styleMap : sbwStyleMap,
            checkedGroup : 'Chatroom Products',
            sphericalMercator : true,
            rendererOptions : {zIndexing : true},
            projection : new OpenLayers.Projection("EPSG:4326")
        });
Application.lsrStore = new GeoExt.data.FeatureStore({
            layer : lsrs,
            sortInfo : {
                field : 'valid',
                direction : 'DESC'
            },
            fields : [{
                name : 'message'
            }, {
                name : 'valid',
                type : 'date'
            }]
        });
Application.sbwStore = new GeoExt.data.FeatureStore({
            layer : sbws,
            id : 'vtec',
            sortInfo : {
                field : 'expire',
                direction : 'ASC'
            },
            fields : [{
                        name : 'message'
                    },{
                        name : 'expire',
                        type : 'date'
                    },{
                        name : 'vtec'
                    }]
        });
var LinkInterceptor = {
    render : function(p) {
        p.body.on({
                    'mousedown' : function(e, t) { // try to
                        // intercept the
                        // easy way
                        t.target = '_blank';
                    },
                    'click' : function(e, t) { // if they tab +
                        // enter a link,
                        // need to do it old
                        // fashioned way
                        if (String(t.target).toLowerCase() != '_blank') {
                            e.stopEvent();
                            window.open(t.href);
                        }
                    },
                    delegate : 'a'
                });
    }
};

Application.LSRGrid = Ext.extend(Ext.Window, {
            title : 'Local Storm Reports',
            closeAction : 'hide',
            width : 500,
            height : 300,
            layout : 'fit',
            constrain : true,
            hidden : true,
            initComponent : function(){
                this.items = [{
                        xtype : 'grid',
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect:true,
                            listeners : {
                                rowselect : function(sm, rowIdx, record){
                                    var lonlat = new OpenLayers.LonLat(record.data.feature.geometry.x, 
                                    record.data.feature.geometry.y);
                                    Ext.getCmp("map").map.panTo(lonlat, 5);
                                    
                                }
                            }
                        }),
                        store : Application.lsrStore,
                        stripeRows : true,
                        listeners : LinkInterceptor,
                        autoExpandColumn : 'message',
                        autoScroll : true,
                        columns : [{
                                    dataIndex : 'valid',
                                    header : 'Valid',
                                    width : 100,
                                    sortable : true,
                                    renderer : function(value) {
                                        return value.fromUTC().format('j M g:i A');
                                    }
                                }, {
                                    id : 'message',
                                    dataIndex : 'message',
                                    header : 'Message'
                                }]
                    }];
                Application.LSRGrid.superclass.initComponent.apply(this, arguments);
            }
});
Application.SBWGrid = Ext.extend(Ext.Window, {
            title : 'Storm Based Warnings',
            closeAction : 'hide',
            width : 500,
            height : 300,
            layout : 'fit',
            constrain : true,
            hidden : true,
            initComponent : function(){
                this.items = [{
                        xtype : 'grid',
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect:true,
                            listeners : {
                                rowselect : function(sm, rowIdx, record){
                                    Ext.getCmp("map").map.zoomToExtent(
                                    record.data.feature.geometry.getBounds());
                                }
                            }
                        }),
                        store : Application.sbwStore,
                        stripeRows : true,
                        listeners : LinkInterceptor,
                        autoExpandColumn : 'message',
                        autoScroll : true,
                        columns : [{
                                    dataIndex : 'expire',
                                    header : 'Expires',
                                    width : 100,
                                    sortable : true,
                                    renderer : function(value) {
                                        return value.fromUTC().format('j M g:i A');
                                    }
                                }, {
                                    id : 'message',
                                    dataIndex : 'message',
                                    header : 'Message'
                                }]
                    }];
                Application.SBWGrid.superclass.initComponent.apply(this, arguments);
            }
});
        
sbws.events.on({
            featureselected : function(e) {
                // Can't get valid as an object :(
                var html = e.feature.attributes.message;
                var popup = new GeoExt.Popup({
                            map : this.map,
                            location : e.feature,
                            feature : e.feature,
                            title : "Event",
                            width : 200,
                            html : html,
                            listeners : LinkInterceptor,
                            collapsible : true
                        });
                popup.on({
                            close : function() {
                                if (OpenLayers.Util.indexOf(
                                        sbws.selectedFeatures, this.feature) > -1) {
                                    Ext.getCmp('map').map.controls[3]
                                            .unselect(this.feature);
                                }
                            }
                        });
                popup.show();
            }
        });
lsrs.events.on({
            featureselected : function(e) {
                // Can't get valid as an object :(
                var html = e.feature.attributes.message;
                var popup = new GeoExt.Popup({
                            map : this.map,
                            location : e.feature,
                            feature : e.feature,
                            title : "Event",
                            width : 200,
                            html : html,
                            listeners : LinkInterceptor,
                            collapsible : true
                        });
                popup.on({
                            close : function() {
                                if (OpenLayers.Util.indexOf(
                                        lsrs.selectedFeatures, this.feature) > -1) {
                                    Ext.getCmp('map').map.controls[3]
                                            .unselect(this.feature);
                                }
                            }
                        });
                popup.show();
            }
        });

/*
 * RIDGE II layer
 */
function get_my_url(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left)
            / (res * this.tileSize.w));
    var y = Math.round((this.maxExtent.top - bounds.top)
            / (res * this.tileSize.h));
    var z = this.map.getZoom();

    var path = z + "/" + x + "/" + y + "." + this.type + "?"
            + parseInt(Math.random() * 9999);
    var url = this.url;
    if (url instanceof Array) {
        url = this.selectUrl(path, url);
    }
    return url + this.service + "/" + this.layername + "/" + path;

}
var ridgeII = new OpenLayers.Layer.TMS('NEXRAD Base Reflectivity',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'nexrad-n0q-900913',
            service : '1.0.0',
            type : 'png',
            checkedGroup : 'Precip',
            visibility : false,
            refreshable : true,
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });

var q2hsr = new OpenLayers.Layer.TMS('NMQ Hybrid Scan Reflectivity',
                'https://mesonet.agron.iastate.edu/cache/tile.py/', {
                        layername : 'q2-hsr-900913',
                        service : '1.0.0',
                        type : 'png',
                        checkedGroup : 'Precip',
                        opacity : 0.8,
                        visibility : false,
                        refreshable : true,
                        getURL : get_my_url,
                        isBaseLayer : false
                });


var q21h = new OpenLayers.Layer.TMS('NMQ Q2 1 Hour Precip',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'q2-n1p-900913',
            service : '1.0.0',
            type : 'png',
            checkedGroup : 'Precip',
            opacity : 0.8,
            visibility : false,
            refreshable : true,
            getURL : get_my_url,
            isBaseLayer : false
        });

var q21d = new OpenLayers.Layer.TMS('NMQ Q2 1 Day Precip',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'q2-p24h-900913',
            service : '1.0.0',
            type : 'png',
            checkedGroup : 'Precip',
            visibility : false,
            refreshable : true,
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });

var q22d = new OpenLayers.Layer.TMS('NMQ Q2 2 Day Precip',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'q2-p48h-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Precip',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });

var q23d = new OpenLayers.Layer.TMS('NMQ Q2 3 Day Precip',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'q2-p72h-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Precip',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });

var goesEastM1VIS = new OpenLayers.Layer.TMS('GOES East Mesoscale1 Visible',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_east_mesoscale-1_ch02',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var goesWestM1VIS = new OpenLayers.Layer.TMS('GOES West Mesoscale1 Visible',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_west_mesoscale-1_ch02',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var goesWestVIS = new OpenLayers.Layer.TMS('GOES West Visible',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_west_conus_ch02',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var goesEastVIS = new OpenLayers.Layer.TMS('GOES East Visible',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_west_conus_ch13',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var goesEastWV = new OpenLayers.Layer.TMS('GOES East Water Vapor',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_east_conus_ch09',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var goesWestWV = new OpenLayers.Layer.TMS('GOES West Water Vapor',
        'https://mesonet.agron.iastate.edu/cache/tile.py/', {
            layername : 'goes_west_conus_ch09',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            refreshable : true,
            checkedGroup : 'Satellite',
            opacity : 0.8,
            getURL : get_my_url,
            isBaseLayer : false
        });
var firezones = new OpenLayers.Layer.TMS('NWS Fire Zones',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'fz-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var counties = new OpenLayers.Layer.TMS('US Counties',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'uscounties',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var states = new OpenLayers.Layer.TMS('US States',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'usstates',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var wfo = new OpenLayers.Layer.TMS('NWS WFO CWA',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'wfo-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var cwsu = new OpenLayers.Layer.TMS('NWS CWSU',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'cwsu-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var tribal = new OpenLayers.Layer.TMS('Tribal Boundaries',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'tribal-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
var rfc = new OpenLayers.Layer.TMS('NWS RFC HSA',
        'https://mesonet.agron.iastate.edu/c/c.py/', {
            layername : 'rfc-900913',
            service : '1.0.0',
            type : 'png',
            visibility : false,
            checkedGroup : 'Political Boundaries',
            opacity : 1,
            getURL : get_my_url,
            isBaseLayer : false
        });
/*
 * Set the time display above the map
 */
function setAppTime() {
    var now = new Date();
    var now5 = now.add(Date.MINUTE, 0 - (parseInt(now.format('i')) % 5));
    if (Ext.getCmp('appTime')) {
        Ext.getCmp('appTime').setText('Map Valid: ' + now5.format('g:i A'));
    }
};

var baseESRILayer = new OpenLayers.Layer.ArcGISCache("ESRI Topo",
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", {
    layerInfo: {
         "currentVersion": 10.2,
         "serviceDescription": "This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone. The map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports overlaid on land cover and shaded relief imagery for added context. The map provides coverage for the world down to a scale of ~1:72k. Coverage is provided down to ~1:4k for the following areas: Australia and New Zealand; India; Europe; Canada; Mexico; the continental United States and Hawaii; South America and Central America; Africa; and most of the Middle East. Coverage down to ~1:1k and ~1:2k is available in select urban areas. This basemap was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey (USGS), U.S. Environmental Protection Agency (EPA), U.S. National Park Service (NPS), Food and Agriculture Organization of the United Nations (FAO), Department of Natural Resources Canada (NRCAN), GeoBase, Agriculture and Agri-Food Canada, DeLorme, HERE, Esri, OpenStreetMap contributors, and the GIS User Community. For more information on this map, including the terms of use, visit us <a href=\"http://goto.arcgisonline.com/maps/World_Topo_Map \" target=\"_new\" >online<\/a>.",
         "mapName": "Layers",
         "description": "This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone. The map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports overlaid on land cover and shaded relief imagery for added context. The map provides coverage for the world down to a scale of ~1:72k. Coverage is provided down to ~1:4k for the following areas: Australia and New Zealand; India; Europe; Canada; Mexico; the continental United States and Hawaii; South America and Central America; Africa; and most of the Middle East. Coverage down to ~1:1k and ~1:2k is available in select urban areas. This basemap was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey (USGS), U.S. Environmental Protection Agency (EPA), U.S. National Park Service (NPS), Food and Agriculture Organization of the United Nations (FAO), Department of Natural Resources Canada (NRCAN), GeoBase, Agriculture and Agri-Food Canada, DeLorme, HERE, Esri, OpenStreetMap contributors, and the GIS User Community. For more information on this map, including our terms of use, visit us online at http://goto.arcgisonline.com/maps/World_Topo_Map",
         "copyrightText": "Sources: Esri, HERE, DeLorme, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, and the GIS User Community",
         "supportsDynamicLayers": false,
         "layers": [
          {
           "id": 0,
           "name": "Citations",
           "parentLayerId": -1,
           "defaultVisibility": false,
           "subLayerIds": null,
           "minScale": 0,
           "maxScale": 0
          }
         ],
         "tables": [],
         "spatialReference": {
          "wkid": 102100,
          "latestWkid": 3857
         },
         "singleFusedMapCache": true,
         "tileInfo": {
          "rows": 256,
          "cols": 256,
          "dpi": 96,
          "format": "JPEG",
          "compressionQuality": 90,
          "origin": {
           "x": -2.0037508342787E7,
           "y": 2.0037508342787E7
          },
          "spatialReference": {
           "wkid": 102100,
           "latestWkid": 3857
          },
          "lods": [
           {
            "level": 0,
            "resolution": 156543.03392800014,
            "scale": 5.91657527591555E8
           },
           {
            "level": 1,
            "resolution": 78271.51696399994,
            "scale": 2.95828763795777E8
           },
           {
            "level": 2,
            "resolution": 39135.75848200009,
            "scale": 1.47914381897889E8
           },
           {
            "level": 3,
            "resolution": 19567.87924099992,
            "scale": 7.3957190948944E7
           },
           {
            "level": 4,
            "resolution": 9783.93962049996,
            "scale": 3.6978595474472E7
           },
           {
            "level": 5,
            "resolution": 4891.96981024998,
            "scale": 1.8489297737236E7
           },
           {
            "level": 6,
            "resolution": 2445.98490512499,
            "scale": 9244648.868618
           },
           {
            "level": 7,
            "resolution": 1222.992452562495,
            "scale": 4622324.434309
           },
           {
            "level": 8,
            "resolution": 611.4962262813797,
            "scale": 2311162.217155
           },
           {
            "level": 9,
            "resolution": 305.74811314055756,
            "scale": 1155581.108577
           },
           {
            "level": 10,
            "resolution": 152.87405657041106,
            "scale": 577790.554289
           },
           {
            "level": 11,
            "resolution": 76.43702828507324,
            "scale": 288895.277144
           },
           {
            "level": 12,
            "resolution": 38.21851414253662,
            "scale": 144447.638572
           },
           {
            "level": 13,
            "resolution": 19.10925707126831,
            "scale": 72223.819286
           },
           {
            "level": 14,
            "resolution": 9.554628535634155,
            "scale": 36111.909643
           },
           {
            "level": 15,
            "resolution": 4.77731426794937,
            "scale": 18055.954822
           },
           {
            "level": 16,
            "resolution": 2.388657133974685,
            "scale": 9027.977411
           },
           {
            "level": 17,
            "resolution": 1.1943285668550503,
            "scale": 4513.988705
           },
           {
            "level": 18,
            "resolution": 0.5971642835598172,
            "scale": 2256.994353
           },
           {
            "level": 19,
            "resolution": 0.29858214164761665,
            "scale": 1128.497176
           }
          ]
         },
         "initialExtent": {
          "xmin": -1.9003965069419548E7,
          "ymin": -236074.10024122056,
          "xmax": 1.9003965069419548E7,
          "ymax": 1.458937939490844E7,
          "spatialReference": {
           "cs": "pcs",
           "wkid": 102100
          }
         },
         "fullExtent": {
          "xmin": -2.0037507067161843E7,
          "ymin": -1.9971868880408604E7,
          "xmax": 2.0037507067161843E7,
          "ymax": 1.997186888040863E7,
          "spatialReference": {
           "cs": "pcs",
           "wkid": 102100
          }
         },
         "minScale": 5.91657527591555E8,
         "maxScale": 1128.497176,
         "units": "esriMeters",
         "supportedImageFormatTypes": "PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP",
         "documentInfo": {
          "Title": "World Topographic Map",
          "Author": "Esri",
          "Comments": "",
          "Subject": "topographic, topography, administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, airports, land cover, shaded relief imagery",
          "Category": "imageryBaseMapsEarthCover (Imagery, basemaps, and land cover)",
          "AntialiasingMode": "None",
          "TextAntialiasingMode": "Force",
          "Keywords": "World,Global,Europe,North America,South America,Southern Africa,Australia,New Zealand,India"
         },
         "capabilities": "Map,Query,Data",
         "supportedQueryFormats": "JSON, AMF",
         "exportTilesAllowed": false,
         "maxRecordCount": 1000,
         "maxImageHeight": 4096,
         "maxImageWidth": 4096,
         "supportedExtensions": "KmlServer"
        }
});

Application.layerstore = new GeoExt.data.LayerStore({
            layers : [baseESRILayer, new OpenLayers.Layer("No Overlay", {
                                checkedGroup : 'Precip',
                                isBaseLayer : false,
                                visibility : true
                            }), q2hsr, ridgeII, goesEastVIS, goesEastWV,
                            goesEastM1VIS,
                            goesWestVIS, goesWestWV, goesWestM1VIS,
                            q21h, q21d, q22d,
                    q23d, sbws, lsrs, qpf15, qpf2, qpf1, spc3, spc2, spc1,  new OpenLayers.Layer("Blank", {
                                isBaseLayer : true,
                                visibility : false
                            }), counties, states, tribal, cwsu, firezones, rfc, wfo]
        });

/*
 * Refresher
 */
Application.MapTask = {
    skipFirst : true,
    run : function() {
        if (this.skipFirst){
            this.skipFirst = false;
            return;
        }
        Application.layerstore.data.each(function(record) {
                    var layer = record.getLayer();
                    if (layer.refreshable && layer.getVisibility()) {
                        layer.redraw(true);
                    }
                    setAppTime();
                });
    },
    interval : 300000
};

var layerRoot = new Ext.tree.TreeNode({
            text : "All Layers",
            expanded : true
        });

layerRoot.appendChild(new GeoExt.tree.BaseLayerContainer({
            text : "Base Layer",
            layerstore : Application.layerstore,
            expanded : true
        }));

layerRoot.appendChild(new GeoExt.tree.LayerContainer({
            text : "Satellite",
            loader : {
                filter : function(record) {
                    var layer = record.getLayer();
                    return layer.checkedGroup === 'Satellite';
                },
                baseAttrs : {
                    iconCls : 'gx-tree-baselayer-icon',
                    checkedGroup : 'rasters'
                }
            },
            layerstore : Application.layerstore,
            expanded : true
        }));

layerRoot.appendChild(new GeoExt.tree.LayerContainer({
            text : "Precip/RADAR",
            loader : {
                filter : function(record) {
                    var layer = record.getLayer();
                    if (layer.isBaseLayer)
                        return false;
                    return layer.checkedGroup === 'Precip';
                },
                baseAttrs : {
                    iconCls : 'gx-tree-baselayer-icon',
                    checkedGroup : 'rasters'
                }
            },
            layerstore : Application.layerstore,
            expanded : true
        }));

layerRoot.appendChild(new GeoExt.tree.LayerContainer({
            text : "Chatroom Products",
            loader : {
                filter : function(record) {
                    var layer = record.getLayer();
                    if (layer.isBaseLayer)
                        return false;
                    return layer.checkedGroup === 'Chatroom Products';
                }
            },
            layerstore : Application.layerstore,
            expanded : true
        }));
layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text : "HPC Precipitation Forecasts",
    loader : {
        filter : function(record) {
            var layer = record.getLayer();
            if (layer.isBaseLayer)
                return false;
            return layer.checkedGroup === 'HPC Precipitation Forecasts';
        }
    },
    layerstore : Application.layerstore,
    expanded : true
}));
layerRoot.appendChild(new GeoExt.tree.LayerContainer({
    text : "Storm Prediction Center Products",
    loader : {
        filter : function(record) {
            var layer = record.getLayer();
            if (layer.isBaseLayer)
                return false;
            return layer.checkedGroup === 'Storm Prediction Center Products';
        }
    },
    layerstore : Application.layerstore,
    expanded : true
}));
layerRoot.appendChild(new GeoExt.tree.LayerContainer({
            text : "Political Boundaries",
            loader : {
                filter : function(record) {
                    var layer = record.getLayer();
                    if (layer.isBaseLayer)
                        return false;
                    return layer.checkedGroup === 'Political Boundaries';
                }
            },
            layerstore : Application.layerstore,
            expanded : true
        }));
/*
 * 
 */
Application.LayerSlider = {
    'xtype' : 'gx_opacityslider',
    id : 'layerslider',
    width : 200,
    value : 80,
    layer : ridgeII
};

Application.LayerTree = {
    region : 'east',
    xtype : 'treepanel',
    root : layerRoot,
    autoScroll : true,
    rootVisible : false,
    width : 150,
    collapsible : true,
    split : true,
    title : 'Layers Control',
    listeners : {
        click : function(n) {
            Ext.getCmp("layerslider").setLayer(n.attributes.layer);
        }
    }
};

Application.MapPanel = {
    region : 'center',
    height : 600,
    split : true,
    xtype : 'gx_mappanel',
    id : 'map',
    listeners : {
        afterrender : function(mp) {
            /* Bootstrap the timestamp on the bar */
            setAppTime();
        }
    },
    map : {
        projection : new OpenLayers.Projection("EPSG:900913"),
        units : "m",
        numZoomLevels : 18,
        maxResolution : 156543.0339,
        controls : [new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoom(),
                new OpenLayers.Control.ArgParser()],
        maxExtent : new OpenLayers.Bounds(-20037508, -20037508, 20037508,
                20037508.34)
    },
    layers : Application.layerstore,
    extent : new OpenLayers.Bounds(-14427682, 1423562, -7197350, 8673462),
    tbar : [{
                xtype : 'splitbutton',
                icon : 'icons/favorites.png',
                handler : function(){
                    var bnds = Ext.getCmp("mfv1").bounds;
                    if (bnds){
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                },
                menu : {
                    items : [{
                        id : 'fm1',
                        text : 'Favorite 1',
                        handler : function(item){
                            var bnds = Ext.getCmp("mfv1").bounds;
                            if (bnds){
                                Ext.getCmp("map").map.zoomToExtent(bnds, true);
                            }
                        }
                    },{
                        id : 'fm2',
                        text : 'Favorite 2',
                        handler : function(item){
                            var bnds = Ext.getCmp("mfv2").bounds;
                            if (bnds){
                                Ext.getCmp("map").map.zoomToExtent(bnds, true);
                            }
                        }
                    },{
                        id : 'fm3',
                        text : 'Favorite 3',
                        handler : function(item){
                            var bnds = Ext.getCmp("mfv3").bounds;
                            if (bnds){
                                Ext.getCmp("map").map.zoomToExtent(bnds, true);
                            }
                        }
                    },{
                        id : 'fm4',
                        text : 'Favorite 4',
                        handler : function(item){
                            var bnds = Ext.getCmp("mfv4").bounds;
                            if (bnds){
                                Ext.getCmp("map").map.zoomToExtent(bnds, true);
                            }
                        }
                    },{
                        id : 'fm5',
                        text : 'Favorite 5',
                        handler : function(item){
                            var bnds = Ext.getCmp("mfv5").bounds;
                            if (bnds){
                                Ext.getCmp("map").map.zoomToExtent(bnds, true);
                            }
                        }
                    }, {
                        text : 'Edit Favorites',
                        handler : function(item){
                            Application.boundsFavorites.show();
                        }
                    }]
                }
            },{
                xtype : 'tbtext',
                text : 'Map Valid: 12:00 AM',
                id : 'appTime'
            }, '-', {
                text : "Tools",
                menu : {
                    items : [{
                        text : 'LSR Grid',
                        icon : 'icons/prop.gif',
                        handler : function(){
                            if (!Ext.getCmp("lsrgrid")){
                                new Application.LSRGrid({id:'lsrgrid'});
                            }
                            Ext.getCmp("lsrgrid").show();
                        }
                    }, {
                        text : 'SBW Grid',
                        icon : 'icons/prop.gif',
                        handler : function(){
                            if (!Ext.getCmp("sbwgrid")){
                                new Application.SBWGrid({id:'sbwgrid'});
                            }
                            Ext.getCmp("sbwgrid").show();
                        }
                    }, {
                        text : 'Show Legend',
                        handler : function(){
                            if (!Ext.getCmp("maplegend")){
                                (new Application.MapLegend({id: 'maplegend', contentEl : 'legends'}));
                            }
                            Ext.getCmp("maplegend").show();
                        }
                    }]
                }
            }, '-', 'Opacity', Application.LayerSlider]
};

// --- End MapPanel.js content ---

if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
// --- Initialization code migrated from index.html ---
// Application config is now in config.js
window.Application = window.Application || {};

// SoundManager config
window.soundManager = window.soundManager || {};
soundManager.url = "swf/";
soundManager.consoleOnly = true;
soundManager.debugMode = false;
soundManager.preferFlash = false;
soundManager.onload = function() {
  if (Application.log) {
    Application.log("SoundManager2 Loaded...");
  }
};

// Strophe log override
if (window.Strophe) {
  Strophe.log = function(level, msg){
    if (Application.log) {
      Application.log(msg);
    }
  };
}

// ExtJS initialization
if (window.Ext) {
  Ext.BLANK_IMAGE_URL = '/vendor/ext/3.4.1/resources/images/default/s.gif';
  Application.DEBUGMODE = false;
  Ext.onReady(function(){
    Ext.EventManager.on(window, 'beforeunload', function() {
      if (typeof Application.XMPPConn != 'undefined'){
        Application.XMPPConn.flush();
        Application.XMPPConn.disconnect();
      }
    });
    Ext.QuickTips.init();
    (new Application.LiveViewport({
      renderTo : Ext.getBody(),
      enableMap : true
    })).show();
    Ext.TaskMgr.start(Application.ServiceGuard);
    if (window.OpenLayers && window.lsrs && window.sbws) {
      var ctrl = new OpenLayers.Control.SelectFeature([lsrs,sbws]);
      Ext.getCmp('map').map.addControl(ctrl);
      ctrl.activate();
    }
  });
}
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function')) {
        throw new TypeError('Object.keys called on non-object');
      }

      let result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/*
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
 */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}

/* 
 * Need to be able to have filters that can be reapplied
 * http://www.sencha.com/forum/showthread.php?76029-DISCUSS-Persistent-store-filter
 * REMOVED, could not get to work, add store event would cause race with panel, sigh
 */

/*
 * Helper functions to move dates between UTC and the browser local time
 */
Ext.override(Date, {
    toUTC : function() {
        // Convert the date to the UTC date
        return this.add(Date.MINUTE, this.getTimezoneOffset());
    },
    fromUTC : function() {
        // Convert the date from the UTC date
        return this.add(Date.MINUTE, -this.getTimezoneOffset());
    }
});

/*
 * Be able to change the tab panel's icon on the fly
 */
Ext.override(Ext.Panel, {
    setIconCls : function(i) {
        Ext.fly(this.ownerCt.getTabEl(this)).child('.x-tab-strip-text')
                        .replaceClass(this.iconCls, i);
        this.setIconClass(i);
    }
});

/**
 * @version 0.4
 * @author nerdydude81
 */
// TODO: Refactor usage to ES modules
// --- Application initialization (migrated from index.html) ---
// Application config is now in config.js - don't overwrite it

window.soundManager = window.soundManager || {};
soundManager.url = "swf/";
soundManager.consoleOnly = true;
soundManager.debugMode = false;
soundManager.preferFlash = false;
soundManager.onload = function() {
  if (Application.log) {
    Application.log("SoundManager2 Loaded...");
  }
};

// Wait for all global dependencies to be available before initializing
function initializeApp() {
  console.log('Weather.IM Live ES module loaded');
  
  if (!window.Ext) {
    console.warn('ExtJS not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  if (!window.OpenLayers) {
    console.warn('OpenLayers not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  if (!window.GeoExt) {
    console.warn('GeoExt not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  console.log('All dependencies loaded, initializing app...');
  
  if (window.Strophe) {
    Strophe.log = function(level, msg){
      if (Application.log) {
        Application.log(msg);
      }
    };
  }

  Ext.BLANK_IMAGE_URL = '/vendor/ext/3.4.1/resources/images/default/s.gif';
  Ext.onReady(function(){
    console.log('Ext.onReady fired');
    try {
      Ext.EventManager.on(window, 'beforeunload', function() {
        if (typeof Application.XMPPConn != 'undefined'){
          Application.XMPPConn.flush();
          Application.XMPPConn.disconnect();
        }
      });
      console.log('Event manager setup complete');
      
      Ext.QuickTips.init();
      console.log('QuickTips initialized');
      
      console.log('Creating LiveViewport...');
      (new Application.LiveViewport({
        renderTo : Ext.getBody(),
        enableMap : true
      })).show();
      console.log('LiveViewport created and shown');
      
      Ext.TaskMgr.start(Application.ServiceGuard);
      console.log('TaskMgr started');
      
      if (window.OpenLayers && window.lsrs && window.sbws) {
        var ctrl = new OpenLayers.Control.SelectFeature([lsrs,sbws]);
        Ext.getCmp('map').map.addControl(ctrl);
        ctrl.activate();
        console.log('Map controls activated');
      }
    } catch (e) {
      console.error('Error during initialization:', e);
    }
  });
}

// Start initialization when module loads
initializeApp();
// --- End application initialization ---
Ext.override(Ext.Element, {
    /**
     * @cfg {string} printCSS The file path of a CSS file for printout.
     */
    printCSS : null,
    /**
     * @cfg {Boolean} printStyle Copy the style attribute of this element to the
     *      print iframe.
     */
    printStyle : false,
    /**
     * @property {string} printTitle Page Title for printout.
     */
    printTitle : document.title,
    /**
     * Prints this element.
     * 
     * @param config
     *            {object} (optional)
     */
    print : function(config) {
        Ext.apply(this, config);

        var el = Ext.get(this.id).dom;
        if (this.isGrid)
            el = el.parentNode;

        var c = document.getElementById('printcontainer');
        var iFrame = document.getElementById('printframe');

        var strTemplate = '<HTML><HEAD>{0}<TITLE>{1}</TITLE></HEAD><BODY onload="{2}"><DIV {3}>{4}</DIV></BODY></HTML>';
        var strLinkTpl = '<link rel="stylesheet" type="text/css" href="{0}"/>';
        var strAttr = '';
        var strFormat;
        var strHTML;

        if (c) {
            if (iFrame)
                c.removeChild(iFrame);
            el.removeChild(c);
        }

        for (var i = 0; i < el.attributes.length; i++) {
            if (Ext.isEmpty(el.attributes[i].value)
                    || el.attributes[i].value.toLowerCase() != 'null') {
                strFormat = Ext.isEmpty(el.attributes[i].value)
                        ? '{0}="true" '
                        : '{0}="{1}" ';
                if (this.printStyle ? this.printStyle : el.attributes[i].name
                        .toLowerCase() != 'style')
                    strAttr += String.format(strFormat, el.attributes[i].name,
                            el.attributes[i].value);
            }
        }

        var strLink = '';
        if (this.printCSS) {
            if (!Ext.isArray(this.printCSS))
                this.printCSS = [this.printCSS];

            for (var i = 0; i < this.printCSS.length; i++) {
                strLink += String.format(strLinkTpl, this.printCSS[i]);
            }
        }

        strHTML = String.format(strTemplate, strLink, this.printTitle, '',
                strAttr, el.innerHTML);

        c = document.createElement('div');
        c.setAttribute('style', 'width:0px;height:0px;'
                        + (Ext.isSafari
                                ? 'display:none;'
                                : 'visibility:hidden;'));
        c.setAttribute('id', 'printcontainer');
        el.appendChild(c);
        if (Ext.isIE)
            c.style.display = 'none';

        iFrame = document.createElement('iframe');
        iFrame.setAttribute('id', 'printframe');
        iFrame.setAttribute('name', 'printframe');
        c.appendChild(iFrame);

        iFrame.contentWindow.document.open();
        iFrame.contentWindow.document.write(strHTML);
        iFrame.contentWindow.document.close();

        if (this.isGrid) {
            var iframeBody = Ext.get(iFrame.contentWindow.document.body);
            var cc = Ext.get(iframeBody.first().dom.parentNode);
            cc.child('div.x-panel-body').setStyle('height', '');
            cc.child('div.x-grid3').setStyle('height', '');
            cc.child('div.x-grid3-scroller').setStyle('height', '');
        }
        if (Ext.isIE)
            iFrame.contentWindow.document.execCommand('print');
        else
            iFrame.contentWindow.print();
    }
});


Application.DebugWindow = Ext.extend(Ext.Window, {
    initComponent : function(){
        this.items = [{
            xtype: 'panel',
            title : 'Debug Log',

            html : "<p>Browser CodeName: " + navigator.appCodeName + "</p>"
            + "<p>Browser Name: " + navigator.appName + "</p>"
            + "<p>Browser Version: " + navigator.appVersion + "</p>"
            + "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>"
            + "<p>Platform: " + navigator.platform + "</p>"
            + "<p>User-agent header: " + navigator.userAgent + "</p>",
            autoScroll : true
        }];
    
        this.tbar = [{
            text : 'Click to send this log to developer!',
            icon : 'icons/print.png',
            scope : this,
            handler : function(){
                Ext.Ajax.request({
                    url: 'bug.php',
                    method : 'POST',
                    success: function(response){
                        alert(response.responseText);
                    },
                    failure: function () {
                    },
                    headers: {
                        'my-header': 'foo'
                    },
                    params: { data: this.items.items[0].body.dom.innerHTML,
                        user: Application.USERNAME }
                });
            }
        },{
            text : 'Clear Log',
            icon : 'icons/close.png',
            handler : function(){
                this.items.items[0].update("");
            },
            scope: this
        }];    
        
        var config = {
                width : 600,
                height : 300,
                title : 'Debug Window',
                closeAction : 'hide',
                hidden : true,
                autoScroll : true,
                layout : 'fit'
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.DebugWindow.superclass.initComponent.apply(this,
                                        arguments);
    }, // End of initComponent
    addMessage : function(msg){
        Application.msgtpl.append(
                this.items.items[0].body, {
                        msg : msg,
                        date : new Date()
                });
    } // End of addMessage
});


Application.LiveViewport = Ext.extend(Ext.Viewport, {
    initComponent : function() {
        var mp = {
                xtype : 'panel',
                region : 'north',
                height : 10,
                hidden : true,
                title : 'Map Disabled by URL'
        };
        if (this.initialConfig.enableMap){
            mp = {
                    xtype : 'panel',
                    layout : 'border',
                    region : 'north',
                    collapsible : true,
                    title : 'Map Panel',
                    height : 300,
                    split : true,
                    items : [Application.MapPanel,
                             Application.LayerTree]
            };
        }
        this.items = [Application.Control, {
            xtype : 'panel',
            region : 'center',
            layout : 'border',
            items : [mp, new Application.ChatTabPanel({
                id : 'chatpanel',
                region : 'center',
                split : true
            })]
        }];
        var config = {
                layout: 'border'
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Application.LiveViewport.superclass.initComponent.call(this);
        this.doStuff();
    }, doStuff: function(){
        var mp = Ext.getCmp("map");
        if (mp && mp.map && mp.map.events) {
          mp.map.events.register("changelayer", null, function(evt){
            var myobj = {lstring: ''};
            Application.layerstore.data.each(function(record) {
              var layer = record.getLayer();
              if (layer.getVisibility()) {
                this.lstring += "||"+ layer.name;
              }
            }, myobj);
            Application.setPreference("layers", myobj.lstring);
          });
          Ext.TaskMgr.start(Application.MapTask);
        } else {
          console.warn("Map component or map.events is not ready in doStuff");
        }

        (new Application.DebugWindow({
            id: 'debug',
            renderTo: Ext.getBody()
        }));

        (new Ext.Window({
            id: 'loginwindow',
            modal : true,
            closable : false,
            title : 'Weather.IM Live Login Options',
            items : [new Application.TabLoginPanel()]
        })).show();
    }
});


Application.MapLegend = Ext.extend(Ext.Window, {
    width : 300,
    height : 200,
    autoScroll : true,
    title : 'Map Legends',
    hidden : true,
    closeAction : 'hide',

    initComponent : function() {
        var config = {
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MapLegend.superclass.initComponent.apply(this,
                        arguments);
        this.buildItems();
    },
    buildItems : function() {}
});

Application.MUCChatPanel = Ext.extend(Ext.Panel, {
    hideMode : 'offsets',
    closable : true,
    layout : 'border',
    chatType : 'groupchat',
    barejid : null,
    handle : null,
    anonymous : null,
    joinedChat : false, /* Was I successful at getting logged into room */

    initComponent : function() {
        this.items = [{
                        xtype : 'chatgridpanel',
                            region : 'center'
                        }, {
                            xtype : 'chattextentry',
                            region : 'south',
                            height : 50,
                            split : true
                        }

        ];
        if (this.initialConfig.chatType != 'allchats') {
            this.items.push({
                xtype : 'mucroomusers',
                        region : 'east',
                        width : 175,
                        collapsible : true,
                        split : true
                    });
            this.iconCls = 'tabno';
        } else {
            this.items[1].emptyText = "Type message here";
        }
        var config = {
            listeners : {
                activate : function(self) {
                    if (self.iconCls) {
                        self.setIconCls('tabno');
                    }
                },
                deactivate : function(self) {
                    if (self.iconCls) {
                        self.setIconCls('tabno');
                    }
                }

            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MUCChatPanel.superclass.initComponent
                .apply(this, arguments);
        this.buildItems();
    },
    clearRoom : function() {
        this.gp.getStore().removeAll();
        this.roomusers.root.removeAll();
    },
    getJidByHandle : function(handle) {
        var node = this.roomusers.root.findChild('text', handle);
        if (node == null)
            return null;
        if (Strophe.getDomainFromJid(node.attributes.jid) == Application.XMPPMUCHOST)
            return null;
        return node.attributes.jid;
    },
    buildItems : function() {
        this.gp = this.items.items[0];
        this.te = this.items.items[1];
        if (this.chatType == "allchats") {
            //this.gp.toolbars[0].items.items[4].setText("Sounds Off");
            this.gp.toolbars[0].items.items[4].disable();
            this.gp.soundOn = false;
            this.te.items.items[1].setText("To Room?");
            return;
        }
        this.roomusers = this.items.items[2];
        new Ext.tree.TreeSorter(this.roomusers, {
                    folderSort : true,
                    dir : "asc",
                    property : 'text'
                });

        /* Disable text box for anonymous rooms */
        if (this.anonymous) {
            this.te.disable();
        }

        var pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::mute";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            this.gp.toolbars[0].items.items[4].toggle(true, true);
            this.gp.toolbars[0].items.items[4].setText("Sounds Muted");
            this.gp.soundOn = false;
        }

        pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::iembothidden";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            this.gp.toolbars[0].items.items[3].toggle(true, true);
            this.gp.toolbars[0].items.items[3].setText("IEMBot Hidden");
            this.gp.store.filterBy(iembotFilter);
        }

        
    }
});

Ext.reg('mucchatpanel', Application.MUCChatPanel);

Application.ChatPanel = Ext.extend(Ext.Panel, {
    hideMode : 'offsets',
    closable : true,
    layout : 'border',
    iconCls : 'tabno',
    chatType : 'chat',
    barejid : null,
    handle : null,
    anonymous : null,
    
    initComponent : function() {
        this.items = [
                new Application.ChatGridPanel({
                    region : 'center'
                }),
                new Application.ChatTextEntry({
                    region : 'south',
                    height : 50,
                    split : true
                })
            ];
        var config = {
            listeners : {
                activate : function(self) {
                    self.setIconCls('tabno');
                },
                deactivate : function(self) {
                    self.setIconCls('tabno');
                },
                beforedestroy : function(self){
                    if (self.te.chatstate){
                        self.te.chatstate.cancel();
                    }
                    Application.XMPPConn.send($msg({
                        to : self.barejid,
                        type : self.chatType
                    }).c("gone", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                }
                
            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.ChatPanel.superclass.initComponent.apply(this,
                        arguments);
        this.buildItems();
    },
    getJidByHandle : function(handle){
        return this.barejid;
    },
    buildItems : function() {
        this.gp = this.items.items[0];
        this.te = this.items.items[1];
        /* Remove iembot muter */
        this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
        /* Remove sound muter */
        this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
    }
});

Ext.reg('chatpanel', Application.ChatPanel);

Application.MUCRoomUsers = Ext.extend(Ext.tree.TreePanel, {
    bodyStyle : {'margin-left': '-15px'},
    title : '0 people in room',
    rootVisible : false,
    lines : false,
    autoScroll : true, 
    initComponent : function() {
        this.root = {
            text : 'test',
            listeners : {
                append : function(tree, node) {
                    sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                },
                remove : function(tree, node) {
                    sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                }
            }
        };
        var config = {
            plugins: new Ext.ux.DataTip({
                tpl: '<div>JID: {jid}<br />Affiliation: {affiliation}<br />Role: {role}</div>',
                constrainPosition: true
            }),
            listeners : {
                click : function(n) {
                    if (!n.attributes.jid)
                        return;
                    username = Strophe.getNodeFromJid(n.attributes.jid);
                    /* Can't speak with ourself */
                    if (username == Application.USERNAME) {
                        return;
                    }
                    /* Now, we either talk with private or private via MUC */
                    var jid = n.attributes.jid;
                    if (Strophe.getDomainFromJid(n.attributes.jid) == Application.XMPPHOST) {
                        jid = Strophe.getBareJidFromJid(n.attributes.jid);
                    } 
                    Application.log("Wish to start chat with:"+ jid);
                    cp = Ext.getCmp("chatpanel").getChat( jid );
                    if (! cp){
                        cp = Ext.getCmp("chatpanel").addChat( jid );
                    }
                    Ext.getCmp("chatpanel").setActiveTab(cp);
                }
            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MUCRoomUsers.superclass.initComponent.apply(this,
                        arguments);
        this.buildItems();
    },
    buildItems : function() {}
});

Ext.reg('mucroomusers', Application.MUCRoomUsers);

Application.colors = ['000000', //black
'666666', // 
'D51460', // 
'FF0000', // 
'993333', //  
'FF9900', // 
'005500', //
'009900', // 
'00DD00', // 
'0066CC', //
'3399FF', // 
'0000FF', // 
'6666FF' // 
];
Application.colorpointer = 0;

Application.UserColorStore = new Ext.data.Store({
    fields : ['user', 'color']
});

Application.getUserColor = function(user) {
    idx = Application.UserColorStore.find('user', user);
    if (idx == -1){
        c = Application.colors[ Application.colorpointer ];
        Application.UserColorStore.add(new Ext.data.Record({user: user, color: c}));
        Application.colorpointer++;
        if (Application.colorpointer > 12){
            Application.colorpointer = 0;
        }
    } else {
        c = Application.UserColorStore.getAt(idx).get("color");
    }
    return c;
};

Application.ChatTextEntry = Ext.extend(Ext.Panel, {
            layout : 'hbox',
            layoutConfig : {
                align : "stretch"
            },
            border : false,
            chatstate : null,
            initComponent : function() {
                
                this.items = [{
                    xtype : 'textarea',
                    flex : 1,
                    cls : 'message-entry-box',                
                    autoCreate : {
                        tag : 'textarea',
                        style : 'rows:10;cols:72;wrap:"hard";',
                        autocomplete : 'off'
                    },
                    style : {
                        background : '#'
                                + Application.getPreference('bgcolor', 'FFFFFF'),
                        color : '#'
                                + Application.getPreference('fgcolor', '000000')
                    },
                    enableKeyEvents : true,
                    listeners : {
                        keyup : function(elTxt, e) {
                            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                            // e.TAB, e.ESC, arrow keys: e.LEFT,
                            // e.RIGHT, e.UP,
                            // e.DOWN
                            if (e.getKey() === e.ENTER && !e.shiftKey) {
                                if (this.chatstate){
                                    this.chatstate.cancel();
                                }
                                this.chatstate = null;
                                this.ownerCt.getComponent(1).handler();
                                return true;
                            }
                            /* Chat States! */
                            if (this.ownerCt.ownerCt.chatType == 'chat') {
                                if (!this.chatstate){
                                    this.chatstate = new Ext.util.DelayedTask(function(){
                                        if (!this.ownerCt || !this.ownerCt.ownerCt){
                                            return;
                                        }
                                        Application.XMPPConn.send($msg({
                                            to : this.ownerCt.ownerCt.barejid,
                                            type : this.ownerCt.ownerCt.chatType
                                        }).c("paused", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                                        this.chatstate = null;
                                    }, this);
                                    Application.XMPPConn.send($msg({
                                        to : this.ownerCt.ownerCt.barejid,
                                        type : this.ownerCt.ownerCt.chatType
                                    }).c("composing", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                                }
                                /* Wait 5 seconds before pausing */
                                this.chatstate.delay(5000);
                            }
                        },
                        render : {
                            delay : 500,
                            fn : function() {
                                this.focus();
                            }
                        }
                    }
                }, {
                    xtype : 'button',
                    text : 'Send',
                    width : 60,
                    popup : null,
                    handler : function() {
                        var txt = this.ownerCt.getComponent(0);
                        var text = txt.getValue().trim();
                        if (text.length === 0) {
                            txt.focus();
                            return false;
                        }
                        var bgcolor = Application.getPreference('bgcolor', 'FFFFFF');
                        var fgcolor = Application.getPreference('fgcolor', '000000');
                        
                        /* allchat */
                        if (this.ownerCt.ownerCt.chatType == "allchats"){
                            txt.emptyText = '';
                            txt.setValue('');
                            (new Application.AllChatMessageWindow({
                                message: Application.replaceURLWithHTMLLinks(text)
                            })).show();
                        } else {
                        var nodes = $.parseHTML(Application.replaceURLWithHTMLLinks(text));
                        var msg = $msg({
                            to : this.ownerCt.ownerCt.barejid,
                            type : this.ownerCt.ownerCt.chatType
                        }).c("active", {xmlns : 'http://jabber.org/protocol/chatstates'}).up()
                        .c("body").t(text).up().c("html", {
                            xmlns : 'http://jabber.org/protocol/xhtml-im'
                        }).c("body", {
                            xmlns : 'http://www.w3.org/1999/xhtml'
                        }).c("p").c("span", {
                    style : "color:#" + fgcolor + ";background:#"
                            + bgcolor + ";"
                        });
                        for (var i=0;i<nodes.length;i++){
                            msg = msg.cnode(nodes[i]);
                            if (i < nodes.length){
                              msg = msg.up();
                            }
                        }
                        Application.XMPPConn.send(msg);
                        txt.setValue("");
                        txt.focus();

                        // Since we don't get our messages back via XMPP
                        // we need to manually add to the store
                        if (this.ownerCt.ownerCt.chatType == 'chat') {
                            text = "<span "+ "style='color:#" + fgcolor + ";background:#" + bgcolor + ";'>"+ text +"</span>";
                            this.ownerCt.ownerCt.gp.getStore().addSorted(new Ext.data.Record({
                                                ts : (new Date()),
                                                author : Application.USERNAME,
                                                message :Application.replaceURLWithHTMLLinks(text)
                                            }));
                            //i = this.ownerCt.ownerCt.gp.getStore().getCount()
                            //        - 1;
                            //this.ownerCt.ownerCt.gp.getView().getRow(i).scrollIntoView();
                        }
                        }

                    }
                }];
                Application.ChatTextEntry.superclass.initComponent.apply(this,
                        arguments);

            }
        });

Ext.reg('chattextentry', Application.ChatTextEntry);


Application.msgFormatter = new Ext.XTemplate(
        '<p class="mymessage">',
        '<span ',
        '<tpl if="values.me == values.author">', 'class="author-me"', "</tpl>",
        '<tpl if="values.me != values.author">', 
          'class="{[this.getAuthorClass(values.jid)]}" style="color: #{[Application.getUserColor(values.author)]};"',
        '</tpl>',
          '>(', '<tpl if="this.isNotToday(ts)">', '{ts:date("d M")} ', '</tpl>',
        '{ts:date("g:i A")}) ', 
        '<tpl if="values.room != null">', 
          '[{room}] ',
        '</tpl>',
        '{author}:</span> ', '{message}</p>', {
            isNotToday : function(ts) {
                return (new Date()).format('md') != ts.format('md');
            },
            getAuthorClass : function(jid) {
                //console.log("node: "+Strophe.getNodeFromJid(jid) );
                if (jid == null) return "author-default";
                if (Strophe.getNodeFromJid(jid) == 'iembot'){
                    return "author-iembot";
                }
                if (Strophe.getNodeFromJid(jid).match(/^nws/)){
                    return "author-nws";
                }

                return "author-chatpartner";
            }
        });

Application.ChatGridPanel = Ext.extend(Ext.grid.GridPanel, {
    region : 'center',
    soundOn : true,
    iembotHide: false,
    stripeRows : true,
    autoExpandColumn : 'message',
    autoScroll : true,

    tbar : [{
                text : 'Clear Room Log',
                cls : 'x-btn-text-icon',
                icon : 'icons/close.png',
                handler : function(btn) {
                    btn.ownerCt.ownerCt.getStore().removeAll();
                }
            }, {
                text : 'Print Log',
                icon : 'icons/print.png',
                cls : 'x-btn-text-icon',
                handler : function(btn) {
                    btn.ownerCt.ownerCt.getGridEl().print({
                                isGrid : true
                            });
                }
            }, {
                text : 'View As HTML',
                handler : function(btn) {
                    showHtmlVersion(btn.ownerCt.ownerCt);
                },
                icon : 'icons/text.png',
                cls : 'x-btn-text-icon'
            }, {
                text : 'Hide IEMBot',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    const pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                    +"::iembothidden";
                    const store = btn.ownerCt.ownerCt.getStore();
                    btn.ownerCt.ownerCt.iembotHide = toggled;
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        store.filterBy(iembotFilter);
                        btn.setText("IEMBot Hidden");
                    } else {
                        Application.removePreference(pref);
                        store.clearFilter(false);
                        btn.setText("Hide IEMBot");
                    }
                }
            }, {
                text : 'Mute Sounds',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    //var store = btn.ownerCt.ownerCt.getStore();
                    const pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                                +"::mute";
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        btn.ownerCt.ownerCt.soundOn = false;
                        btn.setText("Sounds Muted");
                    } else {
                        Application.removePreference(pref);
                        btn.ownerCt.ownerCt.soundOn = true;
                        btn.setText("Mute Sounds");
                    }
                }
            },{
                icon : 'icons/font-less.png',
                handler : function(){
                    const size = parseInt(Application.getPreference('font-size', 14)) - 2;
                    Application.setPreference('font-size', size);
                    //cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
                    cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }, {
                icon : 'icons/font-more.png',
                handler : function(){
                    const size = parseInt(Application.getPreference('font-size', 14)) + 2;
                    Application.setPreference('font-size', size);
                    cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }],
    initComponent : function() {
        this.columns = [{
                    header : 'Author',
                    sortable : true,
                    dataIndex : 'author',
                    hidden : true
                }, {
                    id : 'message',
                    header : 'Message',
                    sortable : true,
                    dataIndex : 'ts',
                    scope : this,
                    renderer : function(_value, _p, record) {
                        return Application.msgFormatter.apply({
                            author: record.get('author'),
                            message: record.get('message'),
                            ts: record.get('ts'),
                            room: record.get('room'),
                            jid: record.get('jid'),
                            me: this.ownerCt.handle});
                    }
                }];
        this.store = new Ext.data.ArrayStore({
                    sortInfo : {
                        field : 'ts',
                        direction : 'ASC'
                    },
                    fields : [{
                                name : 'ts',
                                type : 'date'
                            }, 'author', 'message', 'product_id', 'jid', 'room',
                            {
                                name : 'xdelay',
                                type : 'boolean'
                            }]
                });
        this.store.on('add', function(_store, records, _index) {
            if (!this.soundOn){
                return true;
            }
            let nonIEMBot = false;
            let nothingNew = true;
            for (var i = 0; i < records.length; i++) {
                /* No events for delayed messages */
                if (records[i].get('xdelay')){
                    continue;
                }
                /* No events if I talked! */
                if (records[i].get('author') == this.ownerCt.handle){
                    continue;
                }
                if (records[i].get("author") != "iembot") {
                    nonIEMBot = true;
                }
                if (records[i].get("message").match(/tornado/i)){
                    Application.MsgBus.fireEvent("soundevent", "tornado");
                }
                // TODO: figure out how to make this case insensitive
                if (records[i].get("message").match(this.ownerCt.handle)){
                    Application.MsgBus.fireEvent("soundevent", "myhandle");
                }
                nothingNew = false;
            }//end of for()
            if (nothingNew){
                return true;
            }
            if (nonIEMBot) {
                // Make this tab show the new icon for the new message
                this.ownerCt.setIconCls('new-tab');
                Application.MsgBus.fireEvent("soundevent", "new_message");
            } else {
                // If iembot is muted, lets stop the events
                if (! this.iembotHide){
                    this.ownerCt.setIconCls('new-tab');
                    Application.MsgBus.fireEvent("soundevent", "iembot");
                }
            }
        }, this);
        var config = {
            viewConfig : {
                onAdd : function(_ds, _records, index) {
                    this.constructor.prototype.onAdd.apply(this, arguments);
                    //this.grid.getSelectionModel().selectRow(index);
                    //this.focusRow(index);
                    
                    row = this.grid.getView().getRow(index);
                    if (row) row.scrollIntoView();
                },
                templates : {
                    cell : new Ext.Template(
                            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}"  tabIndex="0" {cellAttr}>',
                            '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                            '</td>')
                }
            },

            sm : new Ext.grid.RowSelectionModel({
                        listeners : {
                            rowselect : function(sm, rowIdx, r) {
                                if (r.data.product_id) {
                                    Application.TextWindow.show();
                                    Application.TextWindow.load({
                                                params : {
                                                    pid : r.data.product_id,
                                                    bypass : 1
                                                },
                                                text : 'Loading...',
                                                method : 'GET',
                                                url : '../p.php'
                                            });
                                }
                            }
                        }
                    }),
            listeners : {
                render : function(p) {
                    p.getView().mainBody.on('mousedown', function(e, t) {
                                //console.log("Daryl1:"+ t.tagName);
                                if (t.tagName == 'A') {
                                    e.stopEvent();
                                    t.target = '_blank';
                                }
                            });
                    p.body.on({
                                'mousedown' : function(e, t) { // try to
                                    // intercept the
                                    // easy
                                    // way
                                    //console.log("Daryl2:"+ t.tagName);
                                    t.target = '_blank';
                                    Application.TextWindow.hide();
                                },
                                'click' : function(e, t) { // if they tab +
                                    // enter a link,
                                    // need to do it old fashioned
                                    // way
                                    //console.log("Daryl3:"+ t.tagName);
                                    if (String(t.target).toLowerCase() != '_blank') {
                                        e.stopEvent();
                                        window.open(t.href);
                                    }
                                    Application.TextWindow.hide();
                                },
                                delegate : 'a'
                            });

                }
            }
        };
        Ext.apply(this, config);

        Application.ChatGridPanel.superclass.initComponent.apply(this,
                arguments);

        /*
         * this.view = new Ext.grid.GridView({ cellTpl: new Ext.Template( '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div
         * class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"
         * {attr}>{value}</div>', '</td>' ) });
         */
    }
});

Ext.reg('chatgridpanel', Application.ChatGridPanel);/**
 * @class Ext.ux.DataTip
 * @extends Ext.ToolTip.
 * <p>This plugin implements automatic tooltip generation for an arbitrary number of child nodes <i>within</i> a Component.</p>
 * <p>This plugin is applied to a high level Component, which contains repeating elements, and depending on the host Component type,
 * it automatically selects a {@link Ext.ToolTip#delegate delegate} so that it appears when the mouse enters a sub-element.</p>
 * <p>When applied to a GridPanel, this ToolTip appears when over a row, and the Record's data is applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a DataView, this ToolTip appears when over a view node, and the Record's data is applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a TreePanel, this ToolTip appears when over a tree node, and the Node's {@link Ext.tree.TreeNode#attributes attributes} are applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a FormPanel, this ToolTip appears when over a Field, and the Field's <code>tooltip</code> property is used is applied
 * using this object's {@link Ext.Component#tpl tpl} template, or if it is a string, used as HTML content.</p>
 * <p>If more complex logic is needed to determine content, then the {@link Ext.Component#beforeshow beforeshow} event may be used.<p>
 * <p>This class also publishes a <b><code>beforeshowtip</code></b> event through its host Component. The <i>host Component</i> fires the
 * <b><code>beforeshowtip</code></b> event.
 */
Ext.ux.DataTip = Ext.extend(Ext.ToolTip, (function() {

//  Target the body (if the host is a Panel), or, if there is no body, the main Element.
    function onHostRender() {
        var e = this.body || this.el;
        if (this.dataTip.renderToTarget) {
            this.dataTip.render(e);
        }
        this.dataTip.initTarget(e);
    }

    function updateTip(tip, data) {
        if (tip.rendered) {
            tip.update(data);
        } else {
            if (Ext.isString(data)) {
                tip.html = data;
            } else {
                tip.data = data;
            }
        }
    }
    
    function beforeTreeTipShow(tip) {
        var e = Ext.fly(tip.triggerElement).findParent('div.x-tree-node-el', null, true),
            node = e ? tip.host.getNodeById(e.getAttribute('tree-node-id', 'ext')) : null;
        if(node){
            updateTip(tip, node.attributes);
        } else {
            return false;
        }
    }

    function beforeGridTipShow(tip) {
        var rec = this.host.getStore().getAt(this.host.getView().findRowIndex(tip.triggerElement));
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    function beforeViewTipShow(tip) {
        var rec = this.host.getRecord(tip.triggerElement);
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    function beforeFormTipShow(tip) {
        var el = Ext.fly(tip.triggerElement).child('input,textarea'),
            field = el ? this.host.getForm().findField(el.id) : null;
        if (field && (field.tooltip || tip.tpl)){
            updateTip(tip, field.tooltip || field);
        } else {
            return false;
        }
    }

    function beforeComboTipShow(tip) {
        var rec = this.host.store.getAt(this.host.selectedIndex);
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    return {
        init: function(host) {
            host.dataTip = this;
            this.host = host;
            if (host instanceof Ext.tree.TreePanel) {
                this.delegate = this.delegate || 'div.x-tree-node-el';
                this.on('beforeshow', beforeTreeTipShow);
            } else if (host instanceof Ext.grid.GridPanel) {
                this.delegate = this.delegate || host.getView().rowSelector;
                this.on('beforeshow', beforeGridTipShow);
            } else if (host instanceof Ext.DataView) {
                this.delegate = this.delegate || host.itemSelector;
                this.on('beforeshow', beforeViewTipShow);
            } else if (host instanceof Ext.FormPanel) {
                this.delegate = 'div.x-form-item';
                this.on('beforeshow', beforeFormTipShow);
            } else if (host instanceof Ext.form.ComboBox) {
                this.delegate = this.delegate || host.itemSelector;
                this.on('beforeshow', beforeComboTipShow);
            }
            if (host.rendered) {
                onHostRender.call(host);
            } else {
                host.onRender = host.onRender.createSequence(onHostRender);
            }
        }
    };
})());Ext.ns('Application');
/*
 * Handles all of the ROSTER related activities
 */

/*
 * Handle presence from a buddy. This gets into complicated UI land, but we'll
 * try to handle it all
 */
function onBuddyPresence(msg) {

    // Okay, we know who we got the presence from
    var jid = msg.getAttribute('from');
    var barejid = Strophe.getBareJidFromJid(jid);
    var resource = Strophe.getResourceFromJid(jid);
    var username = Strophe.getNodeFromJid(jid);
    var status = 'Available';
    /* IMPORTANT: If we find our own username, then we need to set a global 
     * flag to prevent auto-login from working
     */
    if (username == Application.USERNAME && 
        resource != Application.XMPPRESOURCE && 
        resource.match(/^WeatherIM/)){
        if (msg.getAttribute('type') == 'unavailable'){
            Application.log("Self presence: ["+ username +"] ["+ resource +"] unavailable");            
        } else {
            Application.log("Self presence: ["+ username +"] ["+ resource +"] available");
        }
    }
    /* Check for status */
    if ($(msg).find('status').length > 0) {
        status = $(msg).find('status').text();
    }
    /* Check for subscription request */
    if (msg.getAttribute('type') == 'subscribe'){
        Ext.Msg.show({
            
               title:'New Buddy Request',
               msg: 'User '+ username +' wishes to add you as a buddy. Is this okay?',
               buttons: Ext.Msg.YESNO,
               fn: function(btn){
                 if (btn == 'yes'){
                     /* <presence to='fire-daryl.e.herzmann@localhost' type='subscribed'/> */
                     var stanza = $pres({to: jid, type: 'subscribed'});
                     Application.XMPPConn.send(stanza.tree());
                     Application.buildAddBuddy(username, username ,'Buddies');
                 }  else {
                     var stanza = $pres({to: jid, type: 'unsubscribed'});
                     Application.XMPPConn.send(stanza.tree()); 
                 }
               },
               icon: Ext.MessageBox.QUESTION
            });
        
        return;
    }

    // Go look for our barejid
    Ext.getCmp("buddies").root.eachChild(function(node) {
        node.eachChild(function(leaf){
            //console.log("Looking for:"+ barejid +", this node:"+ 
            //    leaf.attributes.jid);
                if (leaf.attributes.barejid == barejid) {
                    res = leaf.attributes.resources.get(resource);
                    if (!res){
                        //console.log("Adding:"+ resource +" Status:"+ status);
                        leaf.attributes.resources.add(resource, {
                            status : status,
                            resource : resource
                        });
                    }
                    if (!msg.getAttribute('type')) {
                        if ($(msg).find('show').length > 0) {
                            leaf.setIconCls('buddy-away');
                        } else {
                            leaf.setIconCls('buddy-online');
                        }
                        leaf.attributes.presence = 'online';
                        leaf.ui.show();
                        //console.log("Replace"+ resource +" Status:"+ status);
                        leaf.attributes.resources.replace(resource, {
                            status : status,
                            resource : resource
                        });
                    } else if (msg.getAttribute('type') == 'unavailable'){
                        if (leaf.attributes.resources.length == 1){
                            leaf.attributes.presence = 'offline';
                            leaf.setIconCls('buddy-offline');
                            leaf.ui.hide();
                        }
                        leaf.attributes.resources.remove(resource);
                    }
                }
            });
    });

}
Ext.namespace('Ext.ux.panel');

/**
 * @class Ext.ux.panel.DDTabPanel
 * @extends Ext.TabPanel
 * @author
 *    Original by
 *        <a href="http://extjs.com/forum/member.php?u=22731">thommy</a> and
 *        <a href="http://extjs.com/forum/member.php?u=37284">rizjoj</a><br />
 *    Published and polished by: Mattias Buelens (<a href="http://extjs.com/forum/member.php?u=41421">Matti</a>)<br />
 *    With help from: <a href="http://extjs.com/forum/member.php?u=1459">mystix</a>
 *    Polished and debugged by: Tobias Uhlig (info@internetsachen.com) 04-25-2009
 *    Ported to Ext-3.1.1 by: Tobias Uhlig (info@internetsachen.com) 02-14-2010
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>. Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @version 2.0.0 (Feb 14, 2010)
 */
Ext.ux.panel.DDTabPanel = Ext.extend(Ext.TabPanel, {
    /**
    * @cfg {Number} arrowOffsetX The horizontal offset for the drop arrow indicator, in pixels (defaults to -9).
    */
    arrowOffsetX: -9,
    /**
    * @cfg {Number} arrowOffsetY The vertical offset for the drop arrow indicator, in pixels (defaults to -8).
    */
    arrowOffsetY: -8,

    // Assign the drag and drop group id
    /** @private */
    initComponent: function() {
        Ext.ux.panel.DDTabPanel.superclass.initComponent.call(this);
        this.addEvents('reorder');
        if (!this.ddGroupId) this.ddGroupId = 'dd-tabpanel-group-' + Ext.ux.panel.DDTabPanel.superclass.getId.call(this);
    },
    
    // New Event fired after drop tab
    reorder:function(tab){
        this.fireEvent('reorder', this, tab);
    },

    // Declare the tab panel as a drop target
    /** @private */
    afterRender: function() {
        Ext.ux.panel.DDTabPanel.superclass.afterRender.call(this);
        // Create a drop arrow indicator
        this.arrow = Ext.DomHelper.append(
            Ext.getBody(),
            '<div class="dd-arrow-down"></div>',
            true
        );
        this.arrow.hide();
        // Create a drop target for this tab panel
        var tabsDDGroup = this.ddGroupId;
        this.dd = new Ext.ux.panel.DDTabPanel.DropTarget(this, {
            ddGroup: tabsDDGroup
        });

        // needed for the onRemove-Listener
        this.move = false;
    },

    // Init the drag source after (!) rendering the tab
    /** @private */
    initTab: function(tab, index) {
        Ext.ux.panel.DDTabPanel.superclass.initTab.call(this, tab, index);

        var id = this.id + '__' + tab.id;
        // Hotfix 3.2.0
        Ext.fly(id).on('click', function() { tab.ownerCt.setActiveTab(tab.id); });
        // Enable dragging on all tabs by default
        Ext.applyIf(tab, { allowDrag: true });

        // Extend the tab
        Ext.apply(tab, {
            // Make this tab a drag source
            ds: new Ext.dd.DragSource(id, {
                ddGroup: this.ddGroupId
                , dropEl: tab
                , dropElHeader: Ext.get(id, true)
                , scroll: false

                // Update the drag proxy ghost element
                , onStartDrag: function() {
                    if (this.dropEl.iconCls) {

                        var el = this.getProxy().getGhost().select(".x-tab-strip-text");
                        el.addClass('x-panel-inline-icon');

                        var proxyText = el.elements[0].innerHTML;
                        proxyText = Ext.util.Format.stripTags(proxyText);
                        el.elements[0].innerHTML = proxyText;

                        el.applyStyles({
                            paddingLeft: "20px"
                        });
                    }
                }

                // Activate this tab on mouse up
                // (Fixes bug which prevents a tab from being activated by clicking it)
                , onMouseUp: function(event) {
                    if (this.dropEl.ownerCt.move) {
                        if (!this.dropEl.disabled && this.dropEl.ownerCt.activeTab == null) {
                            this.dropEl.ownerCt.setActiveTab(this.dropEl);
                        }
                        this.dropEl.ownerCt.move = false;
                        return;
                    }
                    if (!this.dropEl.isVisible() && !this.dropEl.disabled) {
                        this.dropEl.show();
                    }
                }
            })
            // Method to enable dragging
            , enableTabDrag: function() {
                this.allowDrag = true;
                return this.ds.unlock();
            }
            // Method to disable dragging
            , disableTabDrag: function() {
                this.allowDrag = false;
                return this.ds.lock();
            }
        });

        // Initial dragging state
        if (tab.allowDrag) {
            tab.enableTabDrag();
        } else {
            tab.disableTabDrag();
        }
    }

    /** @private */
    , onRemove: function(c) {
        var te = Ext.get(c.tabEl);
        // check if the tabEl exists, it won't if the tab isn't rendered
        if (te) {
            // DragSource cleanup on removed tabs
            //Ext.destroy(c.ds.proxy, c.ds);
            te.select('a').removeAllListeners();
            Ext.destroy(te);
        }

        // ignore the remove-function of the TabPanel
        Ext.TabPanel.superclass.onRemove.call(this, c);

        this.stack.remove(c);
        delete c.tabEl;
        c.un('disable', this.onItemDisabled, this);
        c.un('enable', this.onItemEnabled, this);
        c.un('titlechange', this.onItemTitleChanged, this);
        c.un('iconchange', this.onItemIconChanged, this);
        c.un('beforeshow', this.onBeforeShowItem, this);

        // if this.move, the active tab stays the active one
        if (c == this.activeTab) {
            if (!this.move) {
                var next = this.stack.next();
                if (next) {
                    this.setActiveTab(next);
                } else if (this.items.getCount() > 0) {
                    this.setActiveTab(0);
                } else {
                    this.activeTab = null;
                }
            }
            else {
                this.activeTab = null;
            }
        }
        if (!this.destroying) {
            this.delegateUpdates();
        }
    }


    // DropTarget and arrow cleanup
    /** @private */
    , onDestroy: function() {
        Ext.destroy(this.dd, this.arrow);
        Ext.ux.panel.DDTabPanel.superclass.onDestroy.call(this);
    }
});

// Ext.ux.panel.DDTabPanel.DropTarget
// Implements the drop behavior of the tab panel
/** @private */
Ext.ux.panel.DDTabPanel.DropTarget = Ext.extend(Ext.dd.DropTarget, {
    constructor: function(tabpanel, config){
        this.tabpanel = tabpanel;
        // The drop target is the tab strip wrap
        Ext.ux.panel.DDTabPanel.DropTarget.superclass.constructor.call(this, tabpanel.stripWrap, config);
    }

    ,notifyOver: function(dd, e, data){
        var tabs = this.tabpanel.items;
        var last = tabs.length;

        if(!e.within(this.getEl()) || dd.dropEl == this.tabpanel){
            return 'x-dd-drop-nodrop';
        }

        var larrow = this.tabpanel.arrow;

        // Getting the absolute Y coordinate of the tabpanel
        var tabPanelTop = this.el.getY();

        var left, prevTab, tab;
        var eventPosX = e.getPageX();

        for(var i = 0; i < last; i++){
            prevTab = tab;
            tab    = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            var tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            var tabLeft = tabEl.getX();
            // Get the middle of the tab
            var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;

            if(eventPosX <= tabMiddle){
                left = tabLeft;
                break;
            }
        }
        
        if(typeof left == 'undefined'){
            var lastTab = tabs.itemAt(last - 1);
            if(lastTab == dd.dropEl)return 'x-dd-drop-nodrop';
            var dom = lastTab.ds.dropElHeader.dom;
            left = (new Ext.Element(dom).getX() + dom.clientWidth) + 3;
        }
        
        else if(tab == dd.dropEl || prevTab == dd.dropEl){
            this.tabpanel.arrow.hide();
            return 'x-dd-drop-nodrop';
        }

        larrow.setTop(tabPanelTop + this.tabpanel.arrowOffsetY).setLeft(left + this.tabpanel.arrowOffsetX).show();

        return 'x-dd-drop-ok';
    }

    ,notifyDrop: function(dd, e, data){
        this.tabpanel.arrow.hide();
        
        // no parent into child
        if(dd.dropEl == this.tabpanel){
            return false;
        }
        var tabs      = this.tabpanel.items;
        var eventPosX = e.getPageX();

        for(var i = 0; i < tabs.length; i++){
            var tab = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            var tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            var tabLeft = tabEl.getX();
            // Get the middle of the tab
            var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;
            if(eventPosX <= tabMiddle) break;
        }

        // do not insert at the same location
        if(tab == dd.dropEl || tabs.itemAt(i-1) == dd.dropEl){
            return false;
        }
        
    dd.proxy.hide();

        // if tab stays in the same tabPanel
        if(dd.dropEl.ownerCt == this.tabpanel){
            if(i > tabs.indexOf(dd.dropEl))i--;
        }

        this.tabpanel.move = true;
        var dropEl = dd.dropEl.ownerCt.remove(dd.dropEl, false);
        
        this.tabpanel.insert(i, dropEl);
        // Event drop
        this.tabpanel.fireEvent('drop', this.tabpanel);
        // Fire event reorder
        this.tabpanel.reorder(tabs.itemAt(i));
        
        return true;
    }

    ,notifyOut: function(dd, e, data){
        this.tabpanel.arrow.hide();
    }
});

Ext.reg('ddtabpanel', Ext.ux.panel.DDTabPanel);


Application.ChatTabPanel = Ext.extend(Ext.ux.panel.DDTabPanel, {
    activeTab : 0,
    deferredRender : false,
    split : true,
        enableTabScroll: true,
    initComponent : function() {
        var config = {

        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.ChatTabPanel.superclass.initComponent.apply(this,
                arguments);
        this.buildItems();
    },
    buildItems : function() {
        this.add({
            contentEl : 'help',
            title : 'Help',
            preventBodyReset : true,
            style : {
                margin : '5px'
            },
            autoScroll : true
        });
        this.add(new Application.MUCChatPanel({
            title : 'All Chats',
            closable : false,
            chatType : 'allchats',
            barejid : '__allchats__@'+ Application.XMPPMUCHOST,
            id : '__allchats__'
        }));
    },
    addMUC : function(barejid, handle, anonymous){
        var mcp = new Application.MUCChatPanel({
            title : Strophe.getNodeFromJid(barejid),
            barejid : barejid,
            handle : handle,
            anonymous : anonymous
        });
        return this.add(mcp);
    },
    getMUC : function(barejid){
        return this.find('barejid', barejid)[0];
    },
    removeMUC : function(barejid){
        this.remove( this.getMUC(barejid) );
    },
    addChat : function(jid){
        var title = Strophe.getNodeFromJid(jid);
        if (Strophe.getDomainFromJid(jid) == Application.XMPPMUCHOST){
            title = Strophe.getResourceFromJid(jid);
        }
        var cp = new Application.ChatPanel({
            title : title,
            handle : Application.USERNAME,
            barejid : jid
        });
        return this.add(cp);
    },
    getChat : function(jid){
        return this.find('barejid', jid)[0];
    },
    removeChat : function(jid){
        this.remove( this.getChat(jid) );
    }
});

Ext.reg('chattabpanel', Application.ChatTabPanel);


/*
 * Need a simple filter for IEMBot messages
 */
function iembotFilter(record, _id){
    if (record.get("author") == "iembot"){ return false;}
      return true;
}

/*
 * Generate a html version of the active grid
 */
function grid2html(gridPanel) {
    var ds = gridPanel.getStore();
    var roomname = gridPanel.ownerCt.title;
    t = "<html><head></head><body>";
    t += "<table cellpadding='2' cellspacing='0' border='1'><tr><th>Roomname</th><th>Date</th><th>Author</th><th>Message</th></tr>";
    for (var i = 0; i < ds.getCount(); i++) {
        row = ds.getAt(i);
        t += String
                .format(
                        "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>\r\n",
                        row.get('roomname') || roomname, row.get("ts")
                                .format('Y/m/d g:i A'), row.get("author"), row
                                .get("message"));
    }
    t += "</table></body></html>";
    return t;
}
/*
 * Necessary to support changing the icon on the panel's tab
 */




function htmlExport(gridPanel) {
    if (Ext.isIE6 || Ext.isIE7 || Ext.isSafari || Ext.isSafari2
            || Ext.isSafari3) {
        Ext.Msg.alert('Status',
                'Sorry, this tool does not work with this browser.');
    } else {
        t = grid2html(gridPanel);
        document.location = 'data:plain/html;base64,' + encode64(t);
    }
};

function showHtmlVersion(gridPanel) {
    var win = new Ext.Window({
                title : 'Text Version',
                closable : true,
                width : 600,
                height : 350,
                plain : true,
                autoScroll : true,
                html : grid2html(gridPanel)
            });
    win.show();
};

var LinkInterceptor = {
    render : function(p) {
        p.body.on({
                    'mousedown' : function(e, t) { // try to intercept the easy
                        // way
                    
                        t.target = '_blank';
                        Application.TextWindow.hide();
                    },
                    'click' : function(e, t) { // if they tab + enter a link,
                        // need to do it old fashioned
                        // way
            
                        if (String(t.target).toLowerCase() != '_blank') {
                            e.stopEvent();
                            window.open(t.href);
                        }
                        Application.TextWindow.hide();
                    },
                    delegate : 'a'
                });
    }
};


/*
var msgFormatter = new Ext.XTemplate(
        '<p class="mymessage"><span class="myauthor">({ts:date("g:i A")}) ',
        '{author}: </span>', '{message}</p>');

function chatRenderer(value, p, record) {
    return msgFormatter.apply(record.data);
}
*/



Application.saveViews = function() {
    var stanza = $iq({
                type : 'set',
                id : '_set1'
            }).c('query', {
                xmlns : 'jabber:iq:private'
            }).c('storage', {
                xmlns : 'nwschatlive:views'
            });
    for (var i = 1; i < 6; i++) {
        bnds = Ext.getCmp('mfv' + i).bounds;
        if (bnds) {
            stanza.c('view', {
                label : Ext.getCmp('mfv' + i).getValue(),
                bounds : bnds.left + "," + bnds.bottom + "," + bnds.right + ","
                        + bnds.top
            }).up();
        }
    }
    Application.XMPPConn.sendIQ(stanza.tree());

};

Ext.util.Format.comboRenderer = function(combo) {
    return function(value) {
        var record = combo.findRecord(combo.valueField, value);
        return record
                ? record.get(combo.displayField)
                : combo.valueNotFoundText;
    };
};
  Application.SoundStore = new Ext.data.ArrayStore({
        fields : ['id', 'label', 'src'],
        data : [['default', 'Default', 'sounds/message_new.mp3'],
                ['bleep', 'Bleep', 'sounds/bleep.mp3'],
                ['cow', 'Cow (Mooo!)', 'sounds/cow.mp3'],
                ['doorbell', 'Door Bell', 'sounds/doorbell.mp3'],
                ['eas', 'EAS Beep', 'sounds/eas.mp3'],
                ['elevator', 'Elevator', 'sounds/elevator.mp3']]
        });

var combo = new Ext.form.ComboBox({
            typeAhead : false,
            triggerAction : 'all',
            lazyRender : true,
            mode : 'local',
            store : Application.SoundStore,
            listeners : {
                change : function(field, newVal, oldVal){
                    Application.playSound(newVal);
                }
            },
            valueField : 'id',
            displayField : 'label'
        });

Application.soundPrefs = new Ext.Window({
    title : 'Sound Preferences',
    width : 500,
    height : 300,
    closeAction : 'hide',
    layout : 'form',
    buttons : [{
                text : 'Save Sound Settings',
                handler : function() {
                    
                    Ext.getCmp("soundpanel").getStore().each(function(record){
                        eidx = record.get("id");
                        //console.log("Saving sound "+ eidx +"| Enabled "+ record.get("enabled") 
                        //    +"| Sound "+ record.get('sound'));
                        Application.setPreference('sound::'+eidx+'::enabled', 
                                                    record.get("enabled")?'true':'false');
                        Application.setPreference('sound::'+eidx+'::sound', record.get('sound'));
                    });
                    Application.soundPrefs.hide();
                    Application.syncPreferences();
                }
            }],
    items : [{
                xtype : 'slider',
                id : 'volume',
                minValue : 0,
                maxValue : 100,
                value : 50,
                width : 200,
                listeners : {
                    changecomplete : function(slider, newval, thumb) {
                        Application.setPreference('volume', newval);
                        Application.MsgBus.fireEvent("soundevent", "default");
                    }
                },
                fieldLabel : 'Volume'
            }, new Ext.grid.EditorGridPanel({
                store : new Ext.data.ArrayStore({
                            data : [['new_message', 'New Message (Non IEMBot)', true, 'default'],
                                    ['new_conversation', 'New Conversation', true, 'doorbell'],
                                    ['iembot', 'IEMBot Message', true, 'default'],
                                    ['myhandle', 'Message with your name in it', true, 'bleep'],
                                    ['tornado', 'Message with "Tornado" within text', true, 'eas']],
                            fields : [{
                                        name : 'id',
                                        type : 'string'
                                    },{
                                        name : 'label',
                                        type : 'string'
                                    }, {
                                        name : 'enabled',
                                        type : 'bool'
                                    }, {
                                        name : 'sound',
                                        type : 'string'
                                    }],
                            sortInfo : {
                                field : 'label',
                                direction : 'ASC'
                            }
                        }),
                cm : new Ext.grid.ColumnModel({
                    columns : [{
                                dataIndex : 'enabled',
                                id : 'enabled',
                                header : 'Enable',
                                xtype : 'checkcolumn'
                            }, {
                                dataIndex : 'label',
                                id : 'label',
                                sortable : true,
                                header : 'Event Type'
                            }, {
                                dataIndex : 'sound',
                                id : 'sound',
                                header : 'Sound',
                                renderer : Ext.util.Format.comboRenderer(combo),
                                editor : combo
                            }]
                }),
                id : 'soundpanel',
                title : 'Sound Events',
                frame : true,
                clicksToEdit : 1,
                stripeRows : true,
                autoExpandColumn : 'label',
                height : 200,
                autoScroll : true
            })]
});

Application.boundsFavorites = new Ext.Window({
            title : 'Map View Favorites',
            width : 500,
            height : 300,
            closeAction : 'hide',
            layout : 'table',
            layoutConfig : {
                columns : 4
            },
            autoScroll : true,
            buttons : [{
                        text : 'Save Settings',
                        handler : function() {
                            for (var i = 1; i < 6; i++) {
                                nval = Ext.getCmp("mfv" + i).getValue();
                                if (nval != '') {
                                    Ext.getCmp("fm" + i).setText(nval);
                                }
                            }
                            Application.boundsFavorites.hide();
                        }
                    }],
            items : [{
                html : 'This form allows you to modify the 5 allowed map extent'
                        + ' favorites. The first favorite will be your default view'
                        + ' when you log in and for the star icon above.',
                colspan : 4
            }, {
                html : '#1'
            }, {
                xtype : 'textfield',
                id : 'mfv1',
                bounds : null,
                width : 200
            }, {
                xtype : 'button',
                text : 'Set From Current View',
                handler : function(btn, e) {
                    Ext.getCmp("mfv1").bounds = Ext.getCmp("map").map
                            .getExtent();
                    Application.saveViews();
                }
            }, {
                xtype : 'button',
                text : 'View',
                handler : function(btn, e) {
                    bnds = Ext.getCmp("mfv1").bounds;
                    if (bnds) {
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                }
            }, {
                html : '#2'
            }, {
                xtype : 'textfield',
                id : 'mfv2',
                bounds : null,
                width : 200
            }, {
                xtype : 'button',
                text : 'Set From Current View',
                handler : function(btn, e) {
                    Ext.getCmp("mfv2").bounds = Ext.getCmp("map").map
                            .getExtent();
                    Application.saveViews();
                }
            }, {
                xtype : 'button',
                text : 'View',
                handler : function(btn, e) {
                    bnds = Ext.getCmp("mfv2").bounds;
                    if (bnds) {
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                }
            }, {
                html : '#3'
            }, {
                xtype : 'textfield',
                id : 'mfv3',
                bounds : null,
                width : 200
            }, {
                xtype : 'button',
                text : 'Set From Current View',
                handler : function(btn, e) {
                    Ext.getCmp("mfv3").bounds = Ext.getCmp("map").map
                            .getExtent();
                    Application.saveViews();
                }
            }, {
                xtype : 'button',
                text : 'View',
                handler : function(btn, e) {
                    bnds = Ext.getCmp("mfv3").bounds;
                    if (bnds) {
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                }
            }, {
                html : '#4'
            }, {
                xtype : 'textfield',
                id : 'mfv4',
                bounds : null,
                width : 200
            }, {
                xtype : 'button',
                text : 'Set From Current View',
                handler : function(btn, e) {
                    Ext.getCmp("mfv4").bounds = Ext.getCmp("map").map
                            .getExtent();
                    Application.saveViews();
                }
            }, {
                xtype : 'button',
                text : 'View',
                handler : function(btn, e) {
                    bnds = Ext.getCmp("mfv4").bounds;
                    if (bnds) {
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                }
            }, {
                html : '#5'
            }, {
                xtype : 'textfield',
                id : 'mfv5',
                bounds : null,
                width : 200
            }, {
                xtype : 'button',
                text : 'Set From Current View',
                handler : function(btn, e) {
                    Ext.getCmp("mfv5").bounds = Ext.getCmp("map").map
                            .getExtent();
                    Application.saveViews();
                }
            }, {
                xtype : 'button',
                text : 'View',
                handler : function(btn, e) {
                    bnds = Ext.getCmp("mfv5").bounds;
                    if (bnds) {
                        Ext.getCmp("map").map.zoomToExtent(bnds, true);
                    }
                }
            }]
        });

var mucform = new Ext.form.FormPanel({
            labelWidth : 200,
            padding : 5,
            items : [{
                        xtype : 'textfield',
                        allowBlank : false,
                        name : 'roomname',
                        fieldLabel : 'Room Name'
                    }, {
                        xtype : 'textfield',
                        allowBlank : false,
                        name : 'roomhandle',
                        value : Application.USERNAME,
                        fieldLabel : 'Chat Handle'
                    }, {
                        xtype : 'checkbox',
                        name : 'bookmark',
                        fieldLabel : 'Save Bookmark for Chatroom?',
                        handler : function(cb, val) {
                            if (val) {
                                mucform.getForm().findField('roomalias')
                                        .enable();
                            } else {
                                mucform.getForm().findField('roomalias')
                                        .disable();
                            }
                        }
                    }, {
                        xtype : 'textfield',
                        name : 'roomalias',
                        fieldLabel : 'Bookmark Alias (optional)',
                        disabled : true
                    }, {
                        xtype : 'checkbox',
                        name : 'anonymous',
                        fieldLabel : 'Anonymously Monitor (read-only)'
                    }, {
                        xtype : 'checkbox',
                        name : 'autojoin',
                        fieldLabel : 'Auto Join Room after Login'
                    }],
            listeners : {
                render : function() {
                    var h = mucform.getForm().findField('roomhandle')
                            .getValue();
                    if (!h) {
                        mucform.getForm().findField('roomhandle')
                                .setValue(Application.USERNAME);
                    }
                }

            }
        });

var privform = new Ext.form.FormPanel({
            labelWidth : 100,
            padding : 5,
            items : [{
                        xtype : 'textfield',
                        fieldLabel : 'User Name',
                        emptyText : 'media-joe.blow',
                        name : 'username'
                    }]
        });

Application.CreatePrivateChat = new Ext.Window({
            width : 400,
            title : 'Chat with User',
            items : [privform],
            buttons : [{
                xtype : 'button',
                text : 'Start Chat',
                scope : privform,
                handler : function() {
                    var barejid = this.getForm().findField('username')
                            .getValue();
                    if (barejid.indexOf("@") == -1) {
                        barejid = barejid + "@" + Application.XMPPHOST;
                    }
                    Application.CreatePrivateChat.hide();
                    cp = Ext.getCmp("chatpanel").getChat(barejid);
                    if (!cp) {
                        cp = Ext.getCmp("chatpanel").addChat(barejid);
                    }
                    Ext.getCmp("chatpanel").setActiveTab(cp);
                }
            }, {
                xtype : 'button',
                text : "Cancel",
                handler : function() {
                    Application.CreatePrivateChat.hide();
                }
            }]
        });

Application.JoinChatroomDialog = new Ext.Window({
            width : 400,
            title : 'Join a Group Chat',
            items : [mucform],
            buttons : [{
                xtype : 'button',
                text : "Join Room",
                scope : mucform,
                handler : function() {
                    roomname = this.getForm().findField('roomname').getValue();
                    room = roomname + "@conference." + Application.XMPPHOST;
                    handle = this.getForm().findField('roomhandle').getValue();
                    ibook = this.getForm().findField('bookmark').getValue();
                    anonymous = this.getForm().findField('anonymous')
                            .getValue();
                    autojoin = this.getForm().findField('autojoin').getValue();
                    /* Add XMPP MUC Bookmark */
                    if (ibook) {
                        alias = this.getForm().findField('roomalias')
                                .getValue();
                        if (alias == "") {
                            alias = roomname;
                        }
                        /* Add to bookmarks widget */
                        Ext.getCmp("bookmarks").root.appendChild({
                                    text : alias + " (" + roomname + ")",
                                    jid : room,
                                    alias : alias,
                                    anonymous : anonymous,
                                    autojoin : autojoin,
                                    icon : 'icons/chat.png',
                                    handle : handle,
                                    leaf : true
                                });
                    }
                    Application.MsgBus.fireEvent('joinchat', room, handle,
                            anonymous);
                    Application.JoinChatroomDialog.hide();
                }
            }, {
                xtype : 'button',
                text : "Cancel",
                handler : function() {
                    Application.JoinChatroomDialog.hide();
                }
            }]
        });

Application.msgtpl = new Ext.XTemplate('<p>{date:date("g:i:s A")} :: {msg}</p>');

Application.TextWindow = new Ext.Window({
            width : 550,
            height : 300,
            title : 'Product Text',
            closeAction : 'hide',
            constrain : true,
            hidden : true,
            autoScroll : true,
            html : 'Loading....'
        });

Application.log = function(text) {
    Ext.getCmp("debug").addMessage(text);
};


function saveBookmarks() {
    /* Save bookmarks to the server, please */
    var root = Ext.getCmp("bookmarks").root;
    var stanza = $iq({
                type : 'set',
                id : '_set1'
            }).c('query', {
                xmlns : 'jabber:iq:private'
            }).c('storage', {
                xmlns : 'storage:bookmarks'
            });
    root.eachChild(function(n) {
                this.c('conference', {
                            name : n.attributes.alias,
                            anonymous : n.attributes.anonymous ? 'true': 'false',
                            autojoin : n.attributes.autojoin ? 'true': 'false',
                            jid : n.attributes.jid
                        }).c('nick', n.attributes.handle).up().up();
            }, stanza);
    Application.XMPPConn.sendIQ(stanza.tree());
}

function onPresenceCheck(item, checked) {
    if (item.xmpp == 'available') {
        Application.XMPPConn.send($pres());
    } else {
        Application.XMPPConn.send($pres().c('show', 'away').up().c('status',
                item.xmpp));
    }
    Ext.getCmp("presenceUI").setText(item.text);
};

Application.Control = {
    region : 'west',
    title : 'Weather.IM Live',
    collapsible : true,
    width : 200,
    split : true,
    layout : 'accordion',
    layoutConfig : {
        autoWidth : false
    },
    autoScroll : true,
    tbar : [{
        text : "Actions",
        menu : [{
                    checked : false,
                    text : 'Show Offline Buddies',
                    checkHandler : function(item, checked) {

                        Ext.getCmp('buddies').root.cascade(function(n) {
                                    if (checked) {
                                        n.ui.show();
                                    } else {
                                        if (n.attributes.presence == 'offline') {
                                            n.ui.hide();
                                        }
                                    }
                                });
                    }
                }, {
                    xtype : 'menuitem',
                    text : 'Chat with User',
                    handler : function() {
                        Application.CreatePrivateChat.show();
                    }
                }, {
                    xtype : 'menuitem',
                    text : 'Add Buddy...',
                    handler : function() {
                        Application.buildAddBuddy(null,null,null);
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Join Group Chat',
                    handler : function() {
                        Application.JoinChatroomDialog.show();
                    }
                }, {
                    text : 'Msg Text Color',
                    menu : {
                        items : [
                            new Ext.ColorPalette({
                                id : 'fgcolor',
                                value : '000000',
                                listeners : {
                                    select : function(cp,color){
                                        Application.setPreference('fgcolor', color);
                                    }
                                }
                            })
                        ]
                    }
                },{
                    text : 'Msg Background Color',
                    menu : {
                        items : [
                            new Ext.ColorPalette({
                                id : 'bgcolor',
                                value : 'FFFFFF',
                                listeners : {
                                    select : function(cp,color){
                                        Application.setPreference('bgcolor', color);
                                    }
                                }
                            })
                        ]
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Show Debug Window',
                    handler : function() {
                        Ext.getCmp("debug").show();
                        
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Log Out',
                    handler : function() {
                        /* Don't try to reconnect */
                        Application.log("Manual logout requested.");
                        Application.RECONNECT = false;
                        Application.XMPPConn.disconnect();
                    }
                }]
    }, {
        xtype : 'tbseparator'
    }, {
        text : 'Available',
        id : 'presenceUI',
        menu : {
            items : [{
                        text : 'Available',
                        xmpp : 'available',
                        checked : true,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }, {
                        text : 'Be Right Back',
                        xmpp : 'Be Right Back',
                        checked : false,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }, {
                        text : 'Away',
                        xmpp : 'away',
                        checked : false,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }]
        }
    }, {
        xtype : 'splitbutton',
        id : 'sound',
        scale : 'medium',
        soundOn : true,
        handler : function(btn) {
            if (btn.soundOn) {
                btn.setIcon('icons/mute.png');
                soundManager.muteAll();
                btn.soundOn = false;
            } else {
                btn.setIcon('icons/volume.png');
                soundManager.unmuteAll();
                btn.soundOn = true;
                Application.MsgBus.fireEvent("soundevent", "default");
            }
        },
        arrowHandler : function() {
            Application.soundPrefs.show();
        },
        icon : 'icons/volume.png'
    }],
    items : [{
                flex : 1,
                xtype : 'treepanel',
                id : 'buddies',
                title : 'Buddies',
                collapsed : false,
                rootVisible : false,
                lines : false,
                autoScroll : true,
                containerScroll: true,
                plugins: new Ext.ux.DataTip({
                    tpl: new Ext.XTemplate(
                    '<tpl if="typeof(resources) !== &quot;undefined&quot;">',
                    '<div>',
                    '<tpl for="resources.items">',
                        '<p><b>Resource:</b> {resource} <b>Status:</b> {status}</p>',
                    '</tpl>',
                    '</div>',
                    '</tpl>'
                    )
                }),
                listeners : {
                    click : function(n) {
                        cp = Ext.getCmp("chatpanel").getChat( n.attributes.barejid );
                        if (! cp){
                            cp = Ext.getCmp("chatpanel").addChat( n.attributes.barejid );
                        }
                        Ext.getCmp("chatpanel").setActiveTab(cp);
                    }
                },
                root : new Ext.tree.TreeNode()
            }, {
                flex : 1,
                xtype : 'treepanel',
                id : 'bookmarks',
                title : 'Chatroom Bookmarks',
                collapsed : false,
                rootVisible : false,
                enableDD : true,
                lines : false,
                containerScroll: true,
                autoScroll : true,
                plugins: new Ext.ux.DataTip({
                    tpl: '<div>Anonymous: {anonymous}<br />Autojoin: {autojoin}</div>'
                }),
                contextMenu : new Ext.menu.Menu({
                            items : [{
                                        id : 'delete-node',
                                        icon : 'icons/close.png',
                                        text : 'Delete Bookmark'
                                    }],
                            listeners : {
                                itemclick : function(item) {
                                    var n = item.parentMenu.contextNode;
                                    switch (item.id) {
                                        case 'delete-node' :
                                            if (n.parentNode) {
                                                n.remove();
                                                saveBookmarks();
                                            }
                                            break;
                                    }
                                }
                            }
                        }),
                listeners : {
                    contextmenu : function(node, e) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    },
                    movenode: function(tp, node, oldParent, newParent, index){
                        saveBookmarks();
                    },
                    click : function(n) {
                        Application.JoinChatroomDialog.show(null, function(){
                            form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            form.findField("roomhandle").setValue(n.attributes.handle);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(n.attributes.anonymous);
                            form.findField("autojoin").setValue(n.attributes.autojoin);
                            form.findField("roomalias").setValue(n.attributes.alias);
                            });
                        }
                },
                root : new Ext.tree.TreeNode({
                            initialLoad : false,
                            listeners : {
                                beforeappend : function(tree, root, node, index) {
                                    /*
                                     * Ensure that we are appending an unique
                                     * node
                                     */
                                    var oldnode = root.findChild('jid', node.attributes.jid);
                                    if (oldnode) {
                                        Application.log("Replacing MUC bookmark: "+ node.attributes.jid );
                                        root.removeChild(oldnode, true);
                                    }
                                    return true; /* lets be safe */
                                },
                                append : function(tree, root, node, index) {
                                    if (root.initialLoad) {
                                        saveBookmarks();
                                    }
                                }
                            }
                        })
            }, {
                flex : 2,
                xtype : 'treepanel',
                id : 'chatrooms',
                title : 'Chatrooms',
                collapsed : false,
                rootVisible : false,
                lines : false,
                autoScroll : true,
                containerScroll: true,
                listeners : {
                    click : function(n) {
                        Application.JoinChatroomDialog.show(null, function(){
                            form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            form.findField("roomhandle").setValue(Application.USERNAME);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(false);
                            form.findField("autojoin").setValue(false);
                            form.findField("roomalias").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            });
                    }
                },
                root : new Ext.tree.TreeNode()
            }]
};

Application.doLogin = function() {
    Application.RECONNECT = true;
    Application.ATTEMPTS += 1;
    if (Application.ATTEMPTS > 11){
        Application.log("Application Login Limit Reached!");
        return;
    }
    
    // Get username from HTML input or ExtJS component
    var usernameField = Ext.getCmp('username') || document.getElementById('username');
    username = usernameField.getValue ? usernameField.getValue() : usernameField.value;
    
    if (username.indexOf("@") > 0) {
        username = Strophe.getNodeFromJid(username);
    }
    username = username.toLowerCase();
    username = username.replace(/^\s+|\s+$/g, '');
    
    // Get password from HTML input or ExtJS component
    var passwordField = Ext.getCmp('password') || document.getElementById('password');
    password = passwordField.getValue ? passwordField.getValue() : passwordField.value;
    
    if (username == "") {
        Application.log("Invalid Username");
        return;
    }
    if (password == "") {
        Application.log("Invalid Password");
        return;
    }
    Application.login(username, password);
};


Application.ServiceGuard = {
    skipFirst : true,
    run : function() {
        if (this.skipFirst) {
            this.skipFirst = false;
            return;
        }
        if (!Application.XMPPConn) {
            return;
        }
        // if (!Application.XMPPConn.authenticated &&
        // Application.log("Encountered Unaccounted for disconnect!");
        // Application.MsgBus.fireEvent('loggingout');
        // }
        if (Application.XMPPConn.authenticated) {
            if (Application.XMPPConn.errors == 0) {
                // punjab is pinging openfire for us, might as well remove
                // Application.XMPPConn.send($iq({'type': 'get'}).c('ping', {
                // xmlns: 'urn:xmpp:ping' } ));
            } else {
                Application.log("Strophe error counter is non-zero: "
                        + Application.XMPPConn.errors);
            }
        }
    },
    interval : 120000
};

function UTCStringToDate(dtStr, format) {
    var dt = Date.parseDate(dtStr, format);
    if (dt == undefined)
        return ''; // or whatever you want to do
    return dt.fromUTC();
}

function buildXMPP(){
    Application.log("Initializing XMPPConn Obj");
    Application.XMPPConn = new Strophe.Connection(Application.BOSH);
    Application.XMPPConn.disco
            .addFeature("http://jabber.org/protocol/chatstates");
    if (Application.DEBUGMODE) {
        Application.XMPPConn.rawInput = rawInput;
        Application.XMPPConn.rawOutput = rawOutput;
    }
}

/*
 * Called when we wish to login! 
 */
Application.login = function(username, password) {
    jid = username + "@" + Application.XMPPHOST + "/"+ Application.XMPPRESOURCE;
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    Application.XMPPConn.connect(jid, password, onConnect, 60, 1,
            Application.ROUTE);
};

// Anonymous Login!
Application.doAnonymousLogin = function(){
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    Application.XMPPConn.connect(Application.XMPPHOST, null, onConnect);
};

// Registration!
Application.register = function(){
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    var callback = function (status) {
        if (status === Strophe.Status.REGISTER) {
            Application.log("Strophe.Status.REGISTER");
            Application.XMPPConn.register.fields.username = Ext.get("reguser").getValue();
            Application.XMPPConn.register.fields.password = Ext.get("regpass").getValue();
            Application.XMPPConn.register.fields.email = Ext.get("regemail").getValue();
            Application.XMPPConn.register.submit();
        } else if (status === Strophe.Status.REGISTERED) {
            Application.log('Username '+Application.XMPPConn.register.fields.username+' registered with server ...');
            Ext.getCmp('loginwindow').items.items[0].activate(0);
            document.getElementById('username').value = Application.XMPPConn.register.fields.username;
            document.getElementById('password').value = Application.XMPPConn.register.fields.password;
            Application.XMPPConn.disconnect();
            Application.doLogin();
        } else if (status === Strophe.Status.CONFLICT) {
            Application.log("Contact already existed!");
        } else if (status === Strophe.Status.NOTACCEPTABLE) {
            Application.log("Registration form not properly filled out.");
        } else if (status === Strophe.Status.REGIFAIL) {
            Application.log("The Server does not support In-Band Registration");
        } else if (status === Strophe.Status.CONNECTED) {
            Application.log('connected?');
            Application.USERNAME = Strophe.getNodeFromJid(Application.XMPPConn.jid);
            // do something after successful authentication
        } else {
            Application.log(status);
            // Do other stuff
        }
    };
    Application.XMPPConn.register.connect(Application.XMPPHOST, callback);
};

/*
 * Handle Strophe Connection Changes, we need to account for the following 1.
 * User is attempting to log in 2. User gets forced logged out via some failure
 * 3. User wants to log out...
 */
function onConnect(status) {

    if (status == Strophe.Status.CONNECTING) {
        Application.log('Strophe.Status.CONNECTING...');
    } else if (status == Strophe.Status.ERROR) {
        Application.log('Strophe.Status.ERROR...');
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status == Strophe.Status.AUTHFAIL) {
        Application.log('Strophe.Status.AUTHFAIL...');
        Application.RECONNECT = false;
        Ext.getCmp('loginpanel').addMessage(
            'Authentication failed, please check username and password...');
        Application.XMPPConn.disconnect();
    } else if (status == Strophe.Status.CONNFAIL) {
        Application.log('Strophe.Status.CONNFAIL...');
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status == Strophe.Status.DISCONNECTED) {
        Application.log('Strophe.Status.DISCONNECTED...');
        Application.MsgBus.fireEvent("loggingout");
        if (Application.RECONNECT) {
            /* Lets wait 5 seconds before trying to reconnect */
            Application.log("Relogging in after 3 seconds delay");
            Application.doLogin.defer(3000, this);
        } else {
            Application.MsgBus.fireEvent("loggedout");
        }
    } else if (status == Strophe.Status.AUTHENTICATING) {
        Application.log('Strophe.Status.AUTHENTICATING...');
    } else if (status == Strophe.Status.DISCONNECTING) {
        Application.log('Strophe.Status.DISCONNECTING...');
        Application.XMPPConn.flush();
        //Application.XMPPConn.disconnect();
    } else if (status == Strophe.Status.ATTACHED) {
        Application.log('Strophe.Status.ATTACHED...');
    } else if (status == Strophe.Status.CONNECTED) {
        Application.log('Strophe.Status.CONNECTED...');
        Application.USERNAME = Strophe.getNodeFromJid(Application.XMPPConn.jid);
        Application.RECONNECT = true;

        /* Add Connection Handlers, removed on disconnect it seems */
        Application.XMPPConn.addHandler(onMessage, null, 'message', null, null,
                null);
        Application.XMPPConn.addHandler(onPresence, null, 'presence', null,
                null, null);
        Application.XMPPConn.addHandler(onRoster, Strophe.NS.ROSTER, 'iq',
                null, null, null);
        Application.XMPPConn.addHandler(onIQ, null, 'iq', null, null, null);

        /* Send request for roster */
        Application.XMPPConn.send($iq({
                    type : 'get'
                }).c('query', {
                    xmlns : Strophe.NS.ROSTER
                }).tree());

        /* Attempt to re-establish already joined chatrooms */
        var rejoinedRooms = 0;
        Ext.getCmp("chatpanel").items.each(function(panel) {
                    if (panel.chatType == 'groupchat') {
                        Application.log("Attempting to rejoin MUC: "
                                + panel.barejid);
                        var p = $pres({
                                    to : panel.barejid + '/' + panel.handle
                                });
                        if (panel.anonymous) {
                            p.c('x', {
                                        'xmlns' : 'http://jabber.org/protocol/muc#user'
                                    }).c('item').c('role', 'visitor');
                        }
                        (function() {
                            Application.XMPPConn.send(this.p);
                        }).defer(5000*rejoinedRooms, {
                            p : p
                        });
                        rejoinedRooms += 1;
                    }
                });

        /* Send request for Live prefs */
        var stanza = $iq({
                    type : 'get',
                    id : '_get3'
                }).c('query', {
                    xmlns : 'jabber:iq:private'
                }).c('storage', {
                    xmlns : 'nwschatlive:prefs'
                }).tree();
        Application.XMPPConn.sendIQ(stanza, parsePrefs);

        /* Send request for Live views */
        var stanza = $iq({
                    type : 'get',
                    id : '_get2'
                }).c('query', {
                    xmlns : 'jabber:iq:private'
                }).c('storage', {
                    xmlns : 'nwschatlive:views'
                }).tree();
        Application.XMPPConn.sendIQ(stanza, parseViews);

        Application.MsgBus.fireEvent("loggedin");
    }
}
/*
 * Update the map layers based on our stored preferences
 */
function updateMap() {

    var lstring = Application.getPreference("layers");
    if (lstring == null) {
        return;
    }
    var tokens = lstring.split("||");
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] == "") {
            continue;
        }
        idx = Application.layerstore.find('title', tokens[i]);
        if (idx == -1) {
            continue;
        }
        Application.log("Setting Layer " + tokens[i] + " visable");
        layer = Application.layerstore.getAt(idx).getLayer();
        layer.setVisibility(true);
    }
}

function setSounds() {
    Application.prefStore.each(function(record) {
        key = record.get("key");
        if (key == "volume"){
            Ext.getCmp("volume").setValue(record.get("value"));
            return;
        }
        if (key.indexOf("sound::") != 0) {
            return;
        }
        tokens = key.split("::");
        if (tokens.length != 3) {
            return;
        }
        sidx = tokens[1];
        opt = tokens[2];
        store = Ext.getCmp("soundpanel").getStore();
        idx = store.find('id', sidx);
        if (idx > -1) {
            lrecord = store.getAt(idx);
            val = record.get("value");
            if (val == "true"){
                val = true;
            }
            if (val == "false"){
                val = false;
            }
            lrecord.set(opt, val);
            //console.log("Setting sound "+ sidx +"| Opt "+ opt
            // +"| Value "+ val + "--"+ typeof(val));
        }
    });
}

/*
 * Parse preferences stored on the server side, please
 */
function parsePrefs(msg) {
    Application.prefStore.removeAll();
    var elem = $(msg).find("pref");
    for (var i = 0; i < elem.length; i++) {
        key = elem[i].getAttribute("key");
        value = elem[i].getAttribute("value");
        Application.setPreference(key, value);
    }
    Application.prefStore.locked = true;
    setSounds();
    try {
        var size = parseInt(Application.getPreference('font-size', 14)) + 2;
        // cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
        cssfmt = String.format('normal {0}px arial', size);
        Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
        Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
        updateMap();
        Application.updateColors();
    } catch (e) {
    }
    Application.prefStore.locked = false;
}

function parseViews(msg) {
    if (!Ext.getCmp("map")) {
        return;
    }
    elem = $(msg).find("view");
    for (var i = 0; i < elem.length; i++) {
        label = elem[i].getAttribute("label");
        bounds = elem[i].getAttribute("bounds");
        if (label != "") {
            Ext.getCmp("mfv" + (i + 1)).setValue(label);
            Ext.getCmp("fm" + (i + 1)).setText(label);
        }
        Ext.getCmp("mfv" + (i + 1)).bounds = OpenLayers.Bounds.fromArray(bounds
                .split(","));
        if (i == 0) {
            Ext.getCmp('map').map.zoomToExtent(OpenLayers.Bounds
                            .fromArray(bounds.split(",")), true);
        }
    }
}

function parseBookmarks(msg) {
    elem = $(msg).find("conference");
    var autoJoinedRooms = 0;
    for (var i = 0; i < elem.length; i++) {
        alias = elem[i].getAttribute("name");
        jid = elem[i].getAttribute("jid");
        nick = $(elem[i]).find('nick').text();
        if (nick == null || nick == "") {
            nick = Application.USERNAME;
        }
        anonymous = (elem[i].getAttribute("anonymous") == 'true');
        autojoin = (elem[i].getAttribute("autojoin") == 'true');

        Ext.getCmp("bookmarks").root.appendChild({
                    text : alias + " (" + Strophe.getNodeFromJid(jid) + ")",
                    jid : jid,
                    alias : alias,
                    autojoin : autojoin,
                    iconCls : 'chatroom-icon',
                    handle : nick,
                    anonymous : anonymous,
                    leaf : true
                });
        if (autojoin && Ext.getCmp("chatpanel").getMUC(jid) == null) {
            /*
             * We need to slow down the loading of chatrooms as this can be
             * a very expensive browser operation, IE will complain about
             * unresponsive script.
             */
            Application.log("Autojoining MUC: "+ jid);
            (function() {
                Application.MsgBus.fireEvent('joinchat', this.jid, this.nick, 
                        this.anonymous);
            }).defer(5000*autoJoinedRooms, {
                jid : jid,
                nick : nick,
                anonymous : anonymous
            });
            autoJoinedRooms += 1;
        }
    }
    Ext.getCmp('bookmarks').root.initialLoad = true;
}


function onIQ(msg) {
    try {
        iqParser(msg);
    } catch (err) {
        var vDebug = "IQ Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function iqParser(msg) {
    if (msg.getAttribute('id') == 'fetchrooms') {
        items = msg.firstChild.getElementsByTagName('item');
        for (var i = 0; i < items.length; i++) {

            Ext.getCmp("chatrooms").root.appendChild({
                        text : items[i].getAttribute("name")
                                + " ("
                                + Strophe.getNodeFromJid(items[i]
                                        .getAttribute('jid')) + ")",
                        jid : items[i].getAttribute('jid'),
                        iconCls : 'chatroom-icon',
                        leaf : true
                    });
        }
        myTreeSorter = new Ext.tree.TreeSorter(Ext.getCmp("chatrooms"), {
                    folderSort : true,
                    dir : 'asc'
                });
        myTreeSorter.doSort(Ext.getCmp("chatrooms").getRootNode());
    }
}

function onRoster(msg) {
    try {
        rosterParser(msg);
    } catch (err) {
        var vDebug = "Roster Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function rosterParser(msg) {
    var root = Ext.getCmp("buddies").root;
    var roster_items = $(msg).find('item');
    for (var i = 0; i < roster_items.length; i++) {
        /* Look to see if there is a group */
        var groups = $(roster_items[i]).find('group');
        for (var j = 0; j < groups.length; j++) {
            var group = $(groups[j]);
            child = root.findChild('group', group.text()) || root.appendChild({
                        leaf : false,
                        group : group.text(),
                        text : group.text(),
                        expanded : true,
                        loaded : true
                    });

            child.appendChild({
                        text : roster_items[i].getAttribute('name'),
                        barejid : roster_items[i].getAttribute('jid'),
                        resources : new Ext.util.MixedCollection(),
                        iconCls : 'buddy-offline',
                        presence : 'offline',
                        hidden : true,
                        leaf : true
                    });
            // console.log("Buddy JID:"+ roster_items[i].getAttribute('jid')
            // +" Group:"+ group.text() );
        }
    }
    /* Send initial presence */
    Application.XMPPConn.send($pres().tree());
        /* Send request for private storage */
        var stanza = $iq({
             type : 'get',
             id : '_get1'
             }).c('query', {
                  xmlns : 'jabber:iq:private'
                  }).c('storage', {
                       xmlns : 'storage:bookmarks'
                       }).tree();
        (function() {
          Application.XMPPConn.sendIQ(stanza, parseBookmarks);
        }).defer(3000, this);

    return true;
}

function onPresence(msg) {
    try {
        presenceParser(msg);
    } catch (err) {
        var vDebug = "Presence Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function getMUCIcon(affiliation, role) {
    if (affiliation == 'owner')
        return 'icons/owner.png';
    if (affiliation == 'admin')
        return 'icons/admin.png';

    return 'icons/participant.png';
}

function presenceParser(msg) {
    var from = msg.getAttribute('from');

    // Lets see if this is from a chatroom!
    if (Strophe.getDomainFromJid(from) == 'conference.' + Application.XMPPHOST) {
        room = Strophe.getBareJidFromJid(from);
        mcp = Ext.getCmp("chatpanel").getMUC(room);
        if (mcp == null) {
            Application.log("ERROR: got presence from non-existant room: "
                    + room);
            return;
        }
        /* Look to see if we got a 201 status */
        if ($(msg).find('status').length > 0) {
            error = $(msg).find('status');
            if (error[0].getAttribute('code') == '201') {
                Ext.Msg.alert('Status', 'Sorry, chatroom [' + room
                                + '] does not exist.');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 407 error */
        if ($(msg).find('error').length > 0) {
            error = $(msg).find('error');
            if (error[0].getAttribute('code') == '407') {
                Ext.Msg.alert('Status',
                        'Sorry, your account is not authorized to access chatroom ['
                                + room + ']');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 409 error */
        if ($(msg).find('error').length > 0) {
            error = $(msg).find('error');
            if (error[0].getAttribute('code') == '409') {
                Ext.Msg.alert('Status',
                        'Sorry, your requested chatroom handle is already in use by room ['
                                + room + ']');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 307 error */
        if ($(msg).find('status').length > 0) {
            error = $(msg).find('status');
            if (error[0].getAttribute('code') == '307') {
                Ext.Msg.alert('Status',
                                'Your account signed into this chatroom ['
                                        + room
                    + '] with the same handle from another location. Please use unique handles.');
                mcp.joinedChat = false;
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        child = mcp.roomusers.root.findChild('text', Strophe
                        .getResourceFromJid(from));

        /* Look to see if we can see JIDs */
        var xitem = $(msg).find("item");
        var jid = from;
        var affiliation;
        var role;
        if (xitem.length > 0) {
            jid = xitem[0].getAttribute("jid") || jid;
            role = xitem[0].getAttribute("role");
            affiliation = xitem[0].getAttribute("affiliation");
            /*
             * <presence xmlns='jabber:client'
             * to='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * from='mafchat@conference.localhost/fire-daryl.e.herzmann'> <x
             * xmlns='http://jabber.org/protocol/muc#user'> <item><role>visitor</role></item></x>
             * <x xmlns='http://jabber.org/protocol/muc#user'> <item
             * jid='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * affiliation='none' role='participant'/></x> </presence>
             */
            var roletest = $(xitem[0]).find("role");
            if (roletest.length > 0) {
                try {
                    role = roletest.text();
                } catch (err) {
                    var vDebug = "roletest bug\n:";
                    vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
                    for (var prop in err) {
                        vDebug += "property: " + prop + " value: [" + err[prop]
                                + "]\n";
                    }
                    vDebug += "toString(): " + " value: [" + err.toString()
                            + "]";
                    Application.log(vDebug);
                }
            }
        }

        if (msg.getAttribute('type') == null) {
            // affiliation='none' role='participant'
            // affiliation='none' role='none' <-- Leave Room
            // affiliation='owner' role='moderator'

            if (!child && role != 'visitor') {
                mcp.joinedChat = true;
                mcp.roomusers.root.appendChild({
                            affiliation : affiliation,
                            role : role,
                            icon : getMUCIcon(affiliation, role),
                            text : Strophe.getResourceFromJid(from),
                            jid : jid,
                            leaf : true
                        });
            }
        }
        if (msg.getAttribute('type') == 'unavailable') {
            if (child) {
                mcp.roomusers.root.removeChild(child);
            }
        }
    } else {
        onBuddyPresence(msg);
    }
}

function onMessage(msg) {
    try {
        messageParser(msg);
    } catch (err) {
        var vDebug = "Message Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}
// http://stackoverflow.com/questions/37684
Application.replaceURLWithHTMLLinks = function(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if (text == null) return null;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
};

function messageParser(msg) {
    //var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var x = $(msg).find("delay[xmlns='urn:xmpp:delay']");
    var html = $(msg).find('html');
    var body = elems[0];
    var txt = "";
    var isDelayed = false;
    var stamp;
    
    /*
     * We need to simplify the message into something that
     * will display pretty. 
     */
    if (html.length > 0) {
                var v = $(msg).find('html').find('body');
                txt = (navigator.userAgent.match(/msie/i)) ? v[0].xml : $(v[0]).html();
        txt = txt.replace(/\<p/g, "<span").replace(/\<\/p\>/g,"</span>");
        if (txt == ""){
            Application.log("Message Failure:"+ msg);
            txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
        }
    } else {
        txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
    }

    if (x.length > 0) {
        stamp = UTCStringToDate(x[0].getAttribute('stamp').substring(0, 19),
                                'Y-m-d\\Th:i:s');
        isDelayed = true;
    } else {
        stamp = new Date();
    }
    
    if (type == "groupchat") {
        /* Look to see if a product_id is embedded */
        product_id = null;
        var x = $(msg).find('x');
        for (var i = 0; i < x.length; i++) {
            if (x[i].getAttribute("product_id")) {
                product_id = x[i].getAttribute("product_id");
            }
        }
                try{
        geomParser(msg, isDelayed);
        }catch (err){
                }
        sender = Strophe.getResourceFromJid(from);
        room = Strophe.getBareJidFromJid(from);
        mpc = Ext.getCmp("chatpanel").getMUC(room);
        if (mpc && sender) {
            mpc.gp.getStore().addSorted(new Ext.data.Record({
                        ts : stamp,
                        author : sender,
                        message : txt,
                        room : null,
                        jid : mpc.getJidByHandle(sender),
                        xdelay : isDelayed,
                        product_id : product_id
                    }));
            // i = mpc.gp.getStore().getCount() - 1;
            // row = mpc.gp.getView().getRow(i);
            // if (row) row.scrollIntoView();
            if (mpc.gp.getStore().isFiltered()) {
                mpc.gp.getStore().filterBy(iembotFilter);
            }
            if (!isDelayed){
                /* Add to allchats */
                Ext.getCmp("__allchats__").gp.getStore().addSorted(new Ext.data.Record({
                    ts : stamp,
                    author : sender,
                    room : Strophe.getNodeFromJid(from),
                    message : txt,
                    jid : mpc.getJidByHandle(sender),
                    xdelay : isDelayed,
                    product_id : product_id
                }));
                if (Ext.getCmp("__allchats__").gp.getStore().isFiltered()) {
                    Ext.getCmp("__allchats__").gp.getStore().filterBy(iembotFilter);
                }
            }
        }
    } else if (type == "chat" && !txt && from != null) {
        jid = Strophe.getBareJidFromJid(from);
        cp = Ext.getCmp("chatpanel").getChat(jid);
        /* Chat states stuff! */
        var composing = $(msg).find("composing");
        if (composing.length > 0) {
            if (cp) {
                cp.setIconCls("typing-tab");
            }
        } /*
             * var active = $(msg).find("active"); if (active.length > 0){
             *  } var inactive = $(msg).find("inactive"); if (inactive.length >
             * 0){
             *  } var gone = $(msg).find("gone"); if (gone.length > 0){
             *  }
             */
        var paused = $(msg).find("paused");
        if (paused.length > 0) {
            if (cp) {
                cp.setIconCls("paused-tab");
            }
        }

    } else if (type == "chat" && txt && from != null) {

        jid = Strophe.getBareJidFromJid(from);
        username = Strophe.getNodeFromJid(from);
        if (Strophe.getDomainFromJid(from) != Application.XMPPHOST) {
            jid = from;
            username = Strophe.getResourceFromJid(from);
        }
        cp = Ext.getCmp("chatpanel").getChat(jid);
        if (!cp) {
            cp = Ext.getCmp("chatpanel").addChat(jid);
            Application.MsgBus.fireEvent("soundevent", "new_conversation");
        }
        // Ext.getCmp("chatpanel").setActiveTab(cp);
        cp.gp.store.addSorted(new Ext.data.Record({
                    ts : stamp,
                    author : username,
                    room : null,
                    xdelay : false,
                    message : txt
                }));
        // i = cp.gp.store.getCount() - 1;
        // cp.gp.getView().getRow(i).scrollIntoView();
    } else if (from == Application.XMPPHOST) {
        /* Broadcast message! */
        (new Ext.Window({
                    width : 500,
                    maxWidth: 500,
                    height : 350,
                    constrain : true,
                    autoScroll : true,
                    bodyStyle : {
                        padding : '10',
                        background : '#fff'
                    },
                    title : $(msg).find("subject").text()
                            || 'System Message',
                    html : "<p><b>System Message</b><p>" + $(msg).find('body').text() + "</p>"

                })).show();
    }
}
function geomParser(msg, isDelayed) {
    if (!Ext.getCmp("map")) {
        return;
    }
    /* Look for iembot geometry declarations */
    var elems = msg.getElementsByTagName('body');
    var body = elems[0];
    var html = msg.getElementsByTagName('html');
    var txt = null;
    if (html.length > 0) {
                var v = $(msg).find('html').find('body');
                txt = (navigator.userAgent.match(/msie/i)) ? v[0].xml : $(v[0]).html();
    } else {
        txt = Strophe.getText(body);
    }
    var x = $(msg).find('x');
    if (x.length == 0) {
        return;
    }
    for (var i = 0; i < x.length; i++) {

        if (x[i].getAttribute("geometry") == null) {
            continue;
        }
        var geom = x[i].getAttribute('geometry');
        wkt = new OpenLayers.Format.WKT();
        collection = wkt.read(geom);
        if (collection) {
            if (collection.constructor != Array) {
                collection = [collection];
            }
            var vect = collection[0];
            /* Now we figure out when to remove this display */
            /* Our default duration is 2 hours, for LSRs */
            var delayed = 60 * 60 * 1000;
            if (x[i].getAttribute("skip")) {
                continue;
            }
            if (x[i].getAttribute("expire")) {
                var d = UTCStringToDate(x[i].getAttribute("expire"),
                        'Ymd\\Th:i:s');
                vect.attributes.expire = d.toUTC();
                diff = d - (new Date());
                // console.log("Product Time Diff:"+ diff);
                if (diff <= 0) {
                    continue;
                }
                if (diff > 0) {
                    delayed = diff;
                }
            }
            if (x[i].getAttribute("valid")) {
                var d = UTCStringToDate(x[i].getAttribute("valid"),
                        'Ymd\\Th:i:s');
                vect.attributes.valid = d.toUTC();
            }
            // console.log("Product Time Delayed:"+ delayed);
            vect.attributes.ptype = x[i].getAttribute('ptype');
            vect.attributes.message = txt;
            vect.geometry.transform(new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));
            if ((x[i].getAttribute("category") == 'LSR' || x[i]
                    .getAttribute("category") == 'PIREP')
                    && vect.attributes.valid) {
                if (!isDelayed
                        || (isDelayed && ((new Date()) - vect.attributes.valid) < 7200000)) {
                    lsrs.addFeatures([vect]);
                    (new Ext.util.DelayedTask(function() {
                                lsrs.removeFeatures([vect]);
                            })).delay(delayed);
                    sstate = Application.lsrStore.getSortState();
                    Application.lsrStore.sort(sstate.field, sstate.direction);
                }
            }
            if (x[i].getAttribute("category") == 'SBW') {
                vect.attributes.vtec = x[i].getAttribute('vtec');
                var recordID = Application.sbwStore.find('vtec',
                        vect.attributes.vtec);
                if (x[i].getAttribute("status") == 'CAN') {
                    if (recordID > -1) {
                        Application.log('Removing SBW vtec ['
                                + vect.attributes.vtec + ']');
                        Application.sbwStore.removeAt(recordID);
                    }
                    continue;
                }
                if (recordID > -1) {
                    Application.log('Old SBW vtec [' + vect.attributes.vtec
                            + ']');
                    Application.sbwStore.removeAt(recordID);
                }
                Application.log('Adding SBW vtec [' + vect.attributes.vtec
                        + '] delay [' + delayed + ']');
                sbws.addFeatures([vect]);
                (new Ext.util.DelayedTask(function() {
                            sbws.removeFeatures([vect]);
                        })).delay(delayed);
                sstate = Application.sbwStore.getSortState();
                Application.sbwStore.sort(sstate.field, sstate.direction);

            }
        }
    }
}
// function log(msg) {
// Ext.getCmp('debug').body.insertHtml('beforeEnd', msg +"<br />");
// if (console in window){
// console.log(msg);
// }

// }
function rawInput(data) {
    Application.log('RECV: ' + Strophe.xmlescape(data));
}

function rawOutput(data) {
    Application.log('SENT: ' + Strophe.xmlescape(data));
}


/*
 * Update the style of the text entry window, typically
 * called after the preference is changed...
 */
Application.updateColors = function() {
    var bgcolor = Application.getPreference('bgcolor', 'FFFFFF');
    var fgcolor = Application.getPreference('fgcolor', '000000');
    Application.log('Attempting style adjustment bgcolor:'+
               bgcolor +', fgcolor:'+ fgcolor);
    Ext.getCmp("chatpanel").items.each(function(p) {
                if (p.te) {
                    
                    p.te.items.get(0).getEl().applyStyles({
                                background : '#' + bgcolor,
                                color : '#' + fgcolor
                            });
                }
            });
    /*
    Ext.util.CSS.updateRule('.me', 'color', 
            '#'+ Application.getPreference("handle_fgcolor", "000000"));
    Ext.util.CSS.updateRule('.me', 'background', 
            '#'+ Application.getPreference("handle_bgcolor", "FFFFFF"));
            */
};

/* 
 * Sync application Preferences upstream!
 */
Application.syncPreferences = function(){
    Application.log("Saving preferences to server...");
    var stanza = $iq({
                                type : 'set',
                                id : '_set1'
                            }).c('query', {
                                xmlns : 'jabber:iq:private'
                            }).c('storage', {
                                xmlns : 'nwschatlive:prefs'
                            });
    Application.prefStore.each(function(record) {
                                this.c('pref', {
                                            key : record.get("key"),
                                            value : record.get("value")
                                        }).up();
    }, stanza);
    if (Application.XMPPConn !== undefined){
        Application.XMPPConn.sendIQ(stanza.tree());
    }
};

Application.removePreference = function(key) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    Application.prefStore.removeAt(idx);
  }
};

Application.getPreference = function(key, base) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    var record = Application.prefStore.getAt(idx);
    return record.get('value');
  }
  return base;
};

Application.setPreference = function(key, value) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    Application.log("Setting Preference: "+ key +" Value: "+ value);
    var record = Application.prefStore.getAt(idx);
    record.set('value', value);
  } else {
        Application.log("Adding Preference: "+ key +" Value: "+ value);
        Application.prefStore.add(new Ext.data.Record({
                    key : key,
                    value : value
                }));
    }
};

/*
 * This will be how we handle the management and storage of application
 * preferences. It is a simple store, which can save its values to XMPP Private
 * Store
 */
Application.prefStore = new Ext.data.Store({
            fields : [{
                        id : 'key'
                    }, {
                        id : 'value'
                    }],
            locked : false,
            listeners : {
                remove : function(st, record, op) {
                    Application.log("prefStore remove event fired...");
                    if (st.locked) {
                        Application
                                .log("Skipping preference save due to locking");
                        return true;
                    }
                    /* save preferences to xmpp private storage */
                    Application.syncPreferences();
                },
                update : function(st, record, op) {
                    Application.log("prefStore update event fired...");
                    if (st.locked) {
                        Application
                                .log("Skipping preference save due to locking");
                        return true;
                    }
                    /* save preferences to xmpp private storage */
                    Application.syncPreferences();

                    if (record.get('key') == 'fgcolor'
                        || record.get('key') == 'bgcolor') {
                        Application.updateColors();
                    }

                }
            }
        });

Application.MsgBus = new Ext.util.Observable();
Application.MsgBus.addEvents('message');
Application.MsgBus.addEvents('loggedin');
Application.MsgBus.addEvents('loggedout');

Application.playSound = function(sidx) {
    if (!soundManager || ! soundManager.ok() || soundManager.playState == 1) {
        return;
    }
    
    var snd = soundManager.getSoundById(sidx);
    if (!snd) {
        idx = Application.SoundStore.find('id', sidx);
        if (idx == -1) {
            Application.log("Could not find sound: " + sidx);
            return;
        }
        record = Application.SoundStore.getAt(idx);
        snd = soundManager.createSound({
                    id : record.get("id"),
                    url : record.get("src"),
                    onplay : function() {
                    },
                    onfinish : function() {
                    }
                });
    }
    if (snd){
        snd.play({
                volume : Application.getPreference('volume', 100)
            });
    }
};

Application.MsgBus.on('soundevent', function(sevent) {

    enable = Application.getPreference("sound::" + sevent + "::enabled", 'true');
    if (enable == 'false') {
        return;
    }
    sidx = Application.getPreference("sound::" + sevent + "::sound", 'default');
    Application.playSound(sidx);

});

Application.MsgBus.on('loggingout', function() {
    /* Remove chatrooms from view */
    Ext.getCmp("chatpanel").items.each(function(panel) {
                if (panel.chatType == "groupchat") {
                    //Ext.getCmp('chatpanel').remove(panel);
                    panel.clearRoom();
                }
            });
    /* Remove buddies */
    Ext.getCmp('buddies').root.removeAll();
    /* Remove bookmarks */
    Ext.getCmp('bookmarks').root.suspendEvents(false);
    Ext.getCmp('bookmarks').root.removeAll();
    Ext.getCmp('bookmarks').root.resumeEvents();
    Ext.getCmp('bookmarks').root.initalLoad = false;
    /* Remove chatrooms */
    Ext.getCmp('chatrooms').root.removeAll();

});

Application.MsgBus.on('loggedout', function() {
    Ext.getCmp('loginwindow').show();
});

Application.MsgBus.on('loggedin', function() {

            Ext.getCmp('loginwindow').hide();

            Application.XMPPConn.send($iq({
                        type : 'get',
                        id : 'fetchrooms',
                        to : 'conference.' + Application.XMPPHOST
                    }).c('query', {
                        xmlns : 'http://jabber.org/protocol/disco#items'
                    }));

        });

Application.MsgBus.on('joinchat', function(room, handle, anonymous) {
            if (handle == null || handle == "") {
                handle = Application.USERNAME;
            }
            mcp = Ext.getCmp("chatpanel").getMUC(room);
            if (mcp == null) {
                
                Application.log("Creating chatroom:" + room);
                mcp = Ext.getCmp("chatpanel").addMUC(room, handle, anonymous);
                // Ext.getCmp("chatpanel").setActiveTab(mcp);
                /* Initial Presence */
                var p = $pres({
                            to : room + '/' + handle
                        });
                if (anonymous) {
                    p.c('x', {
                                'xmlns' : 'http://jabber.org/protocol/muc#user'
                            }).c('item').c('role', 'visitor');
                }
                Application.XMPPConn.send(p);
                mcp.on('destroy', function() {
                            if (Application.XMPPConn.authenticated &&
                                    this.joinedChat) {
                                Application.XMPPConn.send($pres({
                                            type : 'unavailable',
                                            to : room + '/' + handle
                                        }));
                            }
                });

            }
            Ext.getCmp("chatpanel").setActiveTab(mcp);

        });

Application.AllChatMessageWindow = Ext.extend(Ext.Window, {
    title : 'Where to send this message?',
    width : 460,
    height : 300,
    modal : true,
    layout : 'form',
    layoutConfig : {
    },
    defaults : {
        width : 450
    },
    initComponent : function(){
        
        this.buttons = [{
            text : 'Send Message',
            scope : this,
            handler : function(){
                const tbl = this.find('name', 'columns')[0];
                Ext.each(tbl.findByType('checkbox'), function(cb){
                    if (! cb.checked){ return; }
                    Application.XMPPConn.send($msg({
                        to : cb.name+"@"+ Application.XMPPMUCHOST,
                        type : 'groupchat'
                    }).c("body").t(this.message).up().c("html", {
                        xmlns : 'http://jabber.org/protocol/xhtml-im'
                    }).c("body", {
                        xmlns : 'http://www.w3.org/1999/xhtml'
                    }).c("p").c("span", {
                style : "color:#" + Application.getPreference('fgcolor', '000000') + ";background:#"
                        + Application.getPreference('bgcolor', 'FFFFFF') + ";"
                    }).t(this.message));
                }, this);
                this.close();
            }
        },{
            text : 'Cancel',
            handler : function(){
                this.ownerCt.ownerCt.close();
            }
        }];
        
        Application.AllChatMessageWindow.superclass.initComponent.apply(this,
                arguments);
        this.buildItems(this.message);
        this.addAvailableRooms();
    },
    addAvailableRooms : function(){
        Ext.getCmp("chatpanel").items.each(function(panel) {
            if (panel.chatType != 'groupchat') { return; }
            if (panel.anonymous) { return; }
            const room = Strophe.getNodeFromJid(panel.barejid);
            if (this.items.items[1].find('name',room).length == 0){
                const tbl = this.find('name', 'columns')[0];
                pos = (tbl.entries % 3) ;
                //console.log("Adding room:"+ room +" at pos:"+pos);
                tbl.items.items[pos].add({
                        xtype : 'checkbox',
                        hideLabel : true,
                        boxLabel: room,
                        name: room
                });
                tbl.entries += 1;
            }
        }, this);
    },
    buildItems : function(message){
        this.add({
            xtype : 'textarea',
            hideLabel : true,
            html : message
        });
        this.add({
            xtype : 'fieldset',
            title : 'Send my message to the following room(s):',
            autoHeight: true,
            autoScroll: true,
            items: [{
                entries : 0,
                name : 'columns',
                layout : 'table',
                items : [{
                    layout : 'form',
                    border: false,
                    colname : 'col1',
                    width : 140,
                    items : []
                },{
                    layout : 'form',
                    border: false,
                    colname : 'col2',
                    width : 140,
                    items : []
                },{
                    width : 140,
                    border : false,
                    colname : 'col3',
                    layout : 'form',
                    items : []
                }]
            }]
        });
    }
});

Application.buildAddBuddy = function(user, alias, group){
    if (Ext.getCmp("addbuddy")){ return; }
    var win = new Ext.Window({
        title : 'Add Buddy',
        layout : 'form',
        width : 300,
        height : 150,
        id : 'addbuddy',
        items : [{
            xtype : 'textfield',
            fieldLabel : 'Weather.IM ID',
            value : user        
        },{
            xtype : 'textfield',
            fieldLabel : 'Alias',
            value : alias
        },{
            xtype : 'textfield',
            fieldLabel : 'Buddy Group',
            value : group
        }],
        buttons : [{
            text : 'Add Buddy',
            handler : function(btn){
                var user = btn.ownerCt.ownerCt.items.items[0].getValue();
                var alias = btn.ownerCt.ownerCt.items.items[1].getValue();
                var group = btn.ownerCt.ownerCt.items.items[2].getValue();
                /* <iq from='juliet@example.com/balcony'
                       id='ph1xaz53'
                       type='set'>
                     <query xmlns='jabber:iq:roster'>
                       <item jid='nurse@example.com'
                             name='Nurse'>
                         <group>Servants</group>
                       </item>
                     </query>
                   </iq> */
                var stanza = $pres({to: user +"@"+ Application.XMPPHOST,
                    type: 'subscribe'});
                Application.XMPPConn.send(stanza.tree());
                
                stanza = $iq({
                    type : 'set'
                }).c('query', {
                    xmlns : 'jabber:iq:roster'
                }).c('item', {
                    jid : user +"@"+ Application.XMPPHOST,
                    name : alias
                }).c('group', group);
                Application.XMPPConn.send(stanza.tree());
                Ext.getCmp("addbuddy").close();
            }
        }]
    });
    win.show();
};