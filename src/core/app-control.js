/**
 * Application Core
 * Application.Control, doLogin, ServiceGuard
 */

import { saveBookmarks } from '../dialogs/Dialogs.js';

Ext.ns("Application");

Application.log = function(text) {
    console.log("Application.log:", text);
};

function onPresenceCheck(item) {
    if (item.xmpp == 'available') {
        Application.XMPPConn.send($pres());
    } else {
        Application.XMPPConn.send($pres().c('show', 'away').up().c('status',
                item.xmpp));
    }
    Ext.getCmp("presenceUI").setText(item.text);
}

Application.Control = {
    region : 'west',
    title : 'Weather.IM Live',
    collapsible : true,
    width : 200,
    split : true,
    layout : 'accordion',
    layoutConfig : {
        autoWidth : false
    },
    autoScroll : true,
    tbar : [{
        text : "Actions",
        menu : [{
                    checked : false,
                    text : 'Show Offline Buddies',
                    checkHandler : function(item, checked) {

                        Ext.getCmp('buddies').root.cascade(function(n) {
                                    if (checked) {
                                        n.ui.show();
                                    } else {
                                        if (n.attributes.presence == 'offline') {
                                            n.ui.hide();
                                        }
                                    }
                                });
                    }
                }, {
                    xtype : 'menuitem',
                    text : 'Chat with User',
                    handler : function() {
                        Application.CreatePrivateChat.show();
                    }
                }, {
                    xtype : 'menuitem',
                    text : 'Add Buddy...',
                    handler : function() {
                        Application.buildAddBuddy(null,null,null);
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Join Group Chat',
                    handler : function() {
                        Application.JoinChatroomDialog.show();
                    }
                }, {
                    text : 'Msg Text Color',
                    menu : {
                        items : [
                            new Ext.ColorPalette({
                                id : 'fgcolor',
                                value : '000000',
                                listeners : {
                                    select : function(cp,color){
                                        Application.setPreference('fgcolor', color);
                                    }
                                }
                            })
                        ]
                    }
                },{
                    text : 'Msg Background Color',
                    menu : {
                        items : [
                            new Ext.ColorPalette({
                                id : 'bgcolor',
                                value : 'FFFFFF',
                                listeners : {
                                    select : function(cp,color){
                                        Application.setPreference('bgcolor', color);
                                    }
                                }
                            })
                        ]
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Show Debug Window',
                    handler : function() {
                        Ext.getCmp("debug").show();
                        
                    }
                },{
                    xtype : 'menuitem',
                    text : 'Log Out',
                    handler : function() {
                        /* Don't try to reconnect */
                        Application.log("Manual logout requested.");
                        Application.RECONNECT = false;
                        Application.XMPPConn.disconnect();
                    }
                }]
    }, {
        xtype : 'tbseparator'
    }, {
        text : 'Available',
        id : 'presenceUI',
        menu : {
            items : [{
                        text : 'Available',
                        xmpp : 'available',
                        checked : true,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }, {
                        text : 'Be Right Back',
                        xmpp : 'Be Right Back',
                        checked : false,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }, {
                        text : 'Away',
                        xmpp : 'away',
                        checked : false,
                        group : 'presence',
                        checkHandler : onPresenceCheck
                    }]
        }
    }, {
        xtype : 'splitbutton',
        id : 'sound',
        scale : 'medium',
        soundOn : true,
        handler : function(btn) {
            if (btn.soundOn) {
                btn.setIcon('icons/mute.png');
                soundManager.muteAll();
                btn.soundOn = false;
            } else {
                btn.setIcon('icons/volume.png');
                soundManager.unmuteAll();
                btn.soundOn = true;
                Application.MsgBus.fireEvent("soundevent", "default");
            }
        },
        arrowHandler : function() {
            Application.soundPrefs.show();
        },
        icon : 'icons/volume.png'
    }],
    items : [{
                flex : 1,
                xtype : 'treepanel',
                id : 'buddies',
                title : 'Buddies',
                collapsed : false,
                rootVisible : false,
                lines : false,
                autoScroll : true,
                containerScroll: true,
                plugins: new Ext.ux.DataTip({
                    tpl: new Ext.XTemplate(
                    '<tpl if="typeof(resources) !== &quot;undefined&quot; && resources && resources.items">',
                    '<div>',
                    '<tpl for="resources.items">',
                        '<p><b>Resource:</b> {resource} <b>Status:</b> {status}</p>',
                    '</tpl>',
                    '</div>',
                    '</tpl>'
                    )
                }),
                listeners : {
                    click : function(n) {
                        var cp = Ext.getCmp("chatpanel").getChat( n.attributes.barejid );
                        if (! cp){
                            cp = Ext.getCmp("chatpanel").addChat( n.attributes.barejid );
                        }
                        Ext.getCmp("chatpanel").setActiveTab(cp);
                    }
                },
                root : new Ext.tree.TreeNode()
            }, {
                flex : 1,
                xtype : 'treepanel',
                id : 'bookmarks',
                title : 'Chatroom Bookmarks',
                collapsed : false,
                rootVisible : false,
                enableDD : true,
                lines : false,
                containerScroll: true,
                autoScroll : true,
                plugins: new Ext.ux.DataTip({
                    tpl: '<div>Anonymous: {anonymous}<br />Autojoin: {autojoin}</div>'
                }),
                contextMenu : new Ext.menu.Menu({
                            items : [{
                                        id : 'delete-node',
                                        icon : 'icons/close.png',
                                        text : 'Delete Bookmark'
                                    }],
                            listeners : {
                                itemclick : function(item) {
                                    var n = item.parentMenu.contextNode;
                                    switch (item.id) {
                                        case 'delete-node' :
                                            if (n.parentNode) {
                                                n.remove();
                                                saveBookmarks();
                                            }
                                            break;
                                    }
                                }
                            }
                        }),
                listeners : {
                    contextmenu : function(node, e) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    },
                    movenode: function(){
                        saveBookmarks();
                    },
                    click : function(n) {
                        Application.JoinChatroomDialog.show(null, function(){
                            var form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            form.findField("roomhandle").setValue(n.attributes.handle);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(n.attributes.anonymous);
                            form.findField("autojoin").setValue(n.attributes.autojoin);
                            form.findField("roomalias").setValue(n.attributes.alias);
                            });
                        }
                },
                root : new Ext.tree.TreeNode({
                            initialLoad : false,
                            listeners : {
                                beforeappend : function(_tree, root, node) {
                                    /*
                                     * Ensure that we are appending an unique
                                     * node
                                     */
                                    var oldnode = root.findChild('jid', node.attributes.jid);
                                    if (oldnode) {
                                        Application.log("Replacing MUC bookmark: "+ node.attributes.jid );
                                        root.removeChild(oldnode, true);
                                    }
                                    return true; /* lets be safe */
                                },
                                append : function(_tree, root) {
                                    if (root.initialLoad) {
                                        saveBookmarks();
                                    }
                                }
                            }
                        })
            }, {
                flex : 2,
                xtype : 'treepanel',
                id : 'chatrooms',
                title : 'Chatrooms',
                collapsed : false,
                rootVisible : false,
                lines : false,
                autoScroll : true,
                containerScroll: true,
                listeners : {
                    click : function(n) {
                        Application.JoinChatroomDialog.show(null, function(){
                            var form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            form.findField("roomhandle").setValue(Application.USERNAME);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(false);
                            form.findField("autojoin").setValue(false);
                            form.findField("roomalias").setValue(Strophe.getNodeFromJid(n.attributes.jid));
                            });
                    }
                },
                root : new Ext.tree.TreeNode()
            }]
};

Application.doLogin = function() {
    Application.RECONNECT = true;
    Application.ATTEMPTS += 1;
    if (Application.ATTEMPTS > 11){
        Application.log("Application Login Limit Reached!");
        return;
    }
    
    // Get username from HTML input or ExtJS component
    var usernameField = Ext.getCmp('username') || document.getElementById('username');
    var username = usernameField.getValue ? usernameField.getValue() : usernameField.value;
    
    if (username.indexOf("@") > 0) {
        username = Strophe.getNodeFromJid(username);
    }
    username = username.toLowerCase();
    username = username.replace(/^\s+|\s+$/g, '');
    
    // Get password from HTML input or ExtJS component
    var passwordField = Ext.getCmp('password') || document.getElementById('password');
    var password = passwordField.getValue ? passwordField.getValue() : passwordField.value;
    
    if (username == "") {
        Application.log("Invalid Username");
        return;
    }
    if (password == "") {
        Application.log("Invalid Password");
        return;
    }
    Application.login(username, password);
};


Application.ServiceGuard = {
    skipFirst : true,
    run : function() {
        if (this.skipFirst) {
            this.skipFirst = false;
            return;
        }
        if (!Application.XMPPConn) {
            return;
        }
        // if (!Application.XMPPConn.authenticated &&
        // Application.log("Encountered Unaccounted for disconnect!");
        // Application.MsgBus.fireEvent('loggingout');
        // }
        if (Application.XMPPConn.authenticated) {
            if (Application.XMPPConn.errors == 0) {
                // punjab is pinging openfire for us, might as well remove
                // Application.XMPPConn.send($iq({'type': 'get'}).c('ping', {
                // xmlns: 'urn:xmpp:ping' } ));
            } else {
                Application.log("Strophe error counter is non-zero: "
                        + Application.XMPPConn.errors);
            }
        }
    },
    interval : 120000
};

