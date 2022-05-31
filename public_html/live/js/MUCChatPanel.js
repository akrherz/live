Ext.ns("Application");

Application.MUCChatPanel = Ext.extend(Ext.Panel, {
    hideMode : 'offsets',
    closable : true,
    layout : 'border',
    chatType : 'groupchat',
    barejid : null,
    handle : null,
    anonymous : null,
    joinedChat : false, /* Was I successful at getting logged into room */

    initComponent : function() {
        this.items = [{
                        xtype : 'chatgridpanel',
                            region : 'center'
                        }, {
                            xtype : 'chattextentry',
                            region : 'south',
                            height : 50,
                            split : true
                        }

        ];
        if (this.initialConfig.chatType != 'allchats') {
            this.items.push({
                xtype : 'mucroomusers',
                        region : 'east',
                        width : 175,
                        collapsible : true,
                        split : true
                    });
            this.iconCls = 'tabno';
        } else {
            this.items[1].emptyText = "Type message here";
        }
        var config = {
            listeners : {
                activate : function(self) {
                    if (self.iconCls) {
                        self.setIconCls('tabno');
                    }
                },
                deactivate : function(self) {
                    if (self.iconCls) {
                        self.setIconCls('tabno');
                    }
                }

            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MUCChatPanel.superclass.initComponent
                .apply(this, arguments);
        this.buildItems();
    },
    clearRoom : function() {
        this.gp.getStore().removeAll();
        this.roomusers.root.removeAll();
    },
    getJidByHandle : function(handle) {
        var node = this.roomusers.root.findChild('text', handle);
        if (node == null)
            return null;
        if (Strophe.getDomainFromJid(node.attributes.jid) == Application.XMPPMUCHOST)
            return null;
        return node.attributes.jid;
    },
    buildItems : function() {
        this.gp = this.items.items[0];
        this.te = this.items.items[1];
        if (this.chatType == "allchats") {
            //this.gp.toolbars[0].items.items[4].setText("Sounds Off");
            this.gp.toolbars[0].items.items[4].disable();
            this.gp.soundOn = false;
            this.te.items.items[1].setText("To Room?");
            return;
        }
        this.roomusers = this.items.items[2];
        new Ext.tree.TreeSorter(this.roomusers, {
                    folderSort : true,
                    dir : "asc",
                    property : 'text'
                });

        /* Disable text box for anonymous rooms */
        if (this.anonymous) {
            this.te.disable();
        }

        var pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::mute";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            this.gp.toolbars[0].items.items[4].toggle(true, true);
            this.gp.toolbars[0].items.items[4].setText("Sounds Muted");
            this.gp.soundOn = false;
        }

        pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::nwsbothidden";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            this.gp.toolbars[0].items.items[3].toggle(true, true);
            this.gp.toolbars[0].items.items[3].setText("NWSBot Hidden");
            this.gp.store.filterBy(nwsbotFilter);
        }

        
    }
});

Ext.reg('mucchatpanel', Application.MUCChatPanel);