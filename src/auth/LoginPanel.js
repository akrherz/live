/**
 * Login Panel Components
 * ExtJS manages the window/tabs, HTML provides content
 */

Ext.ns("Application");

/**
 * TabLoginPanel - Tabbed interface with multiple login options
 * Shows tabs based on Application.LOGIN_OPT_* config values
 */
Application.TabLoginPanel = Ext.extend(Ext.TabPanel, {
    initComponent : function() {
        var config = {
            width : 420,
            height: 250,
            autoScroll : true
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.TabLoginPanel.superclass.initComponent.apply(this, arguments);
        this.buildItems();
    },
    buildItems : function() {
        if (Application.LOGIN_OPT_USER){
            this.add({
                xtype : 'panel',
                title : 'Login with Account',
                contentEl: 'login_div',
                preventBodyReset : true,
                border: false,
                padding: 10
            });
        }
        if (Application.LOGIN_OPT_ANONYMOUS){
            this.add({
                xtype : 'panel',
                contentEl: 'anonymous_div',
                preventBodyReset : true,
                title : 'Anonymous Login',
                border: false,
                padding: 10
            });
        }
        if (Application.LOGIN_OPT_REGISTER){
            this.add({
                xtype : 'panel',
                contentEl: 'register_div',
                preventBodyReset : true,
                title : 'Register Account',
                border: false,
                padding: 10
            });
        }
        this.activate(0);
    }
});

Ext.reg('tabloginpanel', Application.TabLoginPanel);

