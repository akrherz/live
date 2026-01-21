import { msgBus } from "../events/MsgBus.js";
import { $msg, $pres, Strophe } from "strophe.js";
import { loadTextProductInWindow, hideTextWindow } from "../ui/text-window.js";
import { iembotFilter, showHtmlVersion } from "../utils/grid-utilities.js";
import { LiveConfig } from "../config.js";

const MUCChatPanel = Ext.extend(Ext.Panel, {
    hideMode: "offsets",
    closable: true,
    layout: "border",
    chatType: "groupchat",
    barejid: null,
    handle: null,
    anonymous: null,
    joinedChat: false /* Was I successful at getting logged into room */,

    initComponent: function () {
        // Create the child components with references immediately
        const gridPanel = Ext.create("Application.ChatGridPanel", {
            region: "center",
        });
        const textEntry = Ext.create("Application.ChatTextEntry", {
            region: "south",
            height: 50,
            split: true,
        });

        // Store references immediately so they're available for message handling
        this.gp = gridPanel;
        this.te = textEntry;

        this.items = [gridPanel, textEntry];

        if (this.initialConfig.chatType !== "allchats") {
            const roomUsers = new MUCRoomUsers({
                region: "east",
                width: 175,
                collapsible: true,
                split: true,
            });
            this.roomusers = roomUsers;
            this.items.push(roomUsers);
            this.iconCls = "tabno";
        } else {
            this.items[1].emptyText = "Type message here";
        }
        const iconfig = {
            listeners: {
                activate: function (self) {
                    // In ExtJS 6, just update the icon class when tab becomes active
                    if (self.iconCls) {
                        self.setIconCls("tabno");
                    }
                },
                deactivate: function () {
                    // Icon class can be updated on deactivate if needed
                    // Currently no action needed
                },
            },
        };
        Ext.apply(this, Ext.apply(this.initialConfig, iconfig));

        MUCChatPanel.superclass.initComponent.apply(
            this,
            arguments,
        );
        this.buildItems();
    },
    clearRoom: function () {
        this.gp.getStore().removeAll();
        this.roomusers.getRootNode().removeAll();
    },
    getJidByHandle: function (handle) {
        const node = this.roomusers.getRootNode().findChild("text", handle);
        if (node === null) {
            return null;
        }
        if (
            Strophe.getDomainFromJid(node.data.jid) === LiveConfig.XMPPMUCHOST
        ) {
            return null;
        }
        return node.data.jid;
    },
    buildItems: function () {
        // References are already set in initComponent, now just configure them
        if (this.chatType === "allchats") {
            //this.gp.toolbars[0].items.items[4].setText("Sounds Off");
            const toolbar = this.gp.down("toolbar");
            if (toolbar && toolbar.items && toolbar.items.items[4]) {
                toolbar.items.items[4].disable();
            }
            this.gp.soundOn = false;
            if (this.te.items && this.te.items.items[1]) {
                this.te.items.items[1].setText("To Room?");
            }
            return;
        }

        if (this.roomusers) {
            // In ExtJS 6, configure sorting on the tree's store instead of using TreeSorter
            const store = this.roomusers.getStore();
            if (store) {
                store.sort({
                    property: "text",
                    direction: "ASC",
                });
            }
        }

        /* Disable text box for anonymous rooms */
        if (this.anonymous) {
            this.te.disable();
        }

        let pref = "muc::" + Strophe.getNodeFromJid(this.barejid) + "::mute";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            const toolbar = this.gp.down("toolbar");
            if (toolbar && toolbar.items && toolbar.items.items[4]) {
                toolbar.items.items[4].toggle(true, true);
                toolbar.items.items[4].setText("Sounds Muted");
            }
            this.gp.soundOn = false;
        }

        pref =
            "muc::" + Strophe.getNodeFromJid(this.barejid) + "::iembothidden";
        if (Application.getPreference(pref, false)) {
            /* hacky */
            const toolbar = this.gp.down("toolbar");
            if (toolbar && toolbar.items && toolbar.items.items[3]) {
                toolbar.items.items[3].toggle(true, true);
                toolbar.items.items[3].setText("IEMBot Hidden");
            }
            this.gp.store.filterBy(iembotFilter);
        }
    },
});

const ChatPanel = Ext.extend(Ext.Panel, {
    hideMode: "offsets",
    closable: true,
    layout: "border",
    iconCls: "tabno",
    chatType: "chat",
    barejid: null,
    handle: null,
    anonymous: null,

    initComponent: function () {
        // Create components and store references immediately
        const gridPanel = new Application.ChatGridPanel({
            region: "center",
        });
        const textEntry = new Application.ChatTextEntry({
            region: "south",
            height: 50,
            split: true,
        });

        this.gp = gridPanel;
        this.te = textEntry;
        this.items = [gridPanel, textEntry];

        const iconfig = {
            listeners: {
                activate: function (self) {
                    self.setIconCls("tabno");
                },
                deactivate: function (self) {
                    self.setIconCls("tabno");
                },
                beforedestroy: function (self) {
                    if (self.te.chatstate) {
                        self.te.chatstate.cancel();
                    }
                    Application.XMPPConn.send(
                        $msg({
                            to: self.barejid,
                            type: self.chatType,
                        }).c("gone", {
                            xmlns: "http://jabber.org/protocol/chatstates",
                        }),
                    );
                },
            },
        };
        Ext.apply(this, Ext.apply(this.initialConfig, iconfig));

        ChatPanel.superclass.initComponent.apply(this, arguments);
        this.buildItems();
    },
    getJidByHandle: function () {
        return this.barejid;
    },
    buildItems: function () {
        // References already set in initComponent
        /* Remove iembot muter */
        this.gp.getTopToolbar().remove(this.gp.getTopToolbar().items.items[3]);
        /* Remove sound muter */
        this.gp.getTopToolbar().remove(this.gp.getTopToolbar().items.items[3]);
    },
});


