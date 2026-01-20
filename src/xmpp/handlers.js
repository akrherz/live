/**
 * XMPP Protocol Handlers
 * Connection, message, presence, roster, and IQ handlers
 */

import { $iq, $pres, Strophe } from "strophe.js";
import WKT from "ol/format/WKT";
import { UTCStringToDate } from "../events/event-handlers.js";
import { onBuddyPresence } from "../chat/ChatComponents.js";
import { iembotFilter } from "../utils/grid-utilities.js";
import { doLogin } from "../core/app-control.js";
import { LiveConfig } from "../config.js";


function buildXMPP() {
    Application.log("Initializing XMPPConn Obj");
    Application.XMPPConn = new Strophe.Connection(LiveConfig.BOSH);
    Application.XMPPConn.disco.addFeature(
        "http://jabber.org/protocol/chatstates"
    );
}

/*
 * Called when we wish to login!
 *
 * @param {string} username The username
 * @param {string} password The password
 */
function login(username, password) {
    const jid =
        username + "@" + LiveConfig.XMPPHOST + "/" + LiveConfig.XMPPRESOURCE;
    if (typeof Application.XMPPConn === "undefined") {
        buildXMPP();
    }
    Application.XMPPConn.connect(
        jid,
        password,
        onConnect,
        60,
        1,
        Application.ROUTE
    );
};

// Anonymous Login!
function doAnonymousLogin() {
    if (typeof Application.XMPPConn === "undefined") {
        buildXMPP();
    }
    Application.XMPPConn.connect(LiveConfig.XMPPHOST, null, onConnect);
};

// Registration!
Application.register = function () {
    if (typeof Application.XMPPConn === "undefined") {
        buildXMPP();
    }
    const callback = function (status) {
        if (status === Strophe.Status.REGISTER) {
            Application.log("Strophe.Status.REGISTER");
            Application.XMPPConn.register.fields.username =
                Ext.get("reguser").getValue();
            Application.XMPPConn.register.fields.password =
                Ext.get("regpass").getValue();
            Application.XMPPConn.register.fields.email =
                Ext.get("regemail").getValue();
            Application.XMPPConn.register.submit();
        } else if (status === Strophe.Status.REGISTERED) {
            Application.log(
                "Username " +
                    Application.XMPPConn.register.fields.username +
                    " registered with server ..."
            );
            Ext.getCmp("loginwindow").items.items[0].activate(0);
            document.getElementById("username").value =
                Application.XMPPConn.register.fields.username;
            document.getElementById("password").value =
                Application.XMPPConn.register.fields.password;
            Application.XMPPConn.disconnect();
            doLogin();
        } else if (status === Strophe.Status.CONFLICT) {
            Application.log("Contact already existed!");
        } else if (status === Strophe.Status.NOTACCEPTABLE) {
            Application.log("Registration form not properly filled out.");
        } else if (status === Strophe.Status.REGIFAIL) {
            Application.log("The Server does not support In-Band Registration");
        } else if (status === Strophe.Status.CONNECTED) {
            Application.log("connected?");
            Application.USERNAME = Strophe.getNodeFromJid(
                Application.XMPPConn.jid
            );
            // do something after successful authentication
        } else {
            Application.log(status);
            // Do other stuff
        }
    };
    Application.XMPPConn.register.connect(LiveConfig.XMPPHOST, callback);
};

/*
 * Handle Strophe Connection Changes, we need to account for the following 1.
 * User is attempting to log in 2. User gets forced logged out via some failure
 * 3. User wants to log out...
 */
