import { msgBus } from "../events/MsgBus.js";
import { $iq } from "strophe.js";
import { LiveConfig } from "../config.js";
import { syncPreferences, setPreference } from "../xmpp/handlers.js";
import { playSound } from '../events/event-handlers.js';


Application.saveViews = function () {
    const stanza = $iq({
        type: "set",
        id: "_set1",
    })
        .c("query", {
            xmlns: "jabber:iq:private",
        })
        .c("storage", {
            xmlns: "nwschatlive:views",
        });
    for (let i = 1; i < 6; i++) {
        const bnds = Ext.getCmp("mfv" + i).bounds;
        if (bnds) {
            stanza
                .c("view", {
                    label: Ext.getCmp("mfv" + i).getValue(),
                    bounds:
                        bnds.left +
                        "," +
                        bnds.bottom +
                        "," +
                        bnds.right +
                        "," +
                        bnds.top,
                })
                .up();
        }
    }
    Application.XMPPConn.sendIQ(stanza.tree());
};

export function saveBookmarks() {
    /* Save bookmarks to the server, please */
    const bookmarksTree = Ext.getCmp("bookmarks");
    const root = bookmarksTree ? bookmarksTree.getRootNode() : null;
    if (!root) {
        return;
    }

    const stanza = $iq({
        type: "set",
        id: "_set1",
    })
        .c("query", {
            xmlns: "jabber:iq:private",
        })
        .c("storage", {
            xmlns: "storage:bookmarks",
        });
    root.eachChild(function (n) {
        this.c("conference", {
            name: n.data.alias,
            anonymous: n.data.anonymous ? "true" : "false",
            autojoin: n.data.autojoin ? "true" : "false",
            jid: n.data.jid,
        })
            .c("nick", n.data.handle)
            .up()
            .up();
    }, stanza);
    Application.XMPPConn.sendIQ(stanza.tree());
}

Ext.util.Format.comboRenderer = function (combo) {
    return function (value) {
        const record = combo.findRecord(combo.valueField, value);
        return record
            ? record.get(combo.displayField)
            : combo.valueNotFoundText;
    };
};
Application.SoundStore = new Ext.data.ArrayStore({
    fields: ["id", "label", "src"],
    data: [
        ["default", "Default", "sounds/message_new.mp3"],
        ["bleep", "Bleep", "sounds/bleep.mp3"],
        ["cow", "Cow (Mooo!)", "sounds/cow.mp3"],
        ["doorbell", "Door Bell", "sounds/doorbell.mp3"],
        ["eas", "EAS Beep", "sounds/eas.mp3"],
        ["elevator", "Elevator", "sounds/elevator.mp3"],
    ],
});

const combo = new Ext.form.ComboBox({
    typeAhead: false,
    triggerAction: "all",
    lazyRender: true,
    mode: "local",
    store: Application.SoundStore,
    listeners: {
        change: function (_field, newVal) {
            playSound(newVal);
        },
    },
    valueField: "id",
    displayField: "label",
});

Application.soundPrefs = new Ext.Window({
    title: "Sound Preferences",
    width: 500,
    height: 300,
    closeAction: "hide",
    layout: "form",
    buttons: [
        {
            text: "Save Sound Settings",
            handler: function () {
                Ext.getCmp("soundpanel")
                    .getStore()
                    .each(function (record) {
                        const eidx = record.get("id");
                        setPreference(
                            "sound::" + eidx + "::enabled",
                            record.get("enabled") ? "true" : "false"
                        );
                        setPreference(
                            "sound::" + eidx + "::sound",
                            record.get("sound")
                        );
                    });
                Application.soundPrefs.hide();
                syncPreferences();
            },
        },
    ],
    items: [
        {
            xtype: "slider",
            id: "volume",
            minValue: 0,
            maxValue: 100,
            value: 50,
            width: 200,
            listeners: {
                changecomplete: function (_slider, newval) {
                    setPreference("volume", newval);
                    msgBus.fire("soundevent", "default");
                },
            },
            fieldLabel: "Volume",
        },
        new Ext.grid.Panel({
            store: new Ext.data.ArrayStore({
                data: [
                    [
                        "new_message",
                        "New Message (Non IEMBot)",
                        true,
                        "default",
                    ],
                    ["new_conversation", "New Conversation", true, "doorbell"],
                    ["iembot", "IEMBot Message", true, "default"],
                    ["myhandle", "Message with your name in it", true, "bleep"],
                    [
                        "tornado",
                        'Message with "Tornado" within text',
                        true,
                        "eas",
                    ],
                ],
                fields: [
                    {
                        name: "id",
                        type: "string",
                    },
                    {
                        name: "label",
                        type: "string",
                    },
                    {
                        name: "enabled",
                        type: "bool",
                    },
                    {
                        name: "sound",
                        type: "string",
                    },
                ],
                sortInfo: {
                    field: "label",
                    direction: "ASC",
                },
            }),
            columns: [
                {
                    dataIndex: "enabled",
                    text: "Enable",
                    xtype: "checkcolumn",
                },
                {
                    dataIndex: "label",
                    text: "Event Type",
                    sortable: true,
                    flex: 1,
                },
                {
                    dataIndex: "sound",
                    text: "Sound",
                    renderer: Ext.util.Format.comboRenderer(combo),
                    editor: combo,
                },
            ],
            id: "soundpanel",
            title: "Sound Events",
            frame: true,
            stripeRows: true,
            height: 200,
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
        }),
    ],
});

