Ext.ns("Application");

  var spcConvStyles = {
	"CATEGORICAL_GENERAL" : {
		fillColor : '#c0e8c0',
		strokeColor : '#3c783c',
		graphicZIndex : 2
	},
	"CATEGORICAL_SLIGHT" : {
		fillColor : '#f6f67f',
		strokeColor : '#ff9600',
		graphicZIndex : 3
	},
	"CATEGORICAL_MODERATE" : {
		fillColor : '#e67f7f',
		strokeColor : '#cd0000',
		graphicZIndex : 4
	},
	"CATEGORICAL_HIGH" : {
		fillColor : '#ff00ff',
		strokeColor : '#000000',
		graphicZIndex : 5
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
									lonlat = new OpenLayers.LonLat(record.data.feature.geometry.x, 
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
				html = e.feature.attributes.message;
				popup = new GeoExt.Popup({
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
				html = e.feature.attributes.message;
				popup = new GeoExt.Popup({
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

var goesIR = new OpenLayers.Layer.TMS('GOES IR',
		'https://mesonet.agron.iastate.edu/cache/tile.py/', {
			layername : 'goes-ir-4km-900913',
			service : '1.0.0',
			type : 'png',
			visibility : false,
			refreshable : true,
			checkedGroup : 'Satellite',
			opacity : 0.8,
			getURL : get_my_url,
			isBaseLayer : false
		});
var goesVIS = new OpenLayers.Layer.TMS('GOES Visible Composite',
		'https://mesonet.agron.iastate.edu/cache/tile.py/', {
			layername : 'goes-vis-1km-900913',
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
			layername : 'goes-west-vis-1km-900913',
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
			layername : 'goes-east-vis-1km-900913',
			service : '1.0.0',
			type : 'png',
			visibility : false,
			refreshable : true,
			checkedGroup : 'Satellite',
			opacity : 0.8,
			getURL : get_my_url,
			isBaseLayer : false
		});
var goesWV = new OpenLayers.Layer.TMS('GOES Water Vapor',
		'https://mesonet.agron.iastate.edu/cache/tile.py/', {
			layername : 'goes-wv-4km-900913',
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
			layername : 'c-900913',
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
			layername : 's-900913',
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
	now = new Date();
	now5 = now.add(Date.MINUTE, 0 - (parseInt(now.format('i')) % 5));
	if (Ext.getCmp('appTime')) {
		Ext.getCmp('appTime').setText('Map Valid: ' + now5.format('g:i A'));
	}
};

var gmap = new OpenLayers.Layer.Google(
		"Google Streets", // the default
		{
			numZoomLevels : 20,
			sphericalMercator : true,
			maxZoomLevel : 15,
			maxExtent : new OpenLayers.Bounds(-20037508.34, -20037508.34,
					20037508.34, 20037508.34)
		});

Application.layerstore = new GeoExt.data.LayerStore({
			layers : [gmap,  new OpenLayers.Layer("No Overlay", {
								checkedGroup : 'Precip',
								isBaseLayer : false,
								visibility : true
							}), q2hsr, ridgeII, goesIR, goesVIS, goesEastVIS, goesWestVIS, goesWV, q21h, q21d, q22d,
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
					bnds = Ext.getCmp("mfv1").bounds;
					if (bnds){
						Ext.getCmp("map").map.zoomToExtent(bnds, true);
					}
				},
				menu : {
					items : [{
						id : 'fm1',
						text : 'Favorite 1',
						handler : function(item){
							bnds = Ext.getCmp("mfv1").bounds;
							if (bnds){
								Ext.getCmp("map").map.zoomToExtent(bnds, true);
							}
						}
					},{
						id : 'fm2',
						text : 'Favorite 2',
						handler : function(item){
							bnds = Ext.getCmp("mfv2").bounds;
							if (bnds){
								Ext.getCmp("map").map.zoomToExtent(bnds, true);
							}
						}
					},{
						id : 'fm3',
						text : 'Favorite 3',
						handler : function(item){
							bnds = Ext.getCmp("mfv3").bounds;
							if (bnds){
								Ext.getCmp("map").map.zoomToExtent(bnds, true);
							}
						}
					},{
						id : 'fm4',
						text : 'Favorite 4',
						handler : function(item){
							bnds = Ext.getCmp("mfv4").bounds;
							if (bnds){
								Ext.getCmp("map").map.zoomToExtent(bnds, true);
							}
						}
					},{
						id : 'fm5',
						text : 'Favorite 5',
						handler : function(item){
							bnds = Ext.getCmp("mfv5").bounds;
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