function onConnect(status) {
    if (status === Strophe.Status.CONNECTING) {
        Application.log("Strophe.Status.CONNECTING...");
    } else if (status === Strophe.Status.ERROR) {
        Application.log("Strophe.Status.ERROR...");
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status === Strophe.Status.AUTHFAIL) {
        Application.log("Strophe.Status.AUTHFAIL...");
        Application.RECONNECT = false;
        Ext.getCmp("loginpanel").addMessage(
            "Authentication failed, please check username and password..."
        );
        Application.XMPPConn.disconnect();
    } else if (status === Strophe.Status.CONNFAIL) {
        Application.log("Strophe.Status.CONNFAIL...");
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status === Strophe.Status.DISCONNECTED) {
        Application.log("Strophe.Status.DISCONNECTED...");
        Application.MsgBus.fireEvent("loggingout");
        if (Application.RECONNECT) {
            /* Lets wait 5 seconds before trying to reconnect */
            Application.log("Relogging in after 3 seconds delay");
            Ext.defer(doLogin, 3000, this);
        } else {
            Application.MsgBus.fireEvent("loggedout");
        }
    } else if (status === Strophe.Status.AUTHENTICATING) {
        Application.log("Strophe.Status.AUTHENTICATING...");
    } else if (status === Strophe.Status.DISCONNECTING) {
        Application.log("Strophe.Status.DISCONNECTING...");
        Application.XMPPConn.flush();
        //Application.XMPPConn.disconnect();
    } else if (status === Strophe.Status.ATTACHED) {
        Application.log("Strophe.Status.ATTACHED...");
    } else if (status === Strophe.Status.CONNECTED) {
        Application.log("Strophe.Status.CONNECTED...");
        Application.USERNAME = Strophe.getNodeFromJid(Application.XMPPConn.jid);
        Application.RECONNECT = true;

        /* Add Connection Handlers, removed on disconnect it seems */
        Application.XMPPConn.addHandler(
            onMessage,
            null,
            "message",
            null,
            null,
            null
        );
        Application.XMPPConn.addHandler(
            onPresence,
            null,
            "presence",
            null,
            null,
            null
        );
        Application.XMPPConn.addHandler(
            onRoster,
            Strophe.NS.ROSTER,
            "iq",
            null,
            null,
            null
        );
        Application.XMPPConn.addHandler(onIQ, null, "iq", null, null, null);

        /* Send request for roster */
        Application.XMPPConn.send(
            $iq({
                type: "get",
            })
                .c("query", {
                    xmlns: Strophe.NS.ROSTER,
                })
                .tree()
        );

        /* Attempt to re-establish already joined chatrooms */
        let rejoinedRooms = 0;
        Ext.getCmp("chatpanel").items.each(function (panel) {
            if (panel.chatType === "groupchat") {
                Application.log("Attempting to rejoin MUC: " + panel.barejid);
                const p = $pres({
                    to: panel.barejid + "/" + panel.handle,
                });
                if (panel.anonymous) {
                    p.c("x", {
                        xmlns: "http://jabber.org/protocol/muc#user",
                    })
                        .c("item")
                        .c("role", "visitor");
                }
                Ext.defer(function () {
                    Application.XMPPConn.send(this.p);
                }, 5000 * rejoinedRooms, {
                    p: p,
                });
                rejoinedRooms += 1;
            }
        });

        /* Send request for Live prefs */
        let stanza = $iq({
            type: "get",
            id: "_get3",
        })
            .c("query", {
                xmlns: "jabber:iq:private",
            })
            .c("storage", {
                xmlns: "nwschatlive:prefs",
            })
            .tree();
        Application.XMPPConn.sendIQ(stanza, parsePrefs);

        /* Send request for Live views */
        stanza = $iq({
            type: "get",
            id: "_get2",
        })
            .c("query", {
                xmlns: "jabber:iq:private",
            })
            .c("storage", {
                xmlns: "nwschatlive:views",
            })
            .tree();
        Application.XMPPConn.sendIQ(stanza, parseViews);

        Application.MsgBus.fireEvent("loggedin");
    }
}
/*
 * Update the map layers based on our stored preferences
 */
function updateMap() {
    const lstring = Application.getPreference("layers");
    if (lstring === null) {
        return;
    }
    const tokens = lstring.split("||");
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "") {
            continue;
        }
        const idx = Application.layerstore.find("title", tokens[i]);
        if (idx === -1) {
            continue;
        }
        Application.log("Setting Layer " + tokens[i] + " visable");
        const layer = Application.layerstore.getAt(idx).getLayer();
        layer.setVisibility(true);
    }
}

function setSounds() {
    Application.prefStore.each(function (record) {
        const key = record.get("key");
        if (key === "volume") {
            Ext.getCmp("volume").setValue(record.get("value"));
            return;
        }
        if (key.indexOf("sound::") !== 0) {
            return;
        }
        const tokens = key.split("::");
        if (tokens.length !== 3) {
            return;
        }
        const sidx = tokens[1];
        const opt = tokens[2];
        const store = Ext.getCmp("soundpanel").getStore();
        const idx = store.find("id", sidx);
        if (idx > -1) {
            const lrecord = store.getAt(idx);
            let val = record.get("value");
            if (val === "true") {
                val = true;
            }
            if (val === "false") {
                val = false;
            }
            lrecord.set(opt, val);
        }
    });
}