Application.boundsFavorites = new Ext.Window({
    title: "Map View Favorites",
    width: 500,
    height: 300,
    closeAction: "hide",
    layout: "table",
    layoutConfig: {
        columns: 4,
    },
    autoScroll: true,
    buttons: [
        {
            text: "Save Settings",
            handler: function () {
                for (let i = 1; i < 6; i++) {
                    const nval = Ext.getCmp("mfv" + i).getValue();
                    if (nval !== "") {
                        Ext.getCmp("fm" + i).setText(nval);
                    }
                }
                Application.boundsFavorites.hide();
            },
        },
    ],
    items: [
        {
            html:
                "This form allows you to modify the 5 allowed map extent" +
                " favorites. The first favorite will be your default view" +
                " when you log in and for the star icon above.",
            colspan: 4,
        },
        {
            html: "#1",
        },
        {
            xtype: "textfield",
            id: "mfv1",
            bounds: null,
            width: 200,
        },
        {
            xtype: "button",
            text: "Set From Current View",
            handler: function () {
                Ext.getCmp("mfv1").bounds = Ext.getCmp("map").map.getExtent();
                Application.saveViews();
            },
        },
        {
            xtype: "button",
            text: "View",
            handler: function () {
                const bnds = Ext.getCmp("mfv1").bounds;
                if (bnds) {
                    Ext.getCmp("map").map.zoomToExtent(bnds, true);
                }
            },
        },
        {
            html: "#2",
        },
        {
            xtype: "textfield",
            id: "mfv2",
            bounds: null,
            width: 200,
        },
        {
            xtype: "button",
            text: "Set From Current View",
            handler: function () {
                Ext.getCmp("mfv2").bounds = Ext.getCmp("map").map.getExtent();
                Application.saveViews();
            },
        },
        {
            xtype: "button",
            text: "View",
            handler: function () {
                const bnds = Ext.getCmp("mfv2").bounds;
                if (bnds) {
                    Ext.getCmp("map").map.zoomToExtent(bnds, true);
                }
            },
        },
        {
            html: "#3",
        },
        {
            xtype: "textfield",
            id: "mfv3",
            bounds: null,
            width: 200,
        },
        {
            xtype: "button",
            text: "Set From Current View",
            handler: function () {
                Ext.getCmp("mfv3").bounds = Ext.getCmp("map").map.getExtent();
                Application.saveViews();
            },
        },
        {
            xtype: "button",
            text: "View",
            handler: function () {
                const bnds = Ext.getCmp("mfv3").bounds;
                if (bnds) {
                    Ext.getCmp("map").map.zoomToExtent(bnds, true);
                }
            },
        },
        {
            html: "#4",
        },
        {
            xtype: "textfield",
            id: "mfv4",
            bounds: null,
            width: 200,
        },
        {
            xtype: "button",
            text: "Set From Current View",
            handler: function () {
                Ext.getCmp("mfv4").bounds = Ext.getCmp("map").map.getExtent();
                Application.saveViews();
            },
        },
        {
            xtype: "button",
            text: "View",
            handler: function () {
                const bnds = Ext.getCmp("mfv4").bounds;
                if (bnds) {
                    Ext.getCmp("map").map.zoomToExtent(bnds, true);
                }
            },
        },
        {
            html: "#5",
        },
        {
            xtype: "textfield",
            id: "mfv5",
            bounds: null,
            width: 200,
        },
        {
            xtype: "button",
            text: "Set From Current View",
            handler: function () {
                Ext.getCmp("mfv5").bounds = Ext.getCmp("map").map.getExtent();
                Application.saveViews();
            },
        },
        {
            xtype: "button",
            text: "View",
            handler: function () {
                const bnds = Ext.getCmp("mfv5").bounds;
                if (bnds) {
                    Ext.getCmp("map").map.zoomToExtent(bnds, true);
                }
            },
        },
    ],
});

