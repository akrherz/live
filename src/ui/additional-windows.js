/**
 * Additional Windows
 * AllChatMessageWindow, buildAddBuddy
 */

import { $msg, $pres, $iq, Strophe } from 'strophe.js';

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
                var pos = (tbl.entries % 3) ;
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

Application.buildAddBuddy = function(user, alias, group){
    if (Ext.getCmp("addbuddy")){ return; }
    var win = new Ext.Window({
        title : 'Add Buddy',
        layout : 'form',
        width : 300,
        height : 150,
        id : 'addbuddy',
        items : [{
            xtype : 'textfield',
            fieldLabel : 'Weather.IM ID',
            value : user        
        },{
            xtype : 'textfield',
            fieldLabel : 'Alias',
            value : alias
        },{
            xtype : 'textfield',
            fieldLabel : 'Buddy Group',
            value : group
        }],
        buttons : [{
            text : 'Add Buddy',
            handler : function(btn){
                var user = btn.ownerCt.ownerCt.items.items[0].getValue();
                var alias = btn.ownerCt.ownerCt.items.items[1].getValue();
                var group = btn.ownerCt.ownerCt.items.items[2].getValue();
                /* <iq from='juliet@example.com/balcony'
                       id='ph1xaz53'
                       type='set'>
                     <query xmlns='jabber:iq:roster'>
                       <item jid='nurse@example.com'
                             name='Nurse'>
                         <group>Servants</group>
                       </item>
                     </query>
                   </iq> */
                var stanza = $pres({to: user +"@"+ Application.XMPPHOST,
                    type: 'subscribe'});
                Application.XMPPConn.send(stanza.tree());
                
                stanza = $iq({
                    type : 'set'
                }).c('query', {
                    xmlns : 'jabber:iq:roster'
                }).c('item', {
                    jid : user +"@"+ Application.XMPPHOST,
                    name : alias
                }).c('group', group);
                Application.XMPPConn.send(stanza.tree());
                Ext.getCmp("addbuddy").close();
            }
        }]
    });
    win.show();
};
