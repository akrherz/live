Ext.ns("Application");

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