const mucform = new Ext.form.FormPanel({
    labelWidth: 200,
    padding: 5,
    items: [
        {
            xtype: "textfield",
            allowBlank: false,
            name: "roomname",
            fieldLabel: "Room Name",
        },
        {
            xtype: "textfield",
            allowBlank: false,
            name: "roomhandle",
            value: Application.USERNAME,
            fieldLabel: "Chat Handle",
        },
        {
            xtype: "checkbox",
            name: "bookmark",
            fieldLabel: "Save Bookmark for Chatroom?",
            handler: function (cb, val) {
                if (val) {
                    mucform.getForm().findField("roomalias").enable();
                } else {
                    mucform.getForm().findField("roomalias").disable();
                }
            },
        },
        {
            xtype: "textfield",
            name: "roomalias",
            fieldLabel: "Bookmark Alias (optional)",
            disabled: true,
        },
        {
            xtype: "checkbox",
            name: "anonymous",
            fieldLabel: "Anonymously Monitor (read-only)",
        },
        {
            xtype: "checkbox",
            name: "autojoin",
            fieldLabel: "Auto Join Room after Login",
        },
    ],
    listeners: {
        render: function () {
            const h = mucform.getForm().findField("roomhandle").getValue();
            if (!h) {
                mucform
                    .getForm()
                    .findField("roomhandle")
                    .setValue(Application.USERNAME);
            }
        },
    },
});

const privform = new Ext.form.FormPanel({
    labelWidth: 100,
    padding: 5,
    items: [
        {
            xtype: "textfield",
            fieldLabel: "User Name",
            emptyText: "media-joe.blow",
            name: "username",
        },
    ],
});

Application.CreatePrivateChat = new Ext.Window({
    width: 400,
    title: "Chat with User",
    items: [privform],
    buttons: [
        {
            xtype: "button",
            text: "Start Chat",
            scope: privform,
            handler: function () {
                let barejid = this.getForm().findField("username").getValue();
                if (barejid.indexOf("@") === -1) {
                    barejid = barejid + "@" + LiveConfig.XMPPHOST;
                }
                Application.CreatePrivateChat.hide();
                let cp = Ext.getCmp("chatpanel").getChat(barejid);
                if (!cp) {
                    cp = Ext.getCmp("chatpanel").addChat(barejid);
                }
                Ext.getCmp("chatpanel").setActiveTab(cp);
            },
        },
        {
            xtype: "button",
            text: "Cancel",
            handler: function () {
                Application.CreatePrivateChat.hide();
            },
        },
    ],
});

Application.JoinChatroomDialog = new Ext.Window({
    width: 400,
    title: "Join a Group Chat",
    items: [mucform],
    buttons: [
        {
            xtype: "button",
            text: "Join Room",
            scope: mucform,
            handler: function () {
                const roomname = this.getForm()
                    .findField("roomname")
                    .getValue();
                const room = roomname + "@conference." + LiveConfig.XMPPHOST;
                const handle = this.getForm()
                    .findField("roomhandle")
                    .getValue();
                const ibook = this.getForm().findField("bookmark").getValue();
                const anonymous = this.getForm()
                    .findField("anonymous")
                    .getValue();
                const autojoin = this.getForm()
                    .findField("autojoin")
                    .getValue();
                /* Add XMPP MUC Bookmark */
                if (ibook) {
                    let alias = this.getForm()
                        .findField("roomalias")
                        .getValue();
                    if (alias === "") {
                        alias = roomname;
                    }
                    /* Add to bookmarks widget */
                    const bookmarksTree = Ext.getCmp("bookmarks");
                    if (bookmarksTree && bookmarksTree.getRootNode()) {
                        bookmarksTree.getRootNode().appendChild({
                        text: alias + " (" + roomname + ")",
                        jid: room,
                        alias: alias,
                        anonymous: anonymous,
                        autojoin: autojoin,
                        icon: "/icons/chat.png",
                        handle: handle,
                        leaf: true,
                        });
                    }
                }
                msgBus.fire(
                    "joinchat",
                    room,
                    handle,
                    anonymous
                );
                Application.JoinChatroomDialog.hide();
            },
        },
        {
            xtype: "button",
            text: "Cancel",
            handler: function () {
                Application.JoinChatroomDialog.hide();
            },
        },
    ],
});

Application.msgtpl = new Ext.XTemplate(
    '<p>{date:date("g:i:s A")} :: {msg}</p>'
);

Application.log = function (text) {
    Ext.getCmp("debug").addMessage(text);
};
