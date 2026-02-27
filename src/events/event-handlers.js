/**
 * Event Bus and Handlers
 * MsgBus events, sound system, chat events
 */

import { LiveConfig } from "../config.js";
import { $iq, $pres } from "strophe.js";
import { msgBus } from "./MsgBus.js";
import { getPreference } from "../xmpp/handlers.js";
import { Application } from "../app-state.js";

export function UTCStringToDate(dtStr, format) {
    let dt = null;

    if (typeof Date.parseDate === "function") {
        dt = Date.parseDate(dtStr, format);
    }

    if (!dt) {
        if (format === "Ymd\\Th:i:s") {
            const match = dtStr.match(
                /^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
            );
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                dt = new Date(
                    Date.UTC(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hour),
                        Number(minute),
                        Number(second)
                    )
                );
            }
        } else if (format === "Y-m-d\\Th:i:s") {
            const match = dtStr.match(
                /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
            );
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                dt = new Date(
                    Date.UTC(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hour),
                        Number(minute),
                        Number(second)
                    )
                );
            }
        } else {
            const nativeDate = new Date(dtStr);
            if (!Number.isNaN(nativeDate.getTime())) {
                dt = nativeDate;
            }
        }
    }

    if (!dt) {
        return null;
    }
    return dt;
}

// Audio cache for reusing Audio objects
const audioCache = {};

function playSound(sidx) {
    // Check if audio is muted
    if (Application.audioMuted) {
        return;
    }

    const idx = Application.SoundStore.find("id", sidx);
    if (idx === -1) {
        Application.log("Could not find sound: " + sidx);
        return;
    }

    const record = Application.SoundStore.getAt(idx);
    const url = record.get("src");

    // Create or reuse audio element
    if (!audioCache[sidx]) {
        audioCache[sidx] = new Audio(url);
    }

    const audio = audioCache[sidx];
    audio.volume = getPreference("volume", 100) / 100;

    // Reset to beginning if already playing
    audio.currentTime = 0;
    audio.play().catch(function (err) {
        console.error("Error playing sound:", err);
    });
}

msgBus.on("soundevent", (sevent) => {
    const enable = getPreference(`sound::${sevent}::enabled`, "true");
    if (enable === "false") {
        return;
    }
    const sidx = getPreference(`sound::${sevent}::sound`, "default");
    playSound(sidx);
});

msgBus.on("loggingout", function () {
    /* Remove chatrooms from view */
    const chatPanel = Ext.getCmp("chatpanel");
    if (chatPanel && chatPanel.items) {
        chatPanel.items.each(function (panel) {
            if (panel.chatType === "groupchat") {
                //Ext.getCmp('chatpanel').remove(panel);
                panel.clearRoom();
            }
        });
    }
    /* Remove buddies */
    const buddiesTree = Ext.getCmp("buddies");
    if (buddiesTree && buddiesTree.getRootNode()) {
        buddiesTree.getRootNode().removeAll();
    }
    /* Remove bookmarks */
    const bookmarksTree = Ext.getCmp("bookmarks");
    if (bookmarksTree && bookmarksTree.getRootNode()) {
        const bookmarksRoot = bookmarksTree.getRootNode();
        bookmarksRoot.suspendEvents(false);
        bookmarksRoot.removeAll();
        bookmarksRoot.resumeEvents();
        bookmarksRoot.initialLoad = false;
    }
    /* Remove chatrooms */
    const chatroomsTree = Ext.getCmp("chatrooms");
    if (chatroomsTree && chatroomsTree.getRootNode()) {
        chatroomsTree.getRootNode().removeAll();
    }
});

msgBus.on("loggedout", function () {
    const loginWindow = Ext.getCmp("loginwindow");
    if (loginWindow) {
        loginWindow.show();
    }
});

msgBus.on("loggedin", function () {
    const loginWindow = Ext.getCmp("loginwindow");
    if (loginWindow) {
        loginWindow.hide();
    }

    Application.XMPPConn.send(
        $iq({
            type: "get",
            id: "fetchrooms",
            to: LiveConfig.XMPPMUCHOST,
        }).c("query", {
            xmlns: "http://jabber.org/protocol/disco#items",
        }),
    );
});

msgBus.on("joinchat", function (room, handle, anonymous) {
    if (handle === null || handle === "") {
        handle = Application.USERNAME;
    }
    const chatPanel = Ext.getCmp("chatpanel");
    if (!chatPanel) {
        return;
    }
    let mcp = chatPanel.getMUC(room);
    if (mcp === null) {
        Application.log("Creating chatroom:" + room);
        mcp = chatPanel.addMUC(room, handle, anonymous);
        // Ext.getCmp("chatpanel").setActiveTab(mcp);
        /* Initial Presence */
        const p = $pres({
            to: room + "/" + handle,
        });
        if (anonymous) {
            p.c("x", {
                xmlns: "http://jabber.org/protocol/muc#user",
            })
                .c("item")
                .c("role", "visitor");
        }
        Application.XMPPConn.send(p);
        mcp.on("destroy", function () {
            if (Application.XMPPConn.authenticated && this.joinedChat) {
                Application.XMPPConn.send(
                    $pres({
                        type: "unavailable",
                        to: room + "/" + handle,
                    }),
                );
            }
        });
    }
    chatPanel.setActiveTab(mcp);
});

export { playSound };