const MUCRoomUsers = Ext.extend(Ext.tree.TreePanel, {
    bodyStyle: { "margin-left": "-15px" },
    title: "0 people in room",
    rootVisible: false,
    lines: false,
    autoScroll: true,
    initComponent: function () {
        this.root = {
            text: "test",
            listeners: {
                append: function (tree, node) {
                    const sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                },
                remove: function (tree, node) {
                    const sz = node.childNodes.length;
                    tree.setTitle(sz + " people in room");
                },
            },
        };
        const iconfig = {
            plugins: new Ext.ux.DataTip({
                tpl: "<div>JID: {jid}<br />Affiliation: {affiliation}<br />Role: {role}</div>",
                constrainPosition: true,
            }),
            listeners: {
                click: function (n) {
                    if (!n.data.jid) {
                        return;
                    }
                    const username = Strophe.getNodeFromJid(n.data.jid);
                    /* Can't speak with ourself */
                    if (username === Application.USERNAME) {
                        return;
                    }
                    /* Now, we either talk with private or private via MUC */
                    let jid = n.data.jid;
                    if (
                        Strophe.getDomainFromJid(n.data.jid) ===
                        LiveConfig.XMPPHOST
                    ) {
                        jid = Strophe.getBareJidFromJid(n.data.jid);
                    }
                    Application.log("Wish to start chat with:" + jid);
                    let cp = ChatPanel.getChat(jid);
                    if (!cp) {
                        cp = ChatPanel.addChat(jid);
                    }
                    ChatPanel.setActiveTab(cp);
                },
            },
        };
        Ext.apply(this, Ext.apply(this.initialConfig, iconfig));

        MUCRoomUsers.superclass.initComponent.apply(
            this,
            arguments,
        );
        this.buildItems();
    },
    buildItems: function () {},
});

Ext.reg("mucroomusers", MUCRoomUsers);

Application.colors = [
    "000000", //black
    "666666", //
    "D51460", //
    "FF0000", //
    "993333", //
    "FF9900", //
    "005500", //
    "009900", //
    "00DD00", //
    "0066CC", //
    "3399FF", //
    "0000FF", //
    "6666FF", //
];
Application.colorpointer = 0;

Application.UserColorStore = new Ext.data.Store({
    fields: ["user", "color"],
});

Application.getUserColor = function (user) {
    const idx = Application.UserColorStore.find("user", user);
    let c = null;
    if (idx === -1) {
        c = Application.colors[Application.colorpointer];
        Application.UserColorStore.add(
            new Ext.data.Record({ user: user, color: c }),
        );
        Application.colorpointer++;
        if (Application.colorpointer > 12) {
            Application.colorpointer = 0;
        }
    } else {
        c = Application.UserColorStore.getAt(idx).get("color");
    }
    return c;
};

