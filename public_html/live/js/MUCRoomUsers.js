Ext.ns("Application");

Application.MUCRoomUsers = Ext.extend(Ext.tree.TreePanel, {
    bodyStyle : {'margin-left': '-15px'},
    title : '0 people in room',
    rootVisible : false,
    lines : false,
    autoScroll : true, 
    initComponent : function() {
        this.root = {
            text : 'test',
            listeners : {
                append : function(tree, node) {
                    sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                },
                remove : function(tree, node) {
                    sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                }
            }
        };
        var config = {
            plugins: new Ext.ux.DataTip({
                tpl: '<div>JID: {jid}<br />Affiliation: {affiliation}<br />Role: {role}</div>',
                constrainPosition: true
            }),
            listeners : {
                click : function(n) {
                    if (!n.attributes.jid)
                        return;
                    username = Strophe.getNodeFromJid(n.attributes.jid);
                    /* Can't speak with ourself */
                    if (username == Application.USERNAME) {
                        return;
                    }
                    /* Now, we either talk with private or private via MUC */
                    var jid = n.attributes.jid;
                    if (Strophe.getDomainFromJid(n.attributes.jid) == Application.XMPPHOST) {
                        jid = Strophe.getBareJidFromJid(n.attributes.jid);
                    } 
                    Application.log("Wish to start chat with:"+ jid);
                    cp = Ext.getCmp("chatpanel").getChat( jid );
                    if (! cp){
                        cp = Ext.getCmp("chatpanel").addChat( jid );
                    }
                    Ext.getCmp("chatpanel").setActiveTab(cp);
                }
            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MUCRoomUsers.superclass.initComponent.apply(this,
                        arguments);
        this.buildItems();
    },
    buildItems : function() {}
});

Ext.reg('mucroomusers', Application.MUCRoomUsers);