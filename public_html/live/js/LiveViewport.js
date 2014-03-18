Ext.ns("Application");

Application.LiveViewport = Ext.extend(Ext.Viewport, {
	initComponent : function() {
		var mp = {
				xtype : 'panel',
				region : 'north',
				height : 10,
				hidden : true,
				title : 'Google Map Disabled by URL'
		};
		if (this.initialConfig.enableMap){
			mp = {
					xtype : 'panel',
					layout : 'border',
					region : 'north',
					collapsible : true,
					title : 'Google Map Panel',
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
		if (mp){
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
			/* Dunno why I have to wait until here */
			var ctrl = new OpenLayers.Control.SelectFeature([lsrs,sbws]);
			Ext.getCmp('map').map.addControl(ctrl);
			ctrl.activate();
		}


		(new Application.DebugWindow({
			id: 'debug',
			renderTo: Ext.getBody()
		}));

		(new Ext.Window({
			id: 'loginwindow',
    		modal : true,
    		closable : false,
			title : 'NWSChat Live Login Options',
			items : [new Application.TabLoginPanel()]
		})).show(); 
	}
});
