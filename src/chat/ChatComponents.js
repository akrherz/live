import { msgBus } from "../events/MsgBus.js";
import { $msg, $pres, Strophe } from "strophe.js";
import { loadTextProductInWindow, hideTextWindow } from "../ui/text-window.js";
import {
    iembotFilter,
    printGrid,
    showHtmlVersion,
} from "../utils/grid-utilities.js";
import { LiveConfig } from "../config.js";
import { getPreference, setPreference } from "../xmpp/handlers.js";
import { DataTip } from "../ui/data-tip.js";
import { Application } from "../app-state.js";

function createOutgoingMessageStanza(panel, text, fgcolor, bgcolor) {
    const messageId =
        "msg-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const parser = new DOMParser();
    const doc = parser.parseFromString(
        Application.replaceURLWithHTMLLinks(text),
        "text/html",
    );
    const nodes = Array.from(doc.body.childNodes);

    let msg = $msg({
        to: panel.barejid,
        type: panel.chatType,
        id: messageId,
    })
        .c("active", {
            xmlns: "http://jabber.org/protocol/chatstates",
        })
        .up()
        .c("body")
        .t(text)
        .up();

    if (panel.chatType === "chat") {
        msg = msg
            .c("request", {
                xmlns: "urn:xmpp:receipts",
            })
            .up();
    }

    msg = msg
        .c("html", {
            xmlns: "http://jabber.org/protocol/xhtml-im",
        })
        .c("body", {
            xmlns: "http://www.w3.org/1999/xhtml",
        })
        .c("p")
        .c("span", {
            style: "color:#" + fgcolor + ";background:#" + bgcolor + ";",
        });

    for (let i = 0; i < nodes.length; i++) {
        msg = msg.cnode(nodes[i]);
        if (i < nodes.length) {
            msg = msg.up();
        }
    }

    return { msg, messageId };
}

function retryFailedDirectMessages(panel, store) {
    if (
        !panel ||
        panel.chatType !== "chat" ||
        !store ||
        !Application.XMPPConn ||
        !Application.XMPPConn.authenticated
    ) {
        return;
    }

    const fgcolor = getPreference("fgcolor", "000000");
    const bgcolor = getPreference("bgcolor", "FFFFFF");
    let retryCount = 0;

    store.each(function (record) {
        if (record.get("delivery_status") !== "failed") {
            return;
        }
        const rawMessage = record.get("raw_message");
        if (!rawMessage) {
            return;
        }
        const { msg, messageId } = createOutgoingMessageStanza(
            panel,
            rawMessage,
            fgcolor,
            bgcolor,
        );
        Application.XMPPConn.send(msg);
        record.set("stanza_id", messageId);
        record.set("delivery_status", "sent");
        retryCount += 1;
    });

    if (retryCount > 0) {
        Application.log("Retried failed direct messages: " + retryCount);
    }
}

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
        const gridPanel = new ChatGridPanel({
            region: "center",
        });
        const textEntry = new ChatTextEntry({
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

        MUCChatPanel.superclass.initComponent.apply(this, arguments);
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
        if (getPreference(pref, false)) {
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
        if (getPreference(pref, false)) {
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
        const gridPanel = new ChatGridPanel({
            region: "center",
        });
        const textEntry = new ChatTextEntry({
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
        const toolbar = this.gp.getDockedItems
            ? this.gp.getDockedItems("toolbar[dock=top]")[0]
            : this.gp.getTopToolbar
              ? this.gp.getTopToolbar()
              : null;
        if (!toolbar || !toolbar.items || !toolbar.items.each) {
            return;
        }

        const labelsToRemove = new Set(["Hide IEMBot", "Mute Sounds"]);
        const itemsToRemove = [];
        toolbar.items.each((item) => {
            if (item && labelsToRemove.has(item.text)) {
                itemsToRemove.push(item);
            }
        });

        itemsToRemove.forEach((item) => {
            toolbar.remove(item, true);
        });

        const retryFailedBtn = toolbar.getComponent("retryFailedBtn");
        if (retryFailedBtn) {
            retryFailedBtn.show();
        }

        if (toolbar.doLayout) {
            toolbar.doLayout();
        }
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
            text: "Room Users",
            expanded: true,
        };
        const iconfig = {
            plugins: new DataTip({
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

        MUCRoomUsers.superclass.initComponent.apply(this, arguments);

        // Robustly update the title with the number of people in the room
        const updateTitle = () => {
            const root = this.getRootNode && this.getRootNode();
            let count = 0;
            if (root && root.childNodes) {
                // Only count visible, non-placeholder nodes
                count = root.childNodes.filter(function (n) {
                    return n && n.data && n.data.jid;
                }).length;
            }
            this.setTitle(`${count} people in room`);
        };

        // Listen for node and store events
        const rootNode = this.getRootNode && this.getRootNode();
        if (rootNode) {
            rootNode.on("append", updateTitle, this);
            rootNode.on("remove", updateTitle, this);
        }
        if (this.getStore && this.getStore()) {
            this.getStore().on("add", updateTitle, this);
            this.getStore().on("remove", updateTitle, this);
        }
        updateTitle();
    },
});

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

const ChatTextEntry = Ext.extend(Ext.Panel, {
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
                    background: "#" + getPreference("bgcolor", "FFFFFF"),
                    color: "#" + getPreference("fgcolor", "000000"),
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
                    const bgcolor = getPreference("bgcolor", "FFFFFF");
                    const fgcolor = getPreference("fgcolor", "000000");

                    /* allchat */
                    if (this.ownerCt.ownerCt.chatType === "allchats") {
                        txt.emptyText = "";
                        txt.setValue("");
                        new Application.AllChatMessageWindow({
                            message: Application.replaceURLWithHTMLLinks(text),
                        }).show();
                    } else {
                        const chatPanel = this.ownerCt.ownerCt;
                        const chatType = chatPanel.chatType;
                        const { msg, messageId } = createOutgoingMessageStanza(
                            chatPanel,
                            text,
                            fgcolor,
                            bgcolor,
                        );
                        Application.XMPPConn.send(msg);
                        txt.setValue("");
                        txt.focus();

                        // Since we don't get our messages back via XMPP
                        // we need to manually add to the store
                        if (chatType === "chat") {
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
                                stanza_id: messageId,
                                delivery_status: "sent",
                                raw_message: text,
                            });
                        }
                    }
                },
            },
        ];
        ChatTextEntry.superclass.initComponent.apply(this, arguments);
    },
});

