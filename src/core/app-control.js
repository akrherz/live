/**
 * Application Core
 */

import { $pres, Strophe } from 'strophe.js';
import { saveBookmarks } from '../dialogs/Dialogs.js';
import { login } from "../xmpp/handlers.js";

Application.log = function(text) {
    console.log("Application.log:", text);
};

function onPresenceCheck(item) {
    if (item.xmpp === 'available') {
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

                        Ext.getCmp('buddies').getRootNode().cascade(function(n) {
                                    if (checked) {
                                        n.ui.show();
                                    } else {
                                        if (n.data.presence === 'offline') {
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
                Application.audioMuted = true;
                btn.soundOn = false;
            } else {
                btn.setIcon('icons/volume.png');
                Application.audioMuted = false;
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
                    // In ExtJS 6, itemclick event for tree panels
                    itemclick : (_view, record) => {
                        let cp = Ext.getCmp("chatpanel").getChat( record.data.barejid );
                        if (! cp){
                            cp = Ext.getCmp("chatpanel").addChat( record.data.barejid );
                        }
                        Ext.getCmp("chatpanel").setActiveTab(cp);
                    }
                },
                root : {}
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
                                    const n = item.parentMenu.contextNode;
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
                        const c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    },
                    movenode: function(){
                        saveBookmarks();
                    },
                    itemclick : function(_view, record) {  // this
                        Application.JoinChatroomDialog.show(null, function(){
                            const form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(record.data.jid));
                            form.findField("roomhandle").setValue(record.data.handle);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(record.data.anonymous);
                            form.findField("autojoin").setValue(record.data.autojoin);
                            form.findField("roomalias").setValue(record.data.alias);
                            });
                        }
                },
                root : {
                            initialLoad : false,
                            listeners : {
                                beforeappend : function(_tree, root, node) {
                                    /*
                                     * Ensure that we are appending an unique
                                     * node
                                     */
                                    const oldnode = root.findChild('jid', node.data.jid);
                                    if (oldnode) {
                                        Application.log("Replacing MUC bookmark: "+ node.data.jid );
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
                        }
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
                    itemclick : function(_view, record) {  // this
                        Application.JoinChatroomDialog.show(null, function(){
                            const form = this.items.items[0].getForm();
                            form.findField("roomname").setValue(Strophe.getNodeFromJid(record.data.jid));
                            form.findField("roomhandle").setValue(Application.USERNAME);
                            form.findField("bookmark").enable();
                            form.findField("anonymous").setValue(false);
                            form.findField("autojoin").setValue(false);
                            form.findField("roomalias").setValue(Strophe.getNodeFromJid(record.data.jid));
                            });
                    }
                },
                root : {}
            }]
};

function doLogin() {
    Application.RECONNECT = true;
    Application.ATTEMPTS += 1;
    if (Application.ATTEMPTS > 11){
        Application.log("Application Login Limit Reached!");
        return;
    }

    // Get username from HTML input or ExtJS component
    const usernameField = Ext.getCmp('username') || document.getElementById('username');
    let username = usernameField.getValue ? usernameField.getValue() : usernameField.value;

    if (username.indexOf("@") > 0) {
        username = Strophe.getNodeFromJid(username);
    }
    username = username.toLowerCase();
    username = username.replace(/^\s+|\s+$/g, '');

    // Get password from HTML input or ExtJS component
    const passwordField = Ext.getCmp('password') || document.getElementById('password');
    const password = passwordField.getValue ? passwordField.getValue() : passwordField.value;

    if (username === "") {
        Application.log("Invalid Username");
        return;
    }
    if (password === "") {
        Application.log("Invalid Password");
        return;
    }
    login(username, password);
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
            if (Application.XMPPConn.errors === 0) {
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

export { doLogin };
