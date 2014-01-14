Ext.ns("Application");

Application.LiveViewport = Ext.extend(Ext.Viewport, {
			layout : 'border',
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
				Application.LiveViewport.superclass.initComponent.call(this);
			}
		});
