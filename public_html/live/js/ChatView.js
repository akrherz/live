Ext.ns("Application");

function saveBookmarks() {
    /* Save bookmarks to the server, please */
    var root = Ext.getCmp("bookmarks").root;
    var stanza = $iq({
                type : 'set',
                id : '_set1'
            }).c('query', {
                xmlns : 'jabber:iq:private'
            }).c('storage', {
                xmlns : 'storage:bookmarks'
            });
    root.eachChild(function(n) {
                this.c('conference', {
                            name : n.attributes.alias,
                            anonymous : n.attributes.anonymous ? 'true': 'false',
                            autojoin : n.attributes.autojoin ? 'true': 'false',
                            jid : n.attributes.jid
                        }).c('nick', n.attributes.handle).up().up();
            }, stanza);
    Application.XMPPConn.sendIQ(stanza.tree());
}

function onPresenceCheck(item, checked) {
    if (item.xmpp == 'available') {
        Application.XMPPConn.send($pres());
    } else {
        Application.XMPPConn.send($pres().c('show', 'away').up().c('status',
                item.xmpp));
    }
    Ext.getCmp("presenceUI").setText(item.text);
};

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
                    '<tpl if="typeof(resources) !== &quot;undefined&quot;">',
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
                        cp = Ext.getCmp("chatpanel").getChat( n.attributes.barejid );
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
                    movenode: function(tp, node, oldParent, newParent, index){
                        saveBookmarks();
                    },
                    click : function(n) {
                        Application.JoinChatroomDialog.show(null, function(){
                            form = this.items.items[0].getForm();
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
                                beforeappend : function(tree, root, node, index) {
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
                                append : function(tree, root, node, index) {
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
                            form = this.items.items[0].getForm();
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
    username = Ext.getCmp('username').getValue();
    if (username.indexOf("@") > 0) {
        username = Strophe.getNodeFromJid(username);
    }
    username = username.toLowerCase();
    username = username.replace(/^\s+|\s+$/g, '');
    password = Ext.getCmp('password').getValue();
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
