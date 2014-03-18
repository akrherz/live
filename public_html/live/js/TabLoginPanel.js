// 
//
Ext.namespace("Application");

Application.TabLoginPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
		var config = {
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		Application.TabLoginPanel.superclass.initComponent.apply(this,
						arguments);
		this.buildItems();
	},
	buildItems : function() {
		this.add({
			xtype : 'panel',
			title : 'Hello Daryl'
		});
		this.add(new Application.LoginPabel({id: 'loginpanel'}));
		
	} // End of buildItems
});

Ext.reg('tabloginpanel', Application.TabLoginPanel);