Application.ChatTextEntry = Ext.extend(Ext.Panel, {
    layout: "hbox",
    layoutConfig: {
        align: "stretch",
    },
    border: false,
    chatstate: null,
    initComponent: function () {
        this.items = [
            {
                xtype: "textarea",
                flex: 1,
                cls: "message-entry-box",
                autoCreate: {
                    tag: "textarea",
                    style: 'rows:10;cols:72;wrap:"hard";',
                    autocomplete: "off",
                },
                style: {
                    background:
                        "#" + Application.getPreference("bgcolor", "FFFFFF"),
                    color: "#" + Application.getPreference("fgcolor", "000000"),
                },
                enableKeyEvents: true,
                listeners: {
                    keyup: function (elTxt, e) {
                        // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                        // e.TAB, e.ESC, arrow keys: e.LEFT,
                        // e.RIGHT, e.UP,
                        // e.DOWN
                        if (e.getKey() === e.ENTER && !e.shiftKey) {
                            if (this.chatstate) {
                                this.chatstate.cancel();
                            }
                            this.chatstate = null;
                            this.ownerCt.getComponent(1).handler();
                            return true;
                        }
                        /* Chat States! */
                        if (this.ownerCt.ownerCt.chatType === "chat") {
                            if (!this.chatstate) {
                                this.chatstate = new Ext.util.DelayedTask(
                                    function () {
                                        if (
                                            !this.ownerCt ||
                                            !this.ownerCt.ownerCt
                                        ) {
                                            return;
                                        }
                                        Application.XMPPConn.send(
                                            $msg({
                                                to: this.ownerCt.ownerCt
                                                    .barejid,
                                                type: this.ownerCt.ownerCt
                                                    .chatType,
                                            }).c("paused", {
                                                xmlns: "http://jabber.org/protocol/chatstates",
                                            }),
                                        );
                                        this.chatstate = null;
                                    },
                                    this,
                                );
                                Application.XMPPConn.send(
                                    $msg({
                                        to: this.ownerCt.ownerCt.barejid,
                                        type: this.ownerCt.ownerCt.chatType,
                                    }).c("composing", {
                                        xmlns: "http://jabber.org/protocol/chatstates",
                                    }),
                                );
                            }
                            /* Wait 5 seconds before pausing */
                            this.chatstate.delay(5000);
                        }
                    },
                    render: {
                        delay: 500,
                        fn: function () {
                            this.focus();
                        },
                    },
                },
            },
            {
                xtype: "button",
                text: "Send",
                width: 60,
                popup: null,
                handler: function () {
                    const txt = this.ownerCt.getComponent(0);
                    let text = txt.getValue().trim();
                    if (text.length === 0) {
                        txt.focus();
                        return false;
                    }
                    const bgcolor = Application.getPreference(
                        "bgcolor",
                        "FFFFFF",
                    );
                    const fgcolor = Application.getPreference(
                        "fgcolor",
                        "000000",
                    );

                    /* allchat */
                    if (this.ownerCt.ownerCt.chatType === "allchats") {
                        txt.emptyText = "";
                        txt.setValue("");
                        new Application.AllChatMessageWindow({
                            message: Application.replaceURLWithHTMLLinks(text),
                        }).show();
                    } else {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(
                            Application.replaceURLWithHTMLLinks(text),
                            "text/html",
                        );
                        const nodes = Array.from(doc.body.childNodes);
                        let msg = $msg({
                            to: this.ownerCt.ownerCt.barejid,
                            type: this.ownerCt.ownerCt.chatType,
                        })
                            .c("active", {
                                xmlns: "http://jabber.org/protocol/chatstates",
                            })
                            .up()
                            .c("body")
                            .t(text)
                            .up()
                            .c("html", {
                                xmlns: "http://jabber.org/protocol/xhtml-im",
                            })
                            .c("body", {
                                xmlns: "http://www.w3.org/1999/xhtml",
                            })
                            .c("p")
                            .c("span", {
                                style:
                                    "color:#" +
                                    fgcolor +
                                    ";background:#" +
                                    bgcolor +
                                    ";",
                            });
                        for (let i = 0; i < nodes.length; i++) {
                            msg = msg.cnode(nodes[i]);
                            if (i < nodes.length) {
                                msg = msg.up();
                            }
                        }
                        Application.XMPPConn.send(msg);
                        txt.setValue("");
                        txt.focus();

                        // Since we don't get our messages back via XMPP
                        // we need to manually add to the store
                        if (this.ownerCt.ownerCt.chatType === "chat") {
                            text =
                                "<span " +
                                "style='color:#" +
                                fgcolor +
                                ";background:#" +
                                bgcolor +
                                ";'>" +
                                text +
                                "</span>";
                            this.ownerCt.ownerCt.gp.getStore().add({
                                ts: new Date(),
                                author: Application.USERNAME,
                                message:
                                    Application.replaceURLWithHTMLLinks(text),
                            });
                        }
                    }
                },
            },
        ];
        Application.ChatTextEntry.superclass.initComponent.apply(
            this,
            arguments,
        );
    },
});

Ext.reg("chattextentry", Application.ChatTextEntry);

Application.msgFormatter = new Ext.XTemplate(
    '<p class="mymessage">',
    "<span ",
    '<tpl if="values.me == values.author">',
    'class="author-me"',
    "</tpl>",
    '<tpl if="values.me != values.author">',
    'class="{[this.getAuthorClass(values.jid)]}" style="color: #{[Application.getUserColor(values.author)]};"',
    "</tpl>",
    ">(",
    '<tpl if="this.isNotToday(ts)">',
    '{ts:date("d M")} ',
    "</tpl>",
    '{ts:date("g:i A")}) ',
    '<tpl if="values.room != null">',
    "[{room}] ",
    "</tpl>",
    "{author}:</span> ",
    "{message}</p>",
    {
        isNotToday: function (ts) {
            return new Date().format("md") !== ts.format("md");
        },
        getAuthorClass: function (jid) {
            //console.log("node: "+Strophe.getNodeFromJid(jid) );
            if (jid === null) {
                return "author-default";
            }
            if (Strophe.getNodeFromJid(jid) === "iembot") {
                return "author-iembot";
            }
            if (Strophe.getNodeFromJid(jid).match(/^nws/)) {
                return "author-nws";
            }

            return "author-chatpartner";
        },
    },
);