/*
 * Parse preferences stored on the server side, please
 */
function parsePrefs(msg) {
    Application.prefStore.removeAll();
    const elem = msg.getElementsByTagName("pref");
    for (let i = 0; i < elem.length; i++) {
        const key = elem[i].getAttribute("key");
        const value = elem[i].getAttribute("value");
        Application.setPreference(key, value);
    }
    Application.prefStore.locked = true;
    setSounds();
    const size = parseInt(Application.getPreference("font-size", 14)) + 2;
    // var cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
    const cssfmt = String.format("normal {0}px arial", size);
    Ext.util.CSS.updateRule("td.x-grid3-td-message", "font", cssfmt);
    Ext.util.CSS.updateRule(".message-entry-box", "font", cssfmt);
    updateMap();
    Application.updateColors();
    Application.prefStore.locked = false;
}

function parseViews(msg) {
    if (!Ext.getCmp("map")) {
        return;
    }
    const elem = msg.getElementsByTagName("view");
    for (let i = 0; i < elem.length; i++) {
        const label = elem[i].getAttribute("label");
        const bounds = elem[i].getAttribute("bounds");
        if (label !== "") {
            Ext.getCmp("mfv" + (i + 1)).setValue(label);
            Ext.getCmp("fm" + (i + 1)).setText(label);
        }
        const extent = bounds.split(",").map(Number);
        Ext.getCmp("mfv" + (i + 1)).bounds = extent;
        if (i === 0) {
            const mapPanel = Ext.getCmp("map");
            const map = mapPanel ? mapPanel.map : window.olMap;
            if (map && map.getView) {
                map.getView().fit(extent, { size: map.getSize() });
            }
        }
    }
}

function parseBookmarks(msg) {
    const elem = msg.getElementsByTagName("conference");
    let autoJoinedRooms = 0;
    for (let i = 0; i < elem.length; i++) {
        const alias = elem[i].getAttribute("name");
        const jid = elem[i].getAttribute("jid");
        let nick = elem[i].getElementsByTagName("nick")[0]
            ? elem[i].getElementsByTagName("nick")[0].textContent
            : "";
        if (nick === null || nick === "") {
            nick = Application.USERNAME;
        }
        const anonymous = elem[i].getAttribute("anonymous") === "true";
        const autojoin = elem[i].getAttribute("autojoin") === "true";

        const bookmarksTree = Ext.getCmp("bookmarks");
        if (bookmarksTree && bookmarksTree.getRootNode()) {
            bookmarksTree.getRootNode().appendChild({
            text: alias + " (" + Strophe.getNodeFromJid(jid) + ")",
            jid: jid,
            alias: alias,
            autojoin: autojoin,
            iconCls: "chatroom-icon",
            handle: nick,
            anonymous: anonymous,
            leaf: true,
            });
        }
        if (autojoin && Ext.getCmp("chatpanel").getMUC(jid) === null) {
            /*
             * We need to slow down the loading of chatrooms as this can be
             * a very expensive browser operation, IE will complain about
             * unresponsive script.
             */
            Application.log("Autojoining MUC: " + jid);
            Ext.defer(function () {
                Application.MsgBus.fireEvent(
                    "joinchat",
                    this.jid,
                    this.nick,
                    this.anonymous
                );
            }, 5000 * autoJoinedRooms, {
                jid: jid,
                nick: nick,
                anonymous: anonymous,
            });
            autoJoinedRooms += 1;
        }
    }
    const bookmarksTree = Ext.getCmp("bookmarks");
    if (bookmarksTree && bookmarksTree.getRootNode()) {
        bookmarksTree.getRootNode().initialLoad = true;
    }
}

function onIQ(msg) {
    try {
        iqParser(msg);
    } catch (err) {
        console.error("IQ Bug:", err);
        console.error("Stack trace:", err.stack);
        console.error("Message:", Strophe.serialize(msg));
        Application.log("IQ Bug - see console for details: " + err.message);
    }
    return true;
}