Application.msgFormatter = new Ext.XTemplate(
    '<p class="mymessage">',
    '<span class="{[values.me === values.author ? "author-me" : this.getAuthorClass(values.jid)]}" style="{[values.me === values.author ? "" : this.getAuthorStyle(values.author)]}">(',
    '<tpl if="this.isNotToday(ts)">',
    '{ts:date("d M")} ',
    "</tpl>",
    '{ts:date("g:i A")}) ',
    '<tpl if="values.room != null">',
    "[{room}] ",
    "</tpl>",
    "{author}",
    '<tpl if="values.me === values.author && values.delivery_status">',
    '<span style="font-size: 0.85em; margin-left: 6px; opacity: 0.8; {[this.getDeliveryStyle(values.delivery_status)]}">{[this.getDeliveryLabel(values.delivery_status)]}</span>',
    '</tpl>',
    ":</span> ",
    "{message}</p>",
    {
        isNotToday: function (ts) {
            // Use Ext.Date.format for date formatting
            const today = new Date();
            return Ext.Date.format(today, "md") !== Ext.Date.format(ts, "md");
        },
        getAuthorClass: function (jid) {
            //console.log("node: "+Strophe.getNodeFromJid(jid) );
            if (jid === null || typeof jid === "undefined") {
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
        getAuthorStyle: function (author) {
            if (
                !Application.getUserColor ||
                typeof Application.getUserColor !== "function"
            ) {
                return "";
            }
            const userColor = Application.getUserColor(author) || "000000";
            return `color: #${userColor};`;
        },
        getDeliveryLabel: function (deliveryStatus) {
            if (deliveryStatus === "delivered") {
                return "✓✓";
            }
            if (deliveryStatus === "sent") {
                return "✓";
            }
            if (deliveryStatus === "failed") {
                return "⚠";
            }
            return "";
        },
        getDeliveryStyle: function (deliveryStatus) {
            if (deliveryStatus === "failed") {
                return "color: #cc0000;";
            }
            return "";
        },
    },
);

const ChatGridPanel = Ext.extend(Ext.grid.GridPanel, {
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
            handler: (btn) => {
                btn.ownerCt.ownerCt.getStore().removeAll();
            },
        },
        {
            text: "Print Log",
            icon: "icons/print.png",
            cls: "x-btn-text-icon",
            handler: (btn) => {
                printGrid(btn.ownerCt.ownerCt);
            },
        },
        {
            text: "View As HTML",
            handler: (btn) => {
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
                    setPreference(pref, "true");
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
                    setPreference(pref, "true");
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
            itemId: "retryFailedBtn",
            text: "Retry Failed",
            hidden: true,
            handler: function (btn) {
                const grid = btn.ownerCt && btn.ownerCt.ownerCt;
                const panel = grid && grid.ownerCt;
                const store = grid && grid.getStore ? grid.getStore() : null;
                retryFailedDirectMessages(panel, store);
            },
        },
        {
            icon: "icons/font-less.png",
            handler: function () {
                const size = parseInt(getPreference("font-size", 14)) - 2;
                setPreference("font-size", size);
                //var cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
                const cssfmt = `normal ${size}px arial`;
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
                const size = parseInt(getPreference("font-size", 14)) + 2;
                setPreference("font-size", size);
                const cssfmt = `normal ${size}px arial`;
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
        this.columns = [
            {
                header: "Author",
                sortable: true,
                dataIndex: "author",
                hidden: true,
            },
            {
                // Removed id: "message" to avoid duplicate component id errors
                header: "Message",
                sortable: true,
                dataIndex: "ts",
                flex: 1,
                renderer: function (_value, _p, record) {
                    const parentPanel = this.ownerCt;
                    const data = {
                        author: record.get("author"),
                        message: record.get("message"),
                        ts: record.get("ts"),
                        room: record.get("room"),
                        jid: record.get("jid"),
                        delivery_status: record.get("delivery_status"),
                        me: parentPanel ? parentPanel.handle : null,
                    };
                    const html = Application.msgFormatter.apply(data);
                    return html;
                },
            },
        ];
        const scrollToLatest = () => {
            const gridView = this.getView && this.getView();
            const gridStore = this.getStore && this.getStore();
            if (!gridView || !gridStore || gridStore.getCount() === 0) {
                return;
            }
            Ext.defer(
                function () {
                    const viewInner = this.getView && this.getView();
                    const storeInner = this.getStore && this.getStore();
                    if (
                        !viewInner ||
                        !storeInner ||
                        storeInner.getCount() === 0
                    ) {
                        return;
                    }
                    const lastIndex = storeInner.getCount() - 1;
                    if (viewInner.focusRow) {
                        viewInner.focusRow(lastIndex);
                    } else if (viewInner.el && viewInner.el.dom) {
                        viewInner.el.dom.scrollTop =
                            viewInner.el.dom.scrollHeight;
                    }
                },
                50,
                this,
            );
        };

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
                "stanza_id",
                "delivery_status",
                "raw_message",
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
                    const messageText = records[i].get("message");
                    const handle = this.ownerCt && this.ownerCt.handle;
                    if (
                        typeof messageText === "string" &&
                        messageText.match(/tornado/i)
                    ) {
                        msgBus.fire("soundevent", "tornado");
                    }
                    // TODO: figure out how to make this case insensitive
                    if (
                        typeof messageText === "string" &&
                        handle &&
                        messageText.match(handle)
                    ) {
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
        this.store.on(
            "add",
            function () {
                scrollToLatest();
            },
            this,
        );
        this.store.on(
            "datachanged",
            function () {
                scrollToLatest();
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
                render: function (p) {
                    scrollToLatest();
                    const viewEl = p.getView().getEl();
                    if (viewEl) {
                        viewEl.on("mousedown", function (e, t) {
                            if (t.tagName === "A") {
                                e.stopEvent();
                                t.target = "_blank";
                                t.rel = "noopener noreferrer";
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
                            t.rel = "noopener noreferrer";
                            hideTextWindow();
                        },
                        click: function (e, t) {
                            if (String(t.target).toLowerCase() !== "_blank") {
                                e.stopEvent();
                                open(
                                    t.href,
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                            }
                            hideTextWindow();
                        },
                        delegate: "a",
                    });
                },
            },
        };
        Ext.apply(this, iconfig);

        ChatGridPanel.superclass.initComponent.apply(this, arguments);

        /*
         * this.view = new Ext.grid.GridView({ cellTpl: new Ext.Template( '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div
         * class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"
         * {attr}>{value}</div>', '</td>' ) });
         */
    },
});

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
const DDTabPanel = Ext.extend(Ext.TabPanel, {
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
        DDTabPanel.superclass.initComponent.call(this);
        // In ExtJS 6, addEvents is not needed - Observable automatically supports any event
        // this.addEvents('reorder');
        if (!this.ddGroupId) {
            this.ddGroupId =
                "dd-tabpanel-group-" + DDTabPanel.superclass.getId.call(this);
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
        DDTabPanel.superclass.afterRender.call(this);
        // Create a drop arrow indicator
        this.arrow = Ext.DomHelper.append(
            Ext.getBody(),
            '<div class="dd-arrow-down"></div>',
            true,
        );
        this.arrow.hide();
        // Create a drop target for this tab panel
        const tabsDDGroup = this.ddGroupId;
        this.dd = new DDTabPanel.DropTarget(this, {
            ddGroup: tabsDDGroup,
        });

        // needed for the onRemove-Listener
        this.move = false;
    },

    // Init the drag source after (!) rendering the tab
    /** @private */
    initTab: function (tab, index) {
        DDTabPanel.superclass.initTab.call(this, tab, index);

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
        DDTabPanel.superclass.onRemove.call(this, c);

        if (this.stack) {
            this.stack.remove(c);
        }
        delete c.tabEl;
        // Removed c.un(...) calls for listeners that may not have been added, to prevent ExtJS errors

        // Only manage active tab if this panel is still rendered and not being destroyed
        if (c === this.activeTab && !this.destroying && !this.destroyed) {
            const isPanelInDom =
                this.el && this.el.dom && document.body.contains(this.el.dom);
            const isTabBarInDom =
                this.tabBar &&
                this.tabBar.el &&
                this.tabBar.el.dom &&
                document.body.contains(this.tabBar.el.dom);
            if (!isPanelInDom || !isTabBarInDom) {
                this.activeTab = null;
                return;
            }
            if (!this.move) {
                const next = this.stack ? this.stack.next() : null;
                if (next) {
                    Ext.defer(() => {
                        try {
                            if (
                                !this.destroyed &&
                                this.items.contains(next) &&
                                this.el &&
                                this.el.dom &&
                                document.body.contains(this.el.dom)
                            ) {
                                this.setActiveTab(next);
                            }
                        } catch {
                            // Defensive: prevent UI lockup if ExtJS throws
                            this.activeTab = null;
                        }
                    }, 1);
                } else if (this.items.getCount() > 0) {
                    Ext.defer(() => {
                        try {
                            if (
                                !this.destroyed &&
                                this.items.getCount() > 0 &&
                                this.el &&
                                this.el.dom &&
                                document.body.contains(this.el.dom)
                            ) {
                                this.setActiveTab(0);
                            }
                        } catch {
                            this.activeTab = null;
                        }
                    }, 1);
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
        DDTabPanel.superclass.onDestroy.call(this);
    },
});

// Ext.ux.panel.DDTabPanel.DropTarget
// Implements the drop behavior of the tab panel
/** @private */
DDTabPanel.DropTarget = Ext.extend(Ext.dd.DropTarget, {
    constructor: function (tabpanel, iconfig) {
        this.tabpanel = tabpanel;
        // In ExtJS 6, get the tab bar element instead of stripWrap
        const targetEl = tabpanel.tabBar ? tabpanel.tabBar.el : tabpanel.el;
        DDTabPanel.DropTarget.superclass.constructor.call(
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

Application.ChatTabPanel = Ext.extend(DDTabPanel, {
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
        const helpElement = document.getElementById("help");
        const helpHtml = helpElement ? helpElement.innerHTML : "";
        this.add({
            html: helpHtml,
            title: "Help",
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
        // Defer removal to next event loop to avoid ExtJS DOM race conditions
        Ext.defer(() => {
            if (mcp.close && !mcp.destroyed) {
                mcp.close();
            } else if (!mcp.destroyed) {
                this.remove(mcp, true);
            }
        }, 1);
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
        // Defer removal to next event loop to avoid ExtJS DOM race conditions
        Ext.defer(() => {
            if (cp.close && !cp.destroyed) {
                cp.close();
            } else if (!cp.destroyed) {
                this.remove(cp, true);
            }
        }, 1);
    },
});