Application.ChatGridPanel = Ext.extend(Ext.grid.GridPanel, {
    region: "center",
    soundOn: true,
    iembotHide: false,
    stripeRows: true,
    autoScroll: true,

    tbar: [
        {
            text: "Clear Room Log",
            cls: "x-btn-text-icon",
            icon: "icons/close.png",
            handler: function (btn) {
                btn.ownerCt.ownerCt.getStore().removeAll();
            },
        },
        {
            text: "Print Log",
            icon: "icons/print.png",
            cls: "x-btn-text-icon",
            handler: function (btn) {
                btn.ownerCt.ownerCt.getGridEl().print({
                    isGrid: true,
                });
            },
        },
        {
            text: "View As HTML",
            handler: function (btn) {
                showHtmlVersion(btn.ownerCt.ownerCt);
            },
            icon: "icons/text.png",
            cls: "x-btn-text-icon",
        },
        {
            text: "Hide IEMBot",
            enableToggle: true,
            toggleHandler: function (btn, toggled) {
                const pref =
                    "muc::" +
                    Strophe.getNodeFromJid(
                        btn.ownerCt.ownerCt.ownerCt.barejid,
                    ) +
                    "::iembothidden";
                const store = btn.ownerCt.ownerCt.getStore();
                btn.ownerCt.ownerCt.iembotHide = toggled;
                if (toggled) {
                    Application.setPreference(pref, "true");
                    store.filterBy(iembotFilter);
                    btn.setText("IEMBot Hidden");
                } else {
                    Application.removePreference(pref);
                    store.clearFilter(false);
                    btn.setText("Hide IEMBot");
                }
            },
        },
        {
            text: "Mute Sounds",
            enableToggle: true,
            toggleHandler: function (btn, toggled) {
                //var store = btn.ownerCt.ownerCt.getStore();
                const pref =
                    "muc::" +
                    Strophe.getNodeFromJid(
                        btn.ownerCt.ownerCt.ownerCt.barejid,
                    ) +
                    "::mute";
                if (toggled) {
                    Application.setPreference(pref, "true");
                    btn.ownerCt.ownerCt.soundOn = false;
                    btn.setText("Sounds Muted");
                } else {
                    Application.removePreference(pref);
                    btn.ownerCt.ownerCt.soundOn = true;
                    btn.setText("Mute Sounds");
                }
            },
        },
        {
            icon: "icons/font-less.png",
            handler: function () {
                const size =
                    parseInt(Application.getPreference("font-size", 14)) - 2;
                Application.setPreference("font-size", size);
                //var cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
                const cssfmt = String.format("normal {0}px arial", size);
                Ext.util.CSS.updateRule(
                    "td.x-grid3-td-message",
                    "font",
                    cssfmt,
                );
                Ext.util.CSS.updateRule(".message-entry-box", "font", cssfmt);
            },
        },
        {
            icon: "icons/font-more.png",
            handler: function () {
                const size =
                    parseInt(Application.getPreference("font-size", 14)) + 2;
                Application.setPreference("font-size", size);
                const cssfmt = String.format("normal {0}px arial", size);
                Ext.util.CSS.updateRule(
                    "td.x-grid3-td-message",
                    "font",
                    cssfmt,
                );
                Ext.util.CSS.updateRule(".message-entry-box", "font", cssfmt);
            },
        },
    ],
    initComponent: function () {
        // Store reference to parent for use in renderer
        const parentPanel = this.ownerCt;

        this.columns = [
            {
                header: "Author",
                sortable: true,
                dataIndex: "author",
                hidden: true,
            },
            {
                id: "message",
                header: "Message",
                sortable: true,
                dataIndex: "ts",
                flex: 1,
                renderer: function (_value, _p, record) {
                    const data = {
                        author: record.get("author"),
                        message: record.get("message"),
                        ts: record.get("ts"),
                        room: record.get("room"),
                        jid: record.get("jid"),
                        me: parentPanel ? parentPanel.handle : null,
                    };
                    console.log("[Renderer] Data:", data);
                    const html = Application.msgFormatter.apply(data);
                    console.log(
                        "[Renderer] HTML output:",
                        html.substring(0, 100),
                    );
                    return html;
                },
            },
        ];
        this.store = new Ext.data.ArrayStore({
            sortInfo: {
                field: "ts",
                direction: "ASC",
            },
            fields: [
                {
                    name: "ts",
                    type: "date",
                },
                "author",
                "message",
                "product_id",
                "jid",
                "room",
                {
                    name: "xdelay",
                    type: "boolean",
                },
            ],
        });
        this.store.on(
            "add",
            function (_store, records) {
                console.log(
                    "[ChatGrid] Store add event fired, records:",
                    records.length,
                );
                if (!this.soundOn) {
                    console.log("[ChatGrid] Sound is off, skipping");
                    return true;
                }
                let nonIEMBot = false;
                let nothingNew = true;
                for (let i = 0; i < records.length; i++) {
                    /* No events for delayed messages */
                    if (records[i].get("xdelay")) {
                        continue;
                    }
                    /* No events if I talked! */
                    if (records[i].get("author") === this.ownerCt.handle) {
                        continue;
                    }
                    if (records[i].get("author") !== "iembot") {
                        nonIEMBot = true;
                    }
                    if (records[i].get("message").match(/tornado/i)) {
                        msgBus.fire("soundevent", "tornado");
                    }
                    // TODO: figure out how to make this case insensitive
                    if (records[i].get("message").match(this.ownerCt.handle)) {
                        msgBus.fire("soundevent", "myhandle");
                    }
                    nothingNew = false;
                } //end of for()
                if (nothingNew) {
                    return true;
                }
                if (nonIEMBot) {
                    // Make this tab show the new icon for the new message
                    this.ownerCt.setIconCls("new-tab");
                    msgBus.fire("soundevent", "new_message");
                } else {
                    // If iembot is muted, lets stop the events
                    if (!this.iembotHide) {
                        this.ownerCt.setIconCls("new-tab");
                        msgBus.fire("soundevent", "iembot");
                    }
                }
            },
            this,
        );
        const iconfig = {
            selModel: {
                type: "rowmodel",
                listeners: {
                    select: function (_sm, record) {
                        if (record.data.product_id) {
                            loadTextProductInWindow(record.data.product_id);
                        }
                    },
                },
            },
            listeners: {
                add: function (store, records) {
                    // Auto-scroll to the latest message after a short delay to ensure rendering
                    Ext.defer(
                        function () {
                            const view = this.getView();
                            if (view && records.length > 0) {
                                const lastRecord = records[records.length - 1];
                                view.focusRow(lastRecord);
                            }
                        },
                        50,
                        this,
                    );
                },
                render: function (p) {
                    const viewEl = p.getView().getEl();
                    if (viewEl) {
                        viewEl.on("mousedown", function (e, t) {
                            if (t.tagName === "A") {
                                e.stopEvent();
                                t.target = "_blank";
                            }
                        });
                    }
                    p.body.on({
                        mousedown: function (e, t) {
                            // try to
                            // intercept the
                            // easy
                            // way
                            //console.log("Daryl2:"+ t.tagName);
                            t.target = "_blank";
                            hideTextWindow();
                        },
                        click: function (e, t) {
                            if (String(t.target).toLowerCase() !== "_blank") {
                                e.stopEvent();
                                window.open(t.href);
                            }
                            hideTextWindow();
                        },
                        delegate: "a",
                    });
                },
            },
        };
        Ext.apply(this, iconfig);

        Application.ChatGridPanel.superclass.initComponent.apply(
            this,
            arguments,
        );

        /*
         * this.view = new Ext.grid.GridView({ cellTpl: new Ext.Template( '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div
         * class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"
         * {attr}>{value}</div>', '</td>' ) });
         */
    },
});

