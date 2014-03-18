// 
//
Ext.namespace("Application");

Application.TabLoginPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
		var config = {
    		width : 420,
    		height: 250,
    		autoScroll : true
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		Application.TabLoginPanel.superclass.initComponent.apply(this,
						arguments);
		this.buildItems();
	},
	buildItems : function() {
		this.add(new Application.LoginPanel({id: 'loginpanel'}));
		this.add({
			xtype : 'panel',
			contentEl: 'anonymous',
			title : 'Anonymous Login'
		});
		this.add({
			xtype : 'panel',
			contentEl: 'register',
			title : 'Register Account'
		});
		this.activate(0);
	} // End of buildItems
});

Ext.reg('tabloginpanel', Application.TabLoginPanel);