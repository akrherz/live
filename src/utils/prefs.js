/**
 * Application preference store and accessors.
 * Extracted here to break the circular import between
 * event-handlers.js and xmpp/handlers.js.
 *
 * Consumers should import directly from this module rather than
 * going through xmpp/handlers.js.
 */

import { $iq } from "strophe.js";
import { Application } from "../app-state.js";

/*
 * Sync application preferences upstream to XMPP private storage.
 */
export function syncPreferences() {
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
}

Application.removePreference = function (key) {
    const idx = Application.prefStore.find("key", key);
    if (idx > -1) {
        Application.prefStore.removeAt(idx);
    }
};

export function getPreference(key, base) {
    const idx = Application.prefStore.find("key", key);
    if (idx > -1) {
        const record = Application.prefStore.getAt(idx);
        return record.get("value");
    }
    return base;
}

export function setPreference(key, value) {
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
}

/*
 * The preference store — a simple ExtJS store that persists its values
 * to XMPP Private Storage (jabber:iq:private).
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
            syncPreferences();
        },
        update: (st, record) => {
            Application.log("prefStore update event fired...");
            if (st.locked) {
                Application.log("Skipping preference save due to locking");
                return true;
            }
            syncPreferences();

            if (
                record.get("key") === "fgcolor" ||
                record.get("key") === "bgcolor"
            ) {
                Application.updateColors();
            }
        },
    },
});