Ext.reg("chatgridpanel", Application.ChatGridPanel);
/**
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
Ext.ux.DataTip = Ext.extend(
    Ext.ToolTip,
    (function () {
        //  Target the body (if the host is a Panel), or, if there is no body, the main Element.
        function onHostRender() {
            const e = this.body || this.el;
            if (this.dataTip.renderToTarget) {
                this.dataTip.render(e);
            }
            // In ExtJS 6, set the target element directly
            if (this.dataTip.setTarget) {
                this.dataTip.setTarget(e);
            } else if (e) {
                this.dataTip.target = e;
            }
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
            const e = Ext.fly(tip.triggerElement).findParent(
                    "div.x-tree-node-el",
                    null,
                    true,
                ),
                node = e
                    ? tip.host.getNodeById(
                          e.getAttribute("tree-node-id", "ext"),
                      )
                    : null;
            if (node) {
                updateTip(tip, node.data);
            } else {
                return false;
            }
        }

        function beforeGridTipShow(tip) {
            const rec = this.host
                .getStore()
                .getAt(this.host.getView().findRowIndex(tip.triggerElement));
            if (rec) {
                updateTip(tip, rec.data);
            } else {
                return false;
            }
        }

        function beforeViewTipShow(tip) {
            const rec = this.host.getRecord(tip.triggerElement);
            if (rec) {
                updateTip(tip, rec.data);
            } else {
                return false;
            }
        }

        function beforeFormTipShow(tip) {
            const el = Ext.fly(tip.triggerElement).child("input,textarea"),
                field = el ? this.host.getForm().findField(el.id) : null;
            if (field && (field.tooltip || tip.tpl)) {
                updateTip(tip, field.tooltip || field);
            } else {
                return false;
            }
        }

        function beforeComboTipShow(tip) {
            const rec = this.host.store.getAt(this.host.selectedIndex);
            if (rec) {
                updateTip(tip, rec.data);
            } else {
                return false;
            }
        }

        return {
            init: function (host) {
                host.dataTip = this;
                this.host = host;
                if (host instanceof Ext.tree.TreePanel) {
                    this.delegate = this.delegate || "div.x-tree-node-el";
                    this.on("beforeshow", beforeTreeTipShow);
                } else if (host instanceof Ext.grid.GridPanel) {
                    this.delegate = this.delegate || host.getView().rowSelector;
                    this.on("beforeshow", beforeGridTipShow);
                } else if (host instanceof Ext.DataView) {
                    this.delegate = this.delegate || host.itemSelector;
                    this.on("beforeshow", beforeViewTipShow);
                } else if (host instanceof Ext.FormPanel) {
                    this.delegate = "div.x-form-item";
                    this.on("beforeshow", beforeFormTipShow);
                } else if (host instanceof Ext.form.ComboBox) {
                    this.delegate = this.delegate || host.itemSelector;
                    this.on("beforeshow", beforeComboTipShow);
                }
                if (host.rendered) {
                    onHostRender.call(host);
                } else {
                    // In ExtJS 6, use listeners instead of createSequence
                    host.on("render", onHostRender, host, { single: true });
                }
            },
        };
    })(),
);
/*
 * Handles all of the ROSTER related activities
 */

