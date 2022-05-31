Ext.ns("Application");

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