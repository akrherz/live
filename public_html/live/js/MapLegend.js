Ext.ns("Application");

Application.MapLegend = Ext.extend(Ext.Window, {
    width : 300,
    height : 200,
    autoScroll : true,
    title : 'Map Legends',
    hidden : true,
    autoScroll : true,
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