/*
 * Handle presence from a buddy. This gets into complicated UI land, but we'll
 * try to handle it all
 */
function onBuddyPresence(msg) {
    // Okay, we know who we got the presence from
    const jid = msg.getAttribute("from");
    const barejid = Strophe.getBareJidFromJid(jid);
    const resource = Strophe.getResourceFromJid(jid);
    const username = Strophe.getNodeFromJid(jid);
    let status = "Available";
    /* IMPORTANT: If we find our own username, then we need to set a global
     * flag to prevent auto-login from working
     */
    if (
        username === Application.USERNAME &&
        resource !== Application.XMPPRESOURCE &&
        resource.match(/^WeatherIM/)
    ) {
        if (msg.getAttribute("type") === "unavailable") {
            Application.log(
                "Self presence: [" +
                    username +
                    "] [" +
                    resource +
                    "] unavailable",
            );
        } else {
            Application.log(
                "Self presence: [" +
                    username +
                    "] [" +
                    resource +
                    "] available",
            );
        }
    }
    /* Check for status */
    if (msg.getElementsByTagName("status").length > 0) {
        status = msg.getElementsByTagName("status")[0].textContent;
    }
    /* Check for subscription request */
    if (msg.getAttribute("type") === "subscribe") {
        Ext.Msg.show({
            title: "New Buddy Request",
            msg:
                "User " +
                username +
                " wishes to add you as a buddy. Is this okay?",
            buttons: Ext.Msg.YESNO,
            fn: function (btn) {
                if (btn === "yes") {
                    /* <presence to='fire-daryl.e.herzmann@localhost' type='subscribed'/> */
                    const stanza = $pres({ to: jid, type: "subscribed" });
                    Application.XMPPConn.send(stanza.tree());
                    Application.buildAddBuddy(username, username, "Buddies");
                } else {
                    const stanza = $pres({ to: jid, type: "unsubscribed" });
                    Application.XMPPConn.send(stanza.tree());
                }
            },
            icon: Ext.MessageBox.QUESTION,
        });

        return;
    }

    // Go look for our barejid
    const buddiesTree = Ext.getCmp("buddies");
    if (buddiesTree && buddiesTree.getRootNode()) {
        buddiesTree.getRootNode().eachChild(function (node) {
            node.eachChild(function (leaf) {
                if (leaf.data.barejid === barejid) {
                    const res = leaf.data.resources.get(resource);
                    if (!res) {
                        leaf.data.resources.add(resource, {
                            status: status,
                            resource: resource,
                        });
                    }
                    if (!msg.getAttribute("type")) {
                        if (msg.getElementsByTagName("show").length > 0) {
                            leaf.setIconCls("buddy-away");
                        } else {
                            leaf.setIconCls("buddy-online");
                        }
                        leaf.data.presence = "online";
                        leaf.ui.show();
                        //console.log("Replace"+ resource +" Status:"+ status);
                        leaf.data.resources.replace(resource, {
                            status: status,
                            resource: resource,
                        });
                    } else if (msg.getAttribute("type") === "unavailable") {
                        if (leaf.data.resources.length === 1) {
                            leaf.data.presence = "offline";
                            leaf.setIconCls("buddy-offline");
                            leaf.ui.hide();
                        }
                        leaf.data.resources.remove(resource);
                    }
                }
            });
        });
    }
}

export { onBuddyPresence };

