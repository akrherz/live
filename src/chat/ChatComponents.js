/**
 * Chat UI Components
 * ExtJS panels and components for chat functionality
 */

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
                    if (self.iconCls && self.ownerCt && self.ownerCt.getActiveTab) {
                        var tab = self.ownerCt.getTabEl(self);
                        if (tab) {
                            self.ownerCt.unhideTabStripItem(self);
                            self.setIconClass('tabno');
                        }
                    }
                },
                deactivate : function(self) {
                    if (self.iconCls && self.ownerCt && self.ownerCt.getActiveTab) {
                        var tab = self.ownerCt.getTabEl(self);
                        if (tab) {
                            self.setIconClass('tabno');
                        }
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

        pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::iembothidden";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            this.gp.toolbars[0].items.items[3].toggle(true, true);
            this.gp.toolbars[0].items.items[3].setText("IEMBot Hidden");
            this.gp.store.filterBy(iembotFilter);
        }

        
    }
});

Ext.reg('mucchatpanel', Application.MUCChatPanel);

Application.ChatPanel = Ext.extend(Ext.Panel, {
    hideMode : 'offsets',
    closable : true,
    layout : 'border',
    iconCls : 'tabno',
    chatType : 'chat',
    barejid : null,
    handle : null,
    anonymous : null,
    
    initComponent : function() {
        this.items = [
                new Application.ChatGridPanel({
                    region : 'center'
                }),
                new Application.ChatTextEntry({
                    region : 'south',
                    height : 50,
                    split : true
                })
            ];
        var config = {
            listeners : {
                activate : function(self) {
                    self.setIconCls('tabno');
                },
                deactivate : function(self) {
                    self.setIconCls('tabno');
                },
                beforedestroy : function(self){
                    if (self.te.chatstate){
                        self.te.chatstate.cancel();
                    }
                    Application.XMPPConn.send($msg({
                        to : self.barejid,
                        type : self.chatType
                    }).c("gone", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                }
                
            }
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.ChatPanel.superclass.initComponent.apply(this,
                        arguments);
        this.buildItems();
    },
    getJidByHandle : function(handle){
        return this.barejid;
    },
    buildItems : function() {
        this.gp = this.items.items[0];
        this.te = this.items.items[1];
        /* Remove iembot muter */
        this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
        /* Remove sound muter */
        this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
    }
});

Ext.reg('chatpanel', Application.ChatPanel);

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
                    var sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                },
                remove : function(tree, node) {
                    var sz = node.childNodes.length;
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
                    var username = Strophe.getNodeFromJid(n.attributes.jid);
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
                    var cp = Ext.getCmp("chatpanel").getChat( jid );
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

Application.colors = ['000000', //black
'666666', // 
'D51460', // 
'FF0000', // 
'993333', //  
'FF9900', // 
'005500', //
'009900', // 
'00DD00', // 
'0066CC', //
'3399FF', // 
'0000FF', // 
'6666FF' // 
];
Application.colorpointer = 0;

Application.UserColorStore = new Ext.data.Store({
    fields : ['user', 'color']
});

Application.getUserColor = function(user) {
    var idx = Application.UserColorStore.find('user', user);
    if (idx == -1){
        var c = Application.colors[ Application.colorpointer ];
        Application.UserColorStore.add(new Ext.data.Record({user: user, color: c}));
        Application.colorpointer++;
        if (Application.colorpointer > 12){
            Application.colorpointer = 0;
        }
    } else {
        var c = Application.UserColorStore.getAt(idx).get("color");
    }
    return c;
};

Application.ChatTextEntry = Ext.extend(Ext.Panel, {
            layout : 'hbox',
            layoutConfig : {
                align : "stretch"
            },
            border : false,
            chatstate : null,
            initComponent : function() {
                
                this.items = [{
                    xtype : 'textarea',
                    flex : 1,
                    cls : 'message-entry-box',                
                    autoCreate : {
                        tag : 'textarea',
                        style : 'rows:10;cols:72;wrap:"hard";',
                        autocomplete : 'off'
                    },
                    style : {
                        background : '#'
                                + Application.getPreference('bgcolor', 'FFFFFF'),
                        color : '#'
                                + Application.getPreference('fgcolor', '000000')
                    },
                    enableKeyEvents : true,
                    listeners : {
                        keyup : function(elTxt, e) {
                            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                            // e.TAB, e.ESC, arrow keys: e.LEFT,
                            // e.RIGHT, e.UP,
                            // e.DOWN
                            if (e.getKey() === e.ENTER && !e.shiftKey) {
                                if (this.chatstate){
                                    this.chatstate.cancel();
                                }
                                this.chatstate = null;
                                this.ownerCt.getComponent(1).handler();
                                return true;
                            }
                            /* Chat States! */
                            if (this.ownerCt.ownerCt.chatType == 'chat') {
                                if (!this.chatstate){
                                    this.chatstate = new Ext.util.DelayedTask(function(){
                                        if (!this.ownerCt || !this.ownerCt.ownerCt){
                                            return;
                                        }
                                        Application.XMPPConn.send($msg({
                                            to : this.ownerCt.ownerCt.barejid,
                                            type : this.ownerCt.ownerCt.chatType
                                        }).c("paused", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                                        this.chatstate = null;
                                    }, this);
                                    Application.XMPPConn.send($msg({
                                        to : this.ownerCt.ownerCt.barejid,
                                        type : this.ownerCt.ownerCt.chatType
                                    }).c("composing", {xmlns : 'http://jabber.org/protocol/chatstates'}));
                                }
                                /* Wait 5 seconds before pausing */
                                this.chatstate.delay(5000);
                            }
                        },
                        render : {
                            delay : 500,
                            fn : function() {
                                this.focus();
                            }
                        }
                    }
                }, {
                    xtype : 'button',
                    text : 'Send',
                    width : 60,
                    popup : null,
                    handler : function() {
                        var txt = this.ownerCt.getComponent(0);
                        var text = txt.getValue().trim();
                        if (text.length === 0) {
                            txt.focus();
                            return false;
                        }
                        var bgcolor = Application.getPreference('bgcolor', 'FFFFFF');
                        var fgcolor = Application.getPreference('fgcolor', '000000');
                        
                        /* allchat */
                        if (this.ownerCt.ownerCt.chatType == "allchats"){
                            txt.emptyText = '';
                            txt.setValue('');
                            (new Application.AllChatMessageWindow({
                                message: Application.replaceURLWithHTMLLinks(text)
                            })).show();
                        } else {
                        var nodes = $.parseHTML(Application.replaceURLWithHTMLLinks(text));
                        var msg = $msg({
                            to : this.ownerCt.ownerCt.barejid,
                            type : this.ownerCt.ownerCt.chatType
                        }).c("active", {xmlns : 'http://jabber.org/protocol/chatstates'}).up()
                        .c("body").t(text).up().c("html", {
                            xmlns : 'http://jabber.org/protocol/xhtml-im'
                        }).c("body", {
                            xmlns : 'http://www.w3.org/1999/xhtml'
                        }).c("p").c("span", {
                    style : "color:#" + fgcolor + ";background:#"
                            + bgcolor + ";"
                        });
                        for (var i=0;i<nodes.length;i++){
                            msg = msg.cnode(nodes[i]);
                            if (i < nodes.length){
                              msg = msg.up();
                            }
                        }
                        Application.XMPPConn.send(msg);
                        txt.setValue("");
                        txt.focus();

                        // Since we don't get our messages back via XMPP
                        // we need to manually add to the store
                        if (this.ownerCt.ownerCt.chatType == 'chat') {
                            text = "<span "+ "style='color:#" + fgcolor + ";background:#" + bgcolor + ";'>"+ text +"</span>";
                            this.ownerCt.ownerCt.gp.getStore().addSorted(new Ext.data.Record({
                                                ts : (new Date()),
                                                author : Application.USERNAME,
                                                message :Application.replaceURLWithHTMLLinks(text)
                                            }));
                            //i = this.ownerCt.ownerCt.gp.getStore().getCount()
                            //        - 1;
                            //this.ownerCt.ownerCt.gp.getView().getRow(i).scrollIntoView();
                        }
                        }

                    }
                }];
                Application.ChatTextEntry.superclass.initComponent.apply(this,
                        arguments);

            }
        });

Ext.reg('chattextentry', Application.ChatTextEntry);


Application.msgFormatter = new Ext.XTemplate(
        '<p class="mymessage">',
        '<span ',
        '<tpl if="values.me == values.author">', 'class="author-me"', "</tpl>",
        '<tpl if="values.me != values.author">', 
          'class="{[this.getAuthorClass(values.jid)]}" style="color: #{[Application.getUserColor(values.author)]};"',
        '</tpl>',
          '>(', '<tpl if="this.isNotToday(ts)">', '{ts:date("d M")} ', '</tpl>',
        '{ts:date("g:i A")}) ', 
        '<tpl if="values.room != null">', 
          '[{room}] ',
        '</tpl>',
        '{author}:</span> ', '{message}</p>', {
            isNotToday : function(ts) {
                return (new Date()).format('md') != ts.format('md');
            },
            getAuthorClass : function(jid) {
                //console.log("node: "+Strophe.getNodeFromJid(jid) );
                if (jid == null) return "author-default";
                if (Strophe.getNodeFromJid(jid) == 'iembot'){
                    return "author-iembot";
                }
                if (Strophe.getNodeFromJid(jid).match(/^nws/)){
                    return "author-nws";
                }

                return "author-chatpartner";
            }
        });

Application.ChatGridPanel = Ext.extend(Ext.grid.GridPanel, {
    region : 'center',
    soundOn : true,
    iembotHide: false,
    stripeRows : true,
    autoExpandColumn : 'message',
    autoScroll : true,

    tbar : [{
                text : 'Clear Room Log',
                cls : 'x-btn-text-icon',
                icon : 'icons/close.png',
                handler : function(btn) {
                    btn.ownerCt.ownerCt.getStore().removeAll();
                }
            }, {
                text : 'Print Log',
                icon : 'icons/print.png',
                cls : 'x-btn-text-icon',
                handler : function(btn) {
                    btn.ownerCt.ownerCt.getGridEl().print({
                                isGrid : true
                            });
                }
            }, {
                text : 'View As HTML',
                handler : function(btn) {
                    showHtmlVersion(btn.ownerCt.ownerCt);
                },
                icon : 'icons/text.png',
                cls : 'x-btn-text-icon'
            }, {
                text : 'Hide IEMBot',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    const pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                    +"::iembothidden";
                    const store = btn.ownerCt.ownerCt.getStore();
                    btn.ownerCt.ownerCt.iembotHide = toggled;
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        store.filterBy(iembotFilter);
                        btn.setText("IEMBot Hidden");
                    } else {
                        Application.removePreference(pref);
                        store.clearFilter(false);
                        btn.setText("Hide IEMBot");
                    }
                }
            }, {
                text : 'Mute Sounds',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    //var store = btn.ownerCt.ownerCt.getStore();
                    const pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                                +"::mute";
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        btn.ownerCt.ownerCt.soundOn = false;
                        btn.setText("Sounds Muted");
                    } else {
                        Application.removePreference(pref);
                        btn.ownerCt.ownerCt.soundOn = true;
                        btn.setText("Mute Sounds");
                    }
                }
            },{
                icon : 'icons/font-less.png',
                handler : function(){
                    const size = parseInt(Application.getPreference('font-size', 14)) - 2;
                    Application.setPreference('font-size', size);
                    //var cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
                    var cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }, {
                icon : 'icons/font-more.png',
                handler : function(){
                    const size = parseInt(Application.getPreference('font-size', 14)) + 2;
                    Application.setPreference('font-size', size);
                    var cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }],
    initComponent : function() {
        this.columns = [{
                    header : 'Author',
                    sortable : true,
                    dataIndex : 'author',
                    hidden : true
                }, {
                    id : 'message',
                    header : 'Message',
                    sortable : true,
                    dataIndex : 'ts',
                    scope : this,
                    renderer : function(_value, _p, record) {
                        return Application.msgFormatter.apply({
                            author: record.get('author'),
                            message: record.get('message'),
                            ts: record.get('ts'),
                            room: record.get('room'),
                            jid: record.get('jid'),
                            me: this.ownerCt.handle});
                    }
                }];
        this.store = new Ext.data.ArrayStore({
                    sortInfo : {
                        field : 'ts',
                        direction : 'ASC'
                    },
                    fields : [{
                                name : 'ts',
                                type : 'date'
                            }, 'author', 'message', 'product_id', 'jid', 'room',
                            {
                                name : 'xdelay',
                                type : 'boolean'
                            }]
                });
        this.store.on('add', function(_store, records, _index) {
            if (!this.soundOn){
                return true;
            }
            let nonIEMBot = false;
            let nothingNew = true;
            for (var i = 0; i < records.length; i++) {
                /* No events for delayed messages */
                if (records[i].get('xdelay')){
                    continue;
                }
                /* No events if I talked! */
                if (records[i].get('author') == this.ownerCt.handle){
                    continue;
                }
                if (records[i].get("author") != "iembot") {
                    nonIEMBot = true;
                }
                if (records[i].get("message").match(/tornado/i)){
                    Application.MsgBus.fireEvent("soundevent", "tornado");
                }
                // TODO: figure out how to make this case insensitive
                if (records[i].get("message").match(this.ownerCt.handle)){
                    Application.MsgBus.fireEvent("soundevent", "myhandle");
                }
                nothingNew = false;
            }//end of for()
            if (nothingNew){
                return true;
            }
            if (nonIEMBot) {
                // Make this tab show the new icon for the new message
                this.ownerCt.setIconCls('new-tab');
                Application.MsgBus.fireEvent("soundevent", "new_message");
            } else {
                // If iembot is muted, lets stop the events
                if (! this.iembotHide){
                    this.ownerCt.setIconCls('new-tab');
                    Application.MsgBus.fireEvent("soundevent", "iembot");
                }
            }
        }, this);
        var config = {
            viewConfig : {
                onAdd : function(_ds, _records, index) {
                    this.constructor.prototype.onAdd.apply(this, arguments);
                    //this.grid.getSelectionModel().selectRow(index);
                    //this.focusRow(index);
                    
                    var row = this.grid.getView().getRow(index);
                    if (row) row.scrollIntoView();
                },
                templates : {
                    cell : new Ext.Template(
                            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}"  tabIndex="0" {cellAttr}>',
                            '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                            '</td>')
                }
            },

            sm : new Ext.grid.RowSelectionModel({
                        listeners : {
                            rowselect : function(sm, rowIdx, r) {
                                if (r.data.product_id) {
                                    Application.TextWindow.show();
                                    Application.TextWindow.load({
                                                params : {
                                                    pid : r.data.product_id,
                                                    bypass : 1
                                                },
                                                text : 'Loading...',
                                                method : 'GET',
                                                url : '../p.php'
                                            });
                                }
                            }
                        }
                    }),
            listeners : {
                render : function(p) {
                    p.getView().mainBody.on('mousedown', function(e, t) {
                                //console.log("Daryl1:"+ t.tagName);
                                if (t.tagName == 'A') {
                                    e.stopEvent();
                                    t.target = '_blank';
                                }
                            });
                    p.body.on({
                                'mousedown' : function(e, t) { // try to
                                    // intercept the
                                    // easy
                                    // way
                                    //console.log("Daryl2:"+ t.tagName);
                                    t.target = '_blank';
                                    Application.TextWindow.hide();
                                },
                                'click' : function(e, t) { // if they tab +
                                    // enter a link,
                                    // need to do it old fashioned
                                    // way
                                    //console.log("Daryl3:"+ t.tagName);
                                    if (String(t.target).toLowerCase() != '_blank') {
                                        e.stopEvent();
                                        window.open(t.href);
                                    }
                                    Application.TextWindow.hide();
                                },
                                delegate : 'a'
                            });

                }
            }
        };
        Ext.apply(this, config);

        Application.ChatGridPanel.superclass.initComponent.apply(this,
                arguments);

        /*
         * this.view = new Ext.grid.GridView({ cellTpl: new Ext.Template( '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div
         * class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"
         * {attr}>{value}</div>', '</td>' ) });
         */
    }
});

Ext.reg('chatgridpanel', Application.ChatGridPanel);/**
 * @class Ext.ux.DataTip
 * @extends Ext.ToolTip.
 * <p>This plugin implements automatic tooltip generation for an arbitrary number of child nodes <i>within</i> a Component.</p>
 * <p>This plugin is applied to a high level Component, which contains repeating elements, and depending on the host Component type,
 * it automatically selects a {@link Ext.ToolTip#delegate delegate} so that it appears when the mouse enters a sub-element.</p>
 * <p>When applied to a GridPanel, this ToolTip appears when over a row, and the Record's data is applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a DataView, this ToolTip appears when over a view node, and the Record's data is applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a TreePanel, this ToolTip appears when over a tree node, and the Node's {@link Ext.tree.TreeNode#attributes attributes} are applied
 * using this object's {@link Ext.Component#tpl tpl} template.</p>
 * <p>When applied to a FormPanel, this ToolTip appears when over a Field, and the Field's <code>tooltip</code> property is used is applied
 * using this object's {@link Ext.Component#tpl tpl} template, or if it is a string, used as HTML content.</p>
 * <p>If more complex logic is needed to determine content, then the {@link Ext.Component#beforeshow beforeshow} event may be used.<p>
 * <p>This class also publishes a <b><code>beforeshowtip</code></b> event through its host Component. The <i>host Component</i> fires the
 * <b><code>beforeshowtip</code></b> event.
 */
Ext.ux.DataTip = Ext.extend(Ext.ToolTip, (function() {

//  Target the body (if the host is a Panel), or, if there is no body, the main Element.
    function onHostRender() {
        var e = this.body || this.el;
        if (this.dataTip.renderToTarget) {
            this.dataTip.render(e);
        }
        this.dataTip.initTarget(e);
    }

    function updateTip(tip, data) {
        if (tip.rendered) {
            tip.update(data);
        } else {
            if (Ext.isString(data)) {
                tip.html = data;
            } else {
                tip.data = data;
            }
        }
    }
    
    function beforeTreeTipShow(tip) {
        var e = Ext.fly(tip.triggerElement).findParent('div.x-tree-node-el', null, true),
            node = e ? tip.host.getNodeById(e.getAttribute('tree-node-id', 'ext')) : null;
        if(node){
            updateTip(tip, node.attributes);
        } else {
            return false;
        }
    }

    function beforeGridTipShow(tip) {
        var rec = this.host.getStore().getAt(this.host.getView().findRowIndex(tip.triggerElement));
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    function beforeViewTipShow(tip) {
        var rec = this.host.getRecord(tip.triggerElement);
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    function beforeFormTipShow(tip) {
        var el = Ext.fly(tip.triggerElement).child('input,textarea'),
            field = el ? this.host.getForm().findField(el.id) : null;
        if (field && (field.tooltip || tip.tpl)){
            updateTip(tip, field.tooltip || field);
        } else {
            return false;
        }
    }

    function beforeComboTipShow(tip) {
        var rec = this.host.store.getAt(this.host.selectedIndex);
        if (rec){
            updateTip(tip, rec.data);
        } else {
            return false;
        }
    }

    return {
        init: function(host) {
            host.dataTip = this;
            this.host = host;
            if (host instanceof Ext.tree.TreePanel) {
                this.delegate = this.delegate || 'div.x-tree-node-el';
                this.on('beforeshow', beforeTreeTipShow);
            } else if (host instanceof Ext.grid.GridPanel) {
                this.delegate = this.delegate || host.getView().rowSelector;
                this.on('beforeshow', beforeGridTipShow);
            } else if (host instanceof Ext.DataView) {
                this.delegate = this.delegate || host.itemSelector;
                this.on('beforeshow', beforeViewTipShow);
            } else if (host instanceof Ext.FormPanel) {
                this.delegate = 'div.x-form-item';
                this.on('beforeshow', beforeFormTipShow);
            } else if (host instanceof Ext.form.ComboBox) {
                this.delegate = this.delegate || host.itemSelector;
                this.on('beforeshow', beforeComboTipShow);
            }
            if (host.rendered) {
                onHostRender.call(host);
            } else {
                host.onRender = host.onRender.createSequence(onHostRender);
            }
        }
    };
})());Ext.ns('Application');
/*
 * Handles all of the ROSTER related activities
 */

/*
 * Handle presence from a buddy. This gets into complicated UI land, but we'll
 * try to handle it all
 */
function onBuddyPresence(msg) {

    // Okay, we know who we got the presence from
    var jid = msg.getAttribute('from');
    var barejid = Strophe.getBareJidFromJid(jid);
    var resource = Strophe.getResourceFromJid(jid);
    var username = Strophe.getNodeFromJid(jid);
    var status = 'Available';
    /* IMPORTANT: If we find our own username, then we need to set a global 
     * flag to prevent auto-login from working
     */
    if (username == Application.USERNAME && 
        resource != Application.XMPPRESOURCE && 
        resource.match(/^WeatherIM/)){
        if (msg.getAttribute('type') == 'unavailable'){
            Application.log("Self presence: ["+ username +"] ["+ resource +"] unavailable");            
        } else {
            Application.log("Self presence: ["+ username +"] ["+ resource +"] available");
        }
    }
    /* Check for status */
    if ($(msg).find('status').length > 0) {
        status = $(msg).find('status').text();
    }
    /* Check for subscription request */
    if (msg.getAttribute('type') == 'subscribe'){
        Ext.Msg.show({
            
               title:'New Buddy Request',
               msg: 'User '+ username +' wishes to add you as a buddy. Is this okay?',
               buttons: Ext.Msg.YESNO,
               fn: function(btn){
                 if (btn == 'yes'){
                     /* <presence to='fire-daryl.e.herzmann@localhost' type='subscribed'/> */
                     var stanza = $pres({to: jid, type: 'subscribed'});
                     Application.XMPPConn.send(stanza.tree());
                     Application.buildAddBuddy(username, username ,'Buddies');
                 }  else {
                     var stanza = $pres({to: jid, type: 'unsubscribed'});
                     Application.XMPPConn.send(stanza.tree()); 
                 }
               },
               icon: Ext.MessageBox.QUESTION
            });
        
        return;
    }

    // Go look for our barejid
    Ext.getCmp("buddies").root.eachChild(function(node) {
        node.eachChild(function(leaf){
            //console.log("Looking for:"+ barejid +", this node:"+ 
            //    leaf.attributes.jid);
                if (leaf.attributes.barejid == barejid) {
                    var res = leaf.attributes.resources.get(resource);
                    if (!res){
                        //console.log("Adding:"+ resource +" Status:"+ status);
                        leaf.attributes.resources.add(resource, {
                            status : status,
                            resource : resource
                        });
                    }
                    if (!msg.getAttribute('type')) {
                        if ($(msg).find('show').length > 0) {
                            leaf.setIconCls('buddy-away');
                        } else {
                            leaf.setIconCls('buddy-online');
                        }
                        leaf.attributes.presence = 'online';
                        leaf.ui.show();
                        //console.log("Replace"+ resource +" Status:"+ status);
                        leaf.attributes.resources.replace(resource, {
                            status : status,
                            resource : resource
                        });
                    } else if (msg.getAttribute('type') == 'unavailable'){
                        if (leaf.attributes.resources.length == 1){
                            leaf.attributes.presence = 'offline';
                            leaf.setIconCls('buddy-offline');
                            leaf.ui.hide();
                        }
                        leaf.attributes.resources.remove(resource);
                    }
                }
            });
    });

}

// Expose onBuddyPresence globally for XMPP handlers
window.onBuddyPresence = onBuddyPresence;

Ext.namespace('Ext.ux.panel');

/**
 * @class Ext.ux.panel.DDTabPanel
 * @extends Ext.TabPanel
 * @author
 *    Original by
 *        <a href="http://extjs.com/forum/member.php?u=22731">thommy</a> and
 *        <a href="http://extjs.com/forum/member.php?u=37284">rizjoj</a><br />
 *    Published and polished by: Mattias Buelens (<a href="http://extjs.com/forum/member.php?u=41421">Matti</a>)<br />
 *    With help from: <a href="http://extjs.com/forum/member.php?u=1459">mystix</a>
 *    Polished and debugged by: Tobias Uhlig (info@internetsachen.com) 04-25-2009
 *    Ported to Ext-3.1.1 by: Tobias Uhlig (info@internetsachen.com) 02-14-2010
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>. Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @version 2.0.0 (Feb 14, 2010)
 */
Ext.ux.panel.DDTabPanel = Ext.extend(Ext.TabPanel, {
    /**
    * @cfg {Number} arrowOffsetX The horizontal offset for the drop arrow indicator, in pixels (defaults to -9).
    */
    arrowOffsetX: -9,
    /**
    * @cfg {Number} arrowOffsetY The vertical offset for the drop arrow indicator, in pixels (defaults to -8).
    */
    arrowOffsetY: -8,

    // Assign the drag and drop group id
    /** @private */
    initComponent: function() {
        Ext.ux.panel.DDTabPanel.superclass.initComponent.call(this);
        this.addEvents('reorder');
        if (!this.ddGroupId) this.ddGroupId = 'dd-tabpanel-group-' + Ext.ux.panel.DDTabPanel.superclass.getId.call(this);
    },
    
    // New Event fired after drop tab
    reorder:function(tab){
        this.fireEvent('reorder', this, tab);
    },

    // Declare the tab panel as a drop target
    /** @private */
    afterRender: function() {
        Ext.ux.panel.DDTabPanel.superclass.afterRender.call(this);
        // Create a drop arrow indicator
        this.arrow = Ext.DomHelper.append(
            Ext.getBody(),
            '<div class="dd-arrow-down"></div>',
            true
        );
        this.arrow.hide();
        // Create a drop target for this tab panel
        var tabsDDGroup = this.ddGroupId;
        this.dd = new Ext.ux.panel.DDTabPanel.DropTarget(this, {
            ddGroup: tabsDDGroup
        });

        // needed for the onRemove-Listener
        this.move = false;
    },

    // Init the drag source after (!) rendering the tab
    /** @private */
    initTab: function(tab, index) {
        Ext.ux.panel.DDTabPanel.superclass.initTab.call(this, tab, index);

        var id = this.id + '__' + tab.id;
        // Hotfix 3.2.0
        Ext.fly(id).on('click', function() { tab.ownerCt.setActiveTab(tab.id); });
        // Enable dragging on all tabs by default
        Ext.applyIf(tab, { allowDrag: true });

        // Extend the tab
        Ext.apply(tab, {
            // Make this tab a drag source
            ds: new Ext.dd.DragSource(id, {
                ddGroup: this.ddGroupId
                , dropEl: tab
                , dropElHeader: Ext.get(id, true)
                , scroll: false

                // Update the drag proxy ghost element
                , onStartDrag: function() {
                    if (this.dropEl.iconCls) {

                        var el = this.getProxy().getGhost().select(".x-tab-strip-text");
                        el.addClass('x-panel-inline-icon');

                        var proxyText = el.elements[0].innerHTML;
                        proxyText = Ext.util.Format.stripTags(proxyText);
                        el.elements[0].innerHTML = proxyText;

                        el.applyStyles({
                            paddingLeft: "20px"
                        });
                    }
                }

                // Activate this tab on mouse up
                // (Fixes bug which prevents a tab from being activated by clicking it)
                , onMouseUp: function(event) {
                    if (this.dropEl.ownerCt.move) {
                        if (!this.dropEl.disabled && this.dropEl.ownerCt.activeTab == null) {
                            this.dropEl.ownerCt.setActiveTab(this.dropEl);
                        }
                        this.dropEl.ownerCt.move = false;
                        return;
                    }
                    if (!this.dropEl.isVisible() && !this.dropEl.disabled) {
                        this.dropEl.show();
                    }
                }
            })
            // Method to enable dragging
            , enableTabDrag: function() {
                this.allowDrag = true;
                return this.ds.unlock();
            }
            // Method to disable dragging
            , disableTabDrag: function() {
                this.allowDrag = false;
                return this.ds.lock();
            }
        });

        // Initial dragging state
        if (tab.allowDrag) {
            tab.enableTabDrag();
        } else {
            tab.disableTabDrag();
        }
    }

    /** @private */
    , onRemove: function(c) {
        var te = Ext.get(c.tabEl);
        // check if the tabEl exists, it won't if the tab isn't rendered
        if (te) {
            // DragSource cleanup on removed tabs
            //Ext.destroy(c.ds.proxy, c.ds);
            te.select('a').removeAllListeners();
            Ext.destroy(te);
        }

        // ignore the remove-function of the TabPanel
        Ext.TabPanel.superclass.onRemove.call(this, c);

        this.stack.remove(c);
        delete c.tabEl;
        c.un('disable', this.onItemDisabled, this);
        c.un('enable', this.onItemEnabled, this);
        c.un('titlechange', this.onItemTitleChanged, this);
        c.un('iconchange', this.onItemIconChanged, this);
        c.un('beforeshow', this.onBeforeShowItem, this);

        // if this.move, the active tab stays the active one
        if (c == this.activeTab) {
            if (!this.move) {
                var next = this.stack.next();
                if (next) {
                    this.setActiveTab(next);
                } else if (this.items.getCount() > 0) {
                    this.setActiveTab(0);
                } else {
                    this.activeTab = null;
                }
            }
            else {
                this.activeTab = null;
            }
        }
        if (!this.destroying) {
            this.delegateUpdates();
        }
    }


    // DropTarget and arrow cleanup
    /** @private */
    , onDestroy: function() {
        Ext.destroy(this.dd, this.arrow);
        Ext.ux.panel.DDTabPanel.superclass.onDestroy.call(this);
    }
});

// Ext.ux.panel.DDTabPanel.DropTarget
// Implements the drop behavior of the tab panel
/** @private */
Ext.ux.panel.DDTabPanel.DropTarget = Ext.extend(Ext.dd.DropTarget, {
    constructor: function(tabpanel, config){
        this.tabpanel = tabpanel;
        // The drop target is the tab strip wrap
        Ext.ux.panel.DDTabPanel.DropTarget.superclass.constructor.call(this, tabpanel.stripWrap, config);
    }

    ,notifyOver: function(dd, e, data){
        var tabs = this.tabpanel.items;
        var last = tabs.length;

        if(!e.within(this.getEl()) || dd.dropEl == this.tabpanel){
            return 'x-dd-drop-nodrop';
        }

        var larrow = this.tabpanel.arrow;

        // Getting the absolute Y coordinate of the tabpanel
        var tabPanelTop = this.el.getY();

        var left, prevTab, tab;
        var eventPosX = e.getPageX();

        for(var i = 0; i < last; i++){
            prevTab = tab;
            tab    = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            var tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            var tabLeft = tabEl.getX();
            // Get the middle of the tab
            var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;

            if(eventPosX <= tabMiddle){
                left = tabLeft;
                break;
            }
        }
        
        if(typeof left == 'undefined'){
            var lastTab = tabs.itemAt(last - 1);
            if(lastTab == dd.dropEl)return 'x-dd-drop-nodrop';
            var dom = lastTab.ds.dropElHeader.dom;
            left = (new Ext.Element(dom).getX() + dom.clientWidth) + 3;
        }
        
        else if(tab == dd.dropEl || prevTab == dd.dropEl){
            this.tabpanel.arrow.hide();
            return 'x-dd-drop-nodrop';
        }

        larrow.setTop(tabPanelTop + this.tabpanel.arrowOffsetY).setLeft(left + this.tabpanel.arrowOffsetX).show();

        return 'x-dd-drop-ok';
    }

    ,notifyDrop: function(dd, e, data){
        this.tabpanel.arrow.hide();
        
        // no parent into child
        if(dd.dropEl == this.tabpanel){
            return false;
        }
        var tabs      = this.tabpanel.items;
        var eventPosX = e.getPageX();

        for(var i = 0; i < tabs.length; i++){
            var tab = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            var tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            var tabLeft = tabEl.getX();
            // Get the middle of the tab
            var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;
            if(eventPosX <= tabMiddle) break;
        }

        // do not insert at the same location
        if(tab == dd.dropEl || tabs.itemAt(i-1) == dd.dropEl){
            return false;
        }
        
    dd.proxy.hide();

        // if tab stays in the same tabPanel
        if(dd.dropEl.ownerCt == this.tabpanel){
            if(i > tabs.indexOf(dd.dropEl))i--;
        }

        this.tabpanel.move = true;
        var dropEl = dd.dropEl.ownerCt.remove(dd.dropEl, false);
        
        this.tabpanel.insert(i, dropEl);
        // Event drop
        this.tabpanel.fireEvent('drop', this.tabpanel);
        // Fire event reorder
        this.tabpanel.reorder(tabs.itemAt(i));
        
        return true;
    }

    ,notifyOut: function(dd, e, data){
        this.tabpanel.arrow.hide();
    }
});

Ext.reg('ddtabpanel', Ext.ux.panel.DDTabPanel);


Application.ChatTabPanel = Ext.extend(Ext.ux.panel.DDTabPanel, {
    activeTab : 0,
    deferredRender : false,
    split : true,
        enableTabScroll: true,
    initComponent : function() {
        var config = {

        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.ChatTabPanel.superclass.initComponent.apply(this,
                arguments);
        this.buildItems();
    },
    buildItems : function() {
        this.add({
            contentEl : 'help',
            title : 'Help',
            preventBodyReset : true,
            style : {
                margin : '5px'
            },
            autoScroll : true
        });
        this.add(new Application.MUCChatPanel({
            title : 'All Chats',
            closable : false,
            chatType : 'allchats',
            barejid : '__allchats__@'+ Application.XMPPMUCHOST,
            id : '__allchats__'
        }));
    },
    addMUC : function(barejid, handle, anonymous){
        var mcp = new Application.MUCChatPanel({
            title : Strophe.getNodeFromJid(barejid),
            barejid : barejid,
            handle : handle,
            anonymous : anonymous
        });
        return this.add(mcp);
    },
    getMUC : function(barejid){
        return this.find('barejid', barejid)[0];
    },
    removeMUC : function(barejid){
        this.remove( this.getMUC(barejid) );
    },
    addChat : function(jid){
        var title = Strophe.getNodeFromJid(jid);
        if (Strophe.getDomainFromJid(jid) == Application.XMPPMUCHOST){
            title = Strophe.getResourceFromJid(jid);
        }
        var cp = new Application.ChatPanel({
            title : title,
            handle : Application.USERNAME,
            barejid : jid
        });
        return this.add(cp);
    },
    getChat : function(jid){
        return this.find('barejid', jid)[0];
    },
    removeChat : function(jid){
        this.remove( this.getChat(jid) );
    }
});

