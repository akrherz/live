Ext.ns("Application");

Application.ChatTabPanel = Ext.extend(Ext.ux.panel.DDTabPanel, {
	initComponent : function() {
		var config = {
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		Application.ChatTabPanel.superclass.initComponent.apply(this,
						arguments);
		this.buildItems();
	},
	buildItems : function() {}
});

Ext.reg('chattabpanel', Application.ChatTabPanel);