Ext.namespace("Ext.ux.panel");

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
    initComponent: function () {
        Ext.ux.panel.DDTabPanel.superclass.initComponent.call(this);
        // In ExtJS 6, addEvents is not needed - Observable automatically supports any event
        // this.addEvents('reorder');
        if (!this.ddGroupId) {
            this.ddGroupId =
                "dd-tabpanel-group-" +
                Ext.ux.panel.DDTabPanel.superclass.getId.call(this);
        }
        // Initialize stack for tracking tab history
        this.stack = new Ext.util.MixedCollection();
    },

    // New Event fired after drop tab
    reorder: function (tab) {
        this.fireEvent("reorder", this, tab);
    },

    // Declare the tab panel as a drop target
    /** @private */
    afterRender: function () {
        Ext.ux.panel.DDTabPanel.superclass.afterRender.call(this);
        // Create a drop arrow indicator
        this.arrow = Ext.DomHelper.append(
            Ext.getBody(),
            '<div class="dd-arrow-down"></div>',
            true,
        );
        this.arrow.hide();
        // Create a drop target for this tab panel
        const tabsDDGroup = this.ddGroupId;
        this.dd = new Ext.ux.panel.DDTabPanel.DropTarget(this, {
            ddGroup: tabsDDGroup,
        });

        // needed for the onRemove-Listener
        this.move = false;
    },

    // Init the drag source after (!) rendering the tab
    /** @private */
    initTab: function (tab, index) {
        Ext.ux.panel.DDTabPanel.superclass.initTab.call(this, tab, index);

        // Add tab to stack for history tracking
        if (this.stack && !this.stack.containsKey(tab.id)) {
            this.stack.add(tab.id, tab);
        }

        const id = this.id + "__" + tab.id;
        // Hotfix 3.2.0
        Ext.fly(id).on("click", function () {
            tab.ownerCt.setActiveTab(tab.id);
        });
        // Enable dragging on all tabs by default
        Ext.applyIf(tab, { allowDrag: true });

        // Extend the tab
        Ext.apply(tab, {
            // Make this tab a drag source
            ds: new Ext.dd.DragSource(id, {
                ddGroup: this.ddGroupId,
                dropEl: tab,
                dropElHeader: Ext.get(id, true),
                scroll: false,

                // Update the drag proxy ghost element
                onStartDrag: function () {
                    if (this.dropEl.iconCls) {
                        const el = this.getProxy()
                            .getGhost()
                            .select(".x-tab-strip-text");
                        el.addClass("x-panel-inline-icon");

                        const proxyText = el.elements[0].innerHTML;
                        el.elements[0].innerHTML =
                            Ext.util.Format.stripTags(proxyText);

                        el.applyStyles({
                            paddingLeft: "20px",
                        });
                    }
                },

                // Activate this tab on mouse up
                // (Fixes bug which prevents a tab from being activated by clicking it)
                onMouseUp: function () {
                    if (this.dropEl.ownerCt.move) {
                        if (
                            !this.dropEl.disabled &&
                            this.dropEl.ownerCt.activeTab === null
                        ) {
                            this.dropEl.ownerCt.setActiveTab(this.dropEl);
                        }
                        this.dropEl.ownerCt.move = false;
                        return;
                    }
                    if (!this.dropEl.isVisible() && !this.dropEl.disabled) {
                        this.dropEl.show();
                    }
                },
            }),
            // Method to enable dragging
            enableTabDrag: function () {
                this.allowDrag = true;
                return this.ds.unlock();
            },
            // Method to disable dragging
            disableTabDrag: function () {
                this.allowDrag = false;
                return this.ds.lock();
            },
        });

        // Initial dragging state
        if (tab.allowDrag) {
            tab.enableTabDrag();
        } else {
            tab.disableTabDrag();
        }
    },

    /** @private */
    onRemove: function (c) {
        // Let ExtJS handle DOM cleanup; manual destruction can break layouts in ExtJS 6
        Ext.ux.panel.DDTabPanel.superclass.onRemove.call(this, c);

        if (this.stack) {
            this.stack.remove(c);
        }
        delete c.tabEl;
        c.un("disable", this.onItemDisabled, this);
        c.un("enable", this.onItemEnabled, this);
        c.un("titlechange", this.onItemTitleChanged, this);
        c.un("iconchange", this.onItemIconChanged, this);
        c.un("beforeshow", this.onBeforeShowItem, this);

        // if this.move, the active tab stays the active one
        if (c === this.activeTab) {
            if (!this.move) {
                const next = this.stack ? this.stack.next() : null;
                if (next) {
                    this.setActiveTab(next);
                } else if (this.items.getCount() > 0) {
                    this.setActiveTab(0);
                } else {
                    this.activeTab = null;
                }
            } else {
                this.activeTab = null;
            }
        }
    },

    // DropTarget and arrow cleanup
    /** @private */
    onDestroy: function () {
        Ext.destroy(this.dd, this.arrow);
        Ext.ux.panel.DDTabPanel.superclass.onDestroy.call(this);
    },
});

