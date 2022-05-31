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
        if (Application.LOGIN_OPT_USER){
            this.add(new Application.LoginPanel({id: 'loginpanel'}));
        }
        if (Application.LOGIN_OPT_ANONYMOUS){
            this.add({
                xtype : 'panel',
                contentEl: 'anonymous_div',
                preventBodyReset : true,
                title : 'Anonymous Login'
            });
        }
        if (Application.LOGIN_OPT_REGISTER){
            this.add({
                xtype : 'panel',
                contentEl: 'register_div',
                preventBodyReset : true,
                title : 'Register Account'
            });
        }
        this.activate(0);
    } // End of buildItems
});

Ext.reg('tabloginpanel', Application.TabLoginPanel);