function iqParser(msg) {
    if (msg.getAttribute("id") === "fetchrooms") {
        const items = msg.firstChild.getElementsByTagName("item");
        const tree = Ext.getCmp("chatrooms");
        const rootNode = tree ? tree.getRootNode() : null;

        if (rootNode) {
            const rooms = [];
            for (let i = 0; i < items.length; i++) {
                const name = items[i].getAttribute("name") || "";
                const room = Strophe.getNodeFromJid(
                    items[i].getAttribute("jid")
                );
                rooms.push({
                    text: name + " (" + room + ")",
                    name: name,
                    room: room,
                    jid: items[i].getAttribute("jid"),
                    iconCls: "chatroom-icon",
                    leaf: true,
                });
            }

            rooms.sort(function (a, b) {
                const left = (a.name || a.room || "").toLowerCase();
                const right = (b.name || b.room || "").toLowerCase();
                if (left < right) {
                    return -1;
                }
                if (left > right) {
                    return 1;
                }
                return 0;
            });

            rootNode.removeAll();
            rootNode.appendChild(rooms);
        }
    }
}

function onRoster(msg) {
    try {
        rosterParser(msg);
    } catch (err) {
        let vDebug = "Roster Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize(msg)) + "\n";
        for (const prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function rosterParser(msg) {
    const root = Ext.getCmp("buddies").root;
    const roster_items = msg.getElementsByTagName("item");
    for (let i = 0; i < roster_items.length; i++) {
        /* Look to see if there is a group */
        const groups = roster_items[i].getElementsByTagName("group");
        for (let j = 0; j < groups.length; j++) {
            const group = groups[j];
            const child =
                root.findChild("group", group.textContent) ||
                root.appendChild({
                    leaf: false,
                    group: group.textContent,
                    text: group.textContent,
                    expanded: true,
                    loaded: true,
                });

            child.appendChild({
                text: roster_items[i].getAttribute("name"),
                barejid: roster_items[i].getAttribute("jid"),
                resources: new Ext.util.MixedCollection(),
                iconCls: "buddy-offline",
                presence: "offline",
                hidden: true,
                leaf: true,
            });
            // console.log("Buddy JID:"+ roster_items[i].getAttribute('jid')
            // +" Group:"+ group.text() );
        }
    }
    /* Send initial presence */
    Application.XMPPConn.send($pres().tree());
    /* Send request for private storage */
    const stanza = $iq({
        type: "get",
        id: "_get1",
    })
        .c("query", {
            xmlns: "jabber:iq:private",
        })
        .c("storage", {
            xmlns: "storage:bookmarks",
        })
        .tree();
    Ext.defer(function () {
        Application.XMPPConn.sendIQ(stanza, parseBookmarks);
    }, 3000, this);

    return true;
}

function onPresence(msg) {
    try {
        presenceParser(msg);
    } catch (err) {
        let vDebug = "Presence Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize(msg)) + "\n";
        for (const prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function getMUCIcon(affiliation) {
    if (affiliation === "owner") {
        return "icons/owner.png";
    }
    if (affiliation === "admin") {
        return "icons/admin.png";
    }
    return "icons/participant.png";
}

function presenceParser(msg) {
    const from = msg.getAttribute("from");

    // Lets see if this is from a chatroom!
    if (
        Strophe.getDomainFromJid(from) === LiveConfig.XMPPMUCHOST
    ) {
        const room = Strophe.getBareJidFromJid(from);
        const mcp = Ext.getCmp("chatpanel").getMUC(room);
        if (mcp === null) {
            Application.log(
                "ERROR: got presence from non-existant room: " + room
            );
            return;
        }
        function showRoomError(message, cleanupFn) {
            Ext.Msg.show({
                title: "Status",
                message: message,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO,
                fn: function () {
                    // Defer cleanup to avoid layout invalidation during modal teardown
                    Ext.defer(function () {
                        if (cleanupFn) {
                            cleanupFn();
                        }
                        if (Ext.resumeLayouts) {
                            Ext.resumeLayouts(true);
                        }
                    }, 10);
                },
            });
        }

        /* Look to see if we got a 201 status */
        let error = null;
        if (msg.getElementsByTagName("status").length > 0) {
            error = msg.getElementsByTagName("status");
            if (error[0].getAttribute("code") === "201") {
                showRoomError(
                    "Sorry, chatroom [" + room + "] does not exist.",
                    function () {
                        const chatPanel = Ext.getCmp("chatpanel");
                        if (chatPanel && chatPanel.getMUC(room)) {
                            chatPanel.removeMUC(room);
                        }
                    }
                );
                return;
            }
        }
        /* Look to see if we got a 407 error */
        if (msg.getElementsByTagName("error").length > 0) {
            error = msg.getElementsByTagName("error");
            if (error[0].getAttribute("code") === "407") {
                showRoomError(
                    "Sorry, your account is not authorized to access chatroom [" +
                        room +
                        "]",
                    function () {
                        const chatPanel = Ext.getCmp("chatpanel");
                        if (chatPanel && chatPanel.getMUC(room)) {
                            chatPanel.removeMUC(room);
                        }
                    }
                );
                return;
            }
        }
        /* Look to see if we got a 409 error */
        if (msg.getElementsByTagName("error").length > 0) {
            error = msg.getElementsByTagName("error");
            if (error[0].getAttribute("code") === "409") {
                showRoomError(
                    "Sorry, your requested chatroom handle is already in use by room [" +
                        room +
                        "]",
                    function () {
                        const chatPanel = Ext.getCmp("chatpanel");
                        if (chatPanel && chatPanel.getMUC(room)) {
                            chatPanel.removeMUC(room);
                        }
                    }
                );
                return;
            }
        }
        /* Look to see if we got a 307 error */
        if (msg.getElementsByTagName("status").length > 0) {
            error = msg.getElementsByTagName("status");
            if (error[0].getAttribute("code") === "307") {
                showRoomError(
                    "Your account signed into this chatroom [" +
                        room +
                        "] with the same handle from another location. Please use unique handles.",
                    function () {
                        mcp.joinedChat = false;
                        const chatPanel = Ext.getCmp("chatpanel");
                        if (chatPanel && chatPanel.getMUC(room)) {
                            chatPanel.removeMUC(room);
                        }
                    }
                );
                return;
            }
        }
        const roomUsersRoot = mcp.roomusers ? mcp.roomusers.getRootNode() : null;
        const child = roomUsersRoot ? roomUsersRoot.findChild(
            "text",
            Strophe.getResourceFromJid(from)
        ) : null;

        /* Look to see if we can see JIDs */
        const xitem = msg.getElementsByTagName("item");
        let jid = from;
        let affiliation = null;
        let role = null;
        if (xitem.length > 0) {
            jid = xitem[0].getAttribute("jid") || jid;
            role = xitem[0].getAttribute("role");
            affiliation = xitem[0].getAttribute("affiliation");
            /*
             * <presence xmlns='jabber:client'
             * to='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * from='mafchat@conference.localhost/fire-daryl.e.herzmann'> <x
             * xmlns='http://jabber.org/protocol/muc#user'> <item><role>visitor</role></item></x>
             * <x xmlns='http://jabber.org/protocol/muc#user'> <item
             * jid='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * affiliation='none' role='participant'/></x> </presence>
             */
            const roletest = xitem[0].getElementsByTagName("role");
            if (roletest.length > 0) {
                try {
                    role = roletest[0].textContent;
                } catch (err) {
                    let vDebug = "roletest bug\n:";
                    vDebug += Strophe.xmlescape(Strophe.serialize(msg)) + "\n";
                    for (const prop in err) {
                        vDebug +=
                            "property: " +
                            prop +
                            " value: [" +
                            err[prop] +
                            "]\n";
                    }
                    vDebug +=
                        "toString(): " + " value: [" + err.toString() + "]";
                    Application.log(vDebug);
                }
            }
        }

        if (msg.getAttribute("type") === null) {
            // affiliation='none' role='participant'
            // affiliation='none' role='none' <-- Leave Room
            // affiliation='owner' role='moderator'

            if (!child && role !== "visitor") {
                mcp.joinedChat = true;
                if (roomUsersRoot) {
                    roomUsersRoot.appendChild({
                        affiliation: affiliation,
                        role: role,
                        icon: getMUCIcon(affiliation),
                        text: Strophe.getResourceFromJid(from),
                        jid: jid,
                        leaf: true,
                    });
                }
            }
        }
        if (msg.getAttribute("type") === "unavailable") {
            if (child) {
                if (child.parentNode) {
                    child.parentNode.removeChild(child, true);
                } else if (roomUsersRoot) {
                    // Fallback if parent is missing but root is known
                    roomUsersRoot.removeChild(child, true);
                }
            }
        }
    } else {
        onBuddyPresence(msg);
    }
}

function onMessage(msg) {
    try {
        messageParser(msg);
    } catch (err) {
        console.error("Message Bug:", err);
        console.error("Stack trace:", err.stack);
        console.error("Message:", Strophe.serialize(msg));
        Application.log(
            "Message Bug - see console for details: " + err.message
        );
    }
    return true;
}
// http://stackoverflow.com/questions/37684
Application.replaceURLWithHTMLLinks = function (text) {
    const exp =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
    if (text === null) {
        return null;
    }
    return text.replace(exp, "<a href='$1'>$1</a>");
};

function messageParser(msg) {
    //var to = msg.getAttribute('to');
    const from = msg.getAttribute("from");
    const type = msg.getAttribute("type");
    const elems = msg.getElementsByTagName("body");
    let x = msg.querySelectorAll("delay[xmlns='urn:xmpp:delay']");
    const html = msg.getElementsByTagName("html");
    const body = elems[0];
    let txt = "";
    let isDelayed = false;
    let stamp = null;

    /*
     * We need to simplify the message into something that
     * will display pretty.
     */
    if (html.length > 0) {
        const v = msg
            .getElementsByTagName("html")[0]
            .getElementsByTagName("body");
        txt = navigator.userAgent.match(/msie/i) ? v[0].xml : v[0].innerHTML;
        txt = txt.replace(/<p/g, "<span").replace(/<\/p>/g, "</span>");
        if (txt === "") {
            Application.log("Message Failure:" + msg);
            txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
        }
    } else {
        txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
    }

    if (x.length > 0) {
        stamp = UTCStringToDate(
            x[0].getAttribute("stamp").substring(0, 19),
            "Y-m-d\\Th:i:s"
        );
        isDelayed = true;
    } else {
        stamp = new Date();
    }

    if (type === "groupchat") {
        console.log('[MUC] Received groupchat message from:', from);
        console.log('[MUC] Message text length:', txt ? txt.length : 0, 'text:', txt);
        /* Look to see if a product_id is embedded */
        let product_id = null;
        x = msg.getElementsByTagName("x");
        for (let i = 0; i < x.length; i++) {
            if (x[i].getAttribute("product_id")) {
                product_id = x[i].getAttribute("product_id");
            }
        }
        geomParser(msg, isDelayed);
        const sender = Strophe.getResourceFromJid(from);
        const room = Strophe.getBareJidFromJid(from);
        console.log('[MUC] Looking for room:', room, 'sender:', sender);
        const mpc = Ext.getCmp("chatpanel").getMUC(room);
        console.log('[MUC] Found MUC panel:', mpc ? 'YES' : 'NO', 'has gp:', mpc && mpc.gp ? 'YES' : 'NO');
        if (mpc && mpc.gp && sender) {
            console.log('[MUC] Adding message to store:', {sender, txt: txt.substring(0, 50), stamp});
            mpc.gp.getStore().add({
                ts: stamp,
                author: sender,
                message: txt,
                room: null,
                jid: mpc.getJidByHandle(sender),
                xdelay: isDelayed,
                product_id: product_id,
            });
            console.log('[MUC] Store now has', mpc.gp.getStore().getCount(), 'messages');
            // i = mpc.gp.getStore().getCount() - 1;
            // row = mpc.gp.getView().getRow(i);
            // if (row) row.scrollIntoView();
            if (mpc.gp.getStore().isFiltered()) {
                mpc.gp.getStore().filterBy(iembotFilter);
            }
            if (!isDelayed) {
                /* Add to allchats */
                Ext.getCmp("__allchats__")
                    .gp.getStore()
                    .add({
                        ts: stamp,
                        author: sender,
                        room: Strophe.getNodeFromJid(from),
                        message: txt,
                        jid: mpc.getJidByHandle(sender),
                        xdelay: isDelayed,
                        product_id: product_id,
                    });
                if (Ext.getCmp("__allchats__").gp.getStore().isFiltered()) {
                    Ext.getCmp("__allchats__")
                        .gp.getStore()
                        .filterBy(iembotFilter);
                }
            }
        }
    } else if (type === "chat" && !txt && from !== null) {
        const jid = Strophe.getBareJidFromJid(from);
        const cp = Ext.getCmp("chatpanel").getChat(jid);
        /* Chat states stuff! */
        const composing = msg.getElementsByTagName("composing");
        if (composing.length > 0) {
            if (cp) {
                cp.setIconCls("typing-tab");
            }
        }
        const paused = msg.getElementsByTagName("paused");
        if (paused.length > 0) {
            if (cp) {
                cp.setIconCls("paused-tab");
            }
        }
    } else if (type === "chat" && txt && from !== null) {
        let jid = Strophe.getBareJidFromJid(from);
        let username = Strophe.getNodeFromJid(from);
        if (Strophe.getDomainFromJid(from) !== LiveConfig.XMPPHOST) {
            jid = from;
            username = Strophe.getResourceFromJid(from);
        }
        let cp = Ext.getCmp("chatpanel").getChat(jid);
        if (!cp) {
            cp = Ext.getCmp("chatpanel").addChat(jid);
            Application.MsgBus.fireEvent("soundevent", "new_conversation");
        }
        cp.gp.store.add({
            ts: stamp,
            author: username,
            room: null,
            xdelay: false,
            message: txt,
        });
    } else if (from === LiveConfig.XMPPHOST) {
        /* Broadcast message! */
        new Ext.Window({
            width: 500,
            maxWidth: 500,
            height: 350,
            constrain: true,
            autoScroll: true,
            bodyStyle: {
                padding: "10",
                background: "#fff",
            },
            title:
                (msg.getElementsByTagName("subject")[0]
                    ? msg.getElementsByTagName("subject")[0].textContent
                    : null) || "System Message",
            html:
                "<p><b>System Message</b><p>" +
                (msg.getElementsByTagName("body")[0]
                    ? msg.getElementsByTagName("body")[0].textContent
                    : "") +
                "</p>",
        }).show();
    }
}
function geomParser(msg, isDelayed) {
    if (!Ext.getCmp("map")) {
        return;
    }
    /* Look for iembot geometry declarations */
    const elems = msg.getElementsByTagName("body");
    const body = elems[0];
    const html = msg.getElementsByTagName("html");
    let txt = null;
    if (html.length > 0) {
        const v = msg
            .getElementsByTagName("html")[0]
            .getElementsByTagName("body");
        txt = navigator.userAgent.match(/msie/i) ? v[0].xml : v[0].innerHTML;
    } else {
        txt = Strophe.getText(body);
    }
    const x = msg.getElementsByTagName("x");
    if (x.length === 0) {
        return;
    }
    for (let i = 0; i < x.length; i++) {
        if (x[i].getAttribute("geometry") === null) {
            continue;
        }
        const geom = x[i].getAttribute("geometry");
        const wkt = new WKT();
        const features = wkt.readFeatures(geom, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
        });
        if (features && features.length > 0) {
            const feature = features[0];
            /* Now we figure out when to remove this display */
            /* Our default duration is 2 hours, for LSRs */
            let delayed = 60 * 60 * 1000;
            if (x[i].getAttribute("skip")) {
                continue;
            }
            let d = null;
            if (x[i].getAttribute("expire")) {
                d = UTCStringToDate(
                    x[i].getAttribute("expire"),
                    "Ymd\\Th:i:s"
                );
                feature.set("expire", d.toUTC());
                const diff = d - new Date();
                // console.log("Product Time Diff:"+ diff);
                if (diff <= 0) {
                    continue;
                }
                if (diff > 0) {
                    delayed = diff;
                }
            }
            if (x[i].getAttribute("valid")) {
                d = UTCStringToDate(
                    x[i].getAttribute("valid"),
                    "Ymd\\Th:i:s"
                );
                feature.set("valid", d.toUTC());
            }
            // console.log("Product Time Delayed:"+ delayed);
            feature.set("ptype", x[i].getAttribute("ptype"));
            feature.set("message", txt);
            const valid = feature.get("valid");
            if (
                (x[i].getAttribute("category") === "LSR" ||
                    x[i].getAttribute("category") === "PIREP") &&
                valid
            ) {
                if (
                    !isDelayed ||
                    (new Date() - valid < 7200000)
                ) {
                    const lsrs = Application.lsrStore.layer;
                    lsrs.addFeatures([feature]);
                    new Ext.util.DelayedTask(function () {
                        lsrs.removeFeatures([feature]);
                    }).delay(delayed);
                    const sstate = Application.lsrStore.getSortState();
                    Application.lsrStore.sort(sstate.field, sstate.direction);
                }
            }
            if (x[i].getAttribute("category") === "SBW") {
                feature.set("vtec", x[i].getAttribute("vtec"));
                const vtec = feature.get("vtec");
                const recordID = Application.sbwStore.find("vtec", vtec);
                if (x[i].getAttribute("status") === "CAN") {
                    if (recordID > -1) {
                        Application.log(
                            "Removing SBW vtec [" + vtec + "]"
                        );
                        Application.sbwStore.removeAt(recordID);
                    }
                    continue;
                }
                if (recordID > -1) {
                    Application.log(
                        "Old SBW vtec [" + vtec + "]"
                    );
                    Application.sbwStore.removeAt(recordID);
                }
                Application.log(
                    "Adding SBW vtec [" +
                        vtec +
                        "] delay [" +
                        delayed +
                        "]"
                );
                const sbws = Application.sbwStore.layer;
                sbws.addFeatures([feature]);
                new Ext.util.DelayedTask(function () {
                    sbws.removeFeatures([feature]);
                }).delay(delayed);
                const sstate = Application.sbwStore.getSortState();
                Application.sbwStore.sort(sstate.field, sstate.direction);
            }
        }
    }
}

/*
 * Update the style of the text entry window, typically
 * called after the preference is changed...
 */
Application.updateColors = function () {
    const bgcolor = Application.getPreference("bgcolor", "FFFFFF");
    const fgcolor = Application.getPreference("fgcolor", "000000");
    Application.log(
        "Attempting style adjustment bgcolor:" +
            bgcolor +
            ", fgcolor:" +
            fgcolor
    );
    Ext.getCmp("chatpanel").items.each(function (p) {
        if (p.te) {
            p.te.items
                .get(0)
                .getEl()
                .applyStyles({
                    background: "#" + bgcolor,
                    color: "#" + fgcolor,
                });
        }
    });

};

/*
 * Sync application Preferences upstream!
 */
Application.syncPreferences = function () {
    Application.log("Saving preferences to server...");
    const stanza = $iq({
        type: "set",
        id: "_set1",
    })
        .c("query", {
            xmlns: "jabber:iq:private",
        })
        .c("storage", {
            xmlns: "nwschatlive:prefs",
        });
    Application.prefStore.each(function (record) {
        this.c("pref", {
            key: record.get("key"),
            value: record.get("value"),
        }).up();
    }, stanza);
    if (Application.XMPPConn !== undefined) {
        Application.XMPPConn.sendIQ(stanza.tree());
    }
};

Application.removePreference = function (key) {
    const idx = Application.prefStore.find("key", key);
    if (idx > -1) {
        Application.prefStore.removeAt(idx);
    }
};

Application.getPreference = function (key, base) {
    const idx = Application.prefStore.find("key", key);
    if (idx > -1) {
        const record = Application.prefStore.getAt(idx);
        return record.get("value");
    }
    return base;
};

Application.setPreference = function (key, value) {
    const idx = Application.prefStore.find("key", key);
    if (idx > -1) {
        Application.log("Setting Preference: " + key + " Value: " + value);
        const record = Application.prefStore.getAt(idx);
        record.set("value", value);
    } else {
        Application.log("Adding Preference: " + key + " Value: " + value);
        Application.prefStore.add(
            new Ext.data.Record({
                key: key,
                value: value,
            })
        );
    }
};

/*
 * This will be how we handle the management and storage of application
 * preferences. It is a simple store, which can save its values to XMPP Private
 * Store
 */
Application.prefStore = new Ext.data.Store({
    fields: [
        {
            id: "key",
        },
        {
            id: "value",
        },
    ],
    locked: false,
    listeners: {
        remove: (st) => {
            Application.log("prefStore remove event fired...");
            if (st.locked) {
                Application.log("Skipping preference save due to locking");
                return true;
            }
            /* save preferences to xmpp private storage */
            Application.syncPreferences();
        },
        update: (st, record) => {
            Application.log("prefStore update event fired...");
            if (st.locked) {
                Application.log("Skipping preference save due to locking");
                return true;
            }
            /* save preferences to xmpp private storage */
            Application.syncPreferences();

            if (
                record.get("key") === "fgcolor" ||
                record.get("key") === "bgcolor"
            ) {
                Application.updateColors();
            }
        },
    },
});

export { login, doAnonymousLogin };