// Ext.ux.panel.DDTabPanel.DropTarget
// Implements the drop behavior of the tab panel
/** @private */
Ext.ux.panel.DDTabPanel.DropTarget = Ext.extend(Ext.dd.DropTarget, {
    constructor: function (tabpanel, iconfig) {
        this.tabpanel = tabpanel;
        // In ExtJS 6, get the tab bar element instead of stripWrap
        const targetEl = tabpanel.tabBar ? tabpanel.tabBar.el : tabpanel.el;
        Ext.ux.panel.DDTabPanel.DropTarget.superclass.constructor.call(
            this,
            targetEl,
            iconfig,
        );
    },

    notifyOver: function (dd, e) {
        const tabs = this.tabpanel.items;
        const last = tabs.length;

        if (!e.within(this.getEl()) || dd.dropEl === this.tabpanel) {
            return "x-dd-drop-nodrop";
        }

        const larrow = this.tabpanel.arrow;

        // Getting the absolute Y coordinate of the tabpanel
        const tabPanelTop = this.el.getY();

        let left = null;
        let prevTab = null;
        let tab = null;
        const eventPosX = e.getPageX();

        for (let i = 0; i < last; i++) {
            prevTab = tab;
            tab = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            const tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            const tabLeft = tabEl.getX();
            // Get the middle of the tab
            const tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;
            if (eventPosX <= tabMiddle) {
                left = tabLeft;
                break;
            }
        }

        if (typeof left === "undefined") {
            const lastTab = tabs.itemAt(last - 1);
            if (lastTab === dd.dropEl) {
                return "x-dd-drop-nodrop";
            }
            const dom = lastTab.ds.dropElHeader.dom;
            left = new Ext.Element(dom).getX() + dom.clientWidth + 3;
        } else if (tab === dd.dropEl || prevTab === dd.dropEl) {
            this.tabpanel.arrow.hide();
            return "x-dd-drop-nodrop";
        }

        larrow
            .setTop(tabPanelTop + this.tabpanel.arrowOffsetY)
            .setLeft(left + this.tabpanel.arrowOffsetX)
            .show();

        return "x-dd-drop-ok";
    },

    notifyDrop: function (dd, e) {
        this.tabpanel.arrow.hide();

        // no parent into child
        if (dd.dropEl === this.tabpanel) {
            return false;
        }
        const tabs = this.tabpanel.items;
        const eventPosX = e.getPageX();
        let tab = null;
        let i = 0;
        for (i = 0; i < tabs.length; i++) {
            tab = tabs.itemAt(i);
            // Is this tab target of the drop operation?
            const tabEl = tab.ds.dropElHeader;
            // Getting the absolute X coordinate of the tab
            const tabLeft = tabEl.getX();
            // Get the middle of the tab
            const tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;
            if (eventPosX <= tabMiddle) {
                break;
            }
        }

        // do not insert at the same location
        if (tab === dd.dropEl || tabs.itemAt(i - 1) === dd.dropEl) {
            return false;
        }

        dd.proxy.hide();

        // if tab stays in the same tabPanel
        if (dd.dropEl.ownerCt === this.tabpanel) {
            if (i > tabs.indexOf(dd.dropEl)) {
                i--;
            }
        }

        this.tabpanel.move = true;
        const dropEl = dd.dropEl.ownerCt.remove(dd.dropEl, false);

        this.tabpanel.insert(i, dropEl);
        // Event drop
        this.tabpanel.fireEvent("drop", this.tabpanel);
        // Fire event reorder
        this.tabpanel.reorder(tabs.itemAt(i));

        return true;
    },

    notifyOut: function () {
        this.tabpanel.arrow.hide();
    },
});

Ext.reg("ddtabpanel", Ext.ux.panel.DDTabPanel);

Application.ChatTabPanel = Ext.extend(Ext.ux.panel.DDTabPanel, {
    activeTab: 0,
    deferredRender: false,
    split: true,
    enableTabScroll: true,
    initComponent: function () {
        const iconfig = {};
        Ext.apply(this, Ext.apply(this.initialConfig, iconfig));

        Application.ChatTabPanel.superclass.initComponent.apply(
            this,
            arguments,
        );
        this.buildItems();
    },
    buildItems: function () {
        this.add({
            contentEl: "help",
            title: "Help",
            preventBodyReset: true,
            style: {
                margin: "5px",
            },
            autoScroll: true,
        });
        this.add(
            new MUCChatPanel({
                title: "All Chats",
                closable: false,
                chatType: "allchats",
                barejid: `__allchats__@${LiveConfig.XMPPMUCHOST}`,
                id: "__allchats__",
            }),
        );
    },
    addMUC: function (barejid, handle, anonymous) {
        const mcp = new MUCChatPanel({
            title: Strophe.getNodeFromJid(barejid),
            barejid: barejid,
            handle: handle,
            anonymous: anonymous,
        });
        return this.add(mcp);
    },
    getMUC: function (barejid) {
        // In ExtJS 6, use query to find components by property
        const items = this.query("[barejid=" + barejid + "]");
        return items.length > 0 ? items[0] : null;
    },
    removeMUC: function (barejid) {
        const mcp = this.getMUC(barejid);
        if (!mcp || mcp.destroyed) {
            return;
        }
        if (mcp.closable === false) {
            return;
        }
        Ext.defer(
            function () {
                if (!mcp || mcp.destroyed || mcp.ownerCt !== this) {
                    return;
                }
                if (mcp.close) {
                    mcp.close();
                    return;
                }
                Ext.suspendLayouts();
                this.remove(mcp, true);
                Ext.resumeLayouts(true);
            },
            50,
            this,
        );
    },
    addChat: function (jid) {
        let title = Strophe.getNodeFromJid(jid);
        if (Strophe.getDomainFromJid(jid) === LiveConfig.XMPPMUCHOST) {
            title = Strophe.getResourceFromJid(jid);
        }
        const cp = new ChatPanel({
            title: title,
            handle: Application.USERNAME,
            barejid: jid,
        });
        return this.add(cp);
    },
    getChat: function (jid) {
        // In ExtJS 6, use query to find components by property
        const items = this.query("[barejid=" + jid + "]");
        return items.length > 0 ? items[0] : null;
    },
    removeChat: function (jid) {
        const cp = this.getChat(jid);
        if (!cp || cp.destroyed) {
            return;
        }
        Ext.defer(
            function () {
                if (!cp || cp.destroyed || cp.ownerCt !== this) {
                    return;
                }
                if (cp.close) {
                    cp.close();
                    return;
                }
                Ext.suspendLayouts();
                this.remove(cp, true);
                Ext.resumeLayouts(true);
            },
            50,
            this,
        );
    },
});
