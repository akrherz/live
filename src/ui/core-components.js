/**
 * UI Components
 * DebugWindow, LiveViewport, MapLegend
 */

import { LoginPanel } from "../auth/LoginPanel.js";
import MapPanel from "../map/MapPanel.js";
import { getMap } from "../map/MapPanel.js";
import { setPreference } from "../utils/prefs.js";

import { Application } from "../app-state.js";
import { getFullVersionString } from "../version.js";

function getConnectionStatusMarkup(text, tone) {
    const palette = {
        idle: "#666",
        info: "#0b5cab",
        warning: "#9a6700",
        error: "#b42318",
        success: "#027a48",
    };
    const color = palette[tone] || palette.idle;
    return `Status: <span style="color:${color};font-weight:600;">${Ext.util.Format.htmlEncode(text || "Unknown")}</span>`;
}

Application.connectionStatus = {
    text: "Signed out",
    tone: "idle",
};

Application.setConnectionStatus = function (text, tone = "idle") {
    Application.connectionStatus = {
        text,
        tone,
    };

    const statusText = Ext.getCmp("connection-status-text");
    if (statusText && statusText.setText) {
        statusText.setText(getConnectionStatusMarkup(text, tone));
    }

    const loginPanel = Ext.getCmp("loginpanel");
    if (loginPanel && loginPanel.setConnectionMessage) {
        loginPanel.setConnectionMessage(text);
    }
};

Application.getDiagnosticsText = function () {
    const connection = Application.XMPPConn;
    const pendingLogin = Application.pendingLogin;
    const status = Application.connectionStatus || {};
    return [
        `App Version: ${getFullVersionString()}`,
        `Timestamp: ${new Date().toISOString()}`,
        `URL: ${window.location.href}`,
        `Connection Status: ${status.text || "Unknown"}`,
        `Connection Tone: ${status.tone || "idle"}`,
        `Username: ${Application.USERNAME || ""}`,
        `Last Login Mode: ${Application.lastLoginMode || ""}`,
        `Reconnect Enabled: ${Application.RECONNECT === true}`,
        `Reconnect Attempts: ${Application.reconnectAttempts || 0}`,
        `Current Service URL: ${Application.currentXMPPServiceUrl || ""}`,
        `Authenticated: ${Boolean(connection && connection.authenticated)}`,
        `Connected: ${Boolean(connection && connection.connected)}`,
        `Disconnecting: ${Boolean(connection && connection.disconnecting)}`,
        `Pending Login Mode: ${pendingLogin ? pendingLogin.mode : ""}`,
        `Pending Login User: ${pendingLogin ? pendingLogin.username || "" : ""}`,
        `User Agent: ${navigator.userAgent}`,
    ].join("\n");
};

Application.msgtpl = new Ext.XTemplate(
    '<p>{date:date("g:i:s A")} :: {msg}</p>'
);

Application.DebugWindow = Ext.extend(Ext.Window, {
    initComponent () {
        this.items = [
            {
                xtype: "panel",
                title: "Debug Log",
                html:
                    `<p><b>App Version:</b> ${getFullVersionString()}</p>` +
                    "<p>Browser CodeName: " +
                    navigator.appCodeName +
                    "</p>" +
                    "<p>Browser Name: " +
                    navigator.appName +
                    "</p>" +
                    "<p>Browser Version: " +
                    navigator.appVersion +
                    "</p>" +
                    "<p>Cookies Enabled: " +
                    navigator.cookieEnabled +
                    "</p>" +
                    "<p>Platform: " +
                    navigator.platform +
                    "</p>" +
                    "<p>User-agent header: " +
                    navigator.userAgent +
                    "</p>",
                autoScroll: true,
            },
        ];

        this.tbar = [
            {
                text: "Clear Log",
                icon: "icons/close.png",
                handler () {
                    this.items.items[0].update("");
                },
                scope: this,
            },
            {
                text: "Copy Diagnostics",
                handler () {
                    const diagnostics = Application.getDiagnosticsText
                        ? Application.getDiagnosticsText()
                        : "Diagnostics unavailable";
                    const fallbackCopy = () => {
                        const textarea = document.createElement("textarea");
                        textarea.value = diagnostics;
                        textarea.setAttribute("readonly", "readonly");
                        textarea.style.position = "absolute";
                        textarea.style.left = "-9999px";
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                    };
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(diagnostics).catch(fallbackCopy);
                    } else {
                        fallbackCopy();
                    }
                    this.addMessage("Copied diagnostics to clipboard.");
                },
                scope: this,
            },
        ];

        const config = {
            width: 600,
            height: 300,
            title: "Debug Window",
            closeAction: "hide",
            hidden: true,
            autoScroll: true,
            layout: "fit",
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.DebugWindow.superclass.initComponent.apply(this, arguments);
    }, // End of initComponent
    addMessage (msg) {
        Application.msgtpl.append(this.items.items[0].body, {
            msg,
            date: new Date(),
        });
    }, // End of addMessage
});

Application.LiveViewport = Ext.extend(Ext.Viewport, {
    initComponent () {
        let mp = {
            xtype: "panel",
            region: "north",
            height: 10,
            hidden: true,
            title: "Map Disabled by URL",
        };
        if (this.initialConfig.enableMap) {
            mp = {
                xtype: "panel",
                layout: "border",
                region: "north",
                collapsible: true,
                title: "Map Panel",
                height: 300,
                split: true,
                items: [MapPanel, Application.LayerTree],
            };
        }
        this.items = [
            Application.Control,
            {
                xtype: "panel",
                region: "center",
                layout: "border",
                items: [
                    mp,
                    new Application.ChatTabPanel({
                        id: "chatpanel",
                        region: "center",
                        split: true,
                    }),
                ],
            },
        ];
        const config = {
            layout: "border",
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Application.LiveViewport.superclass.initComponent.call(this);
        this.doStuff();
    },
    doStuff () {
        // Create non-map components immediately
        new Application.DebugWindow({
            id: "debug",
            renderTo: Ext.getBody(),
        });

        // Wait for map to be ready before setting up map-related functionality
        const initMapStuff = () => {
            const mp = Ext.getCmp("map");
            const map = getMap();
            if (mp && map) {
                // Listen for layer visibility changes in OpenLayers 10
                map.getLayers().on('propertychange', function() {
                    const myobj = { lstring: "" };
                    Application.layerstore.data.each(function (record) {
                        const layer = record.getLayer();
                        if (layer.getVisible && layer.getVisible()) {
                            const name = layer.get('name') || layer.get('title');
                            if (name) {
                                this.lstring += "||" + name;
                            }
                        }
                    }, myobj);
                    setPreference("layers", myobj.lstring);
                });
                if (Application.MapTask) {
                    Ext.TaskManager.start(Application.MapTask);
                }
            } else {
                // Retry after a short delay
                setTimeout(initMapStuff, 200);
            }
        };
        initMapStuff();

        const loginWindow = new Ext.Window({
            id: "loginwindow",
            modal: true,
            closable: false,
            resizable: false,
            draggable: false,
            width: 560,
            minWidth: 520,
            maxWidth: 620,
            height: 720,
            minHeight: 520,
            maxHeight: 760,
            layout: "fit",
            bodyStyle: "overflow: hidden;",
            title: "Weather.IM Live Login Options",
            items: [LoginPanel],
            listeners: {
                show () {
                    this.center();
                },
            },
        });

        const applyLoginWindowSize = () => {
            const bodySize = Ext.getBody().getViewSize();
            const width = Math.min(620, Math.max(520, bodySize.width - 40));
            const height = Math.min(760, Math.max(520, bodySize.height - 40));
            loginWindow.setSize(width, height);
            loginWindow.center();
        };

        applyLoginWindowSize();
        loginWindow.show();
        if (Application.setConnectionStatus) {
            Application.setConnectionStatus("Signed out", "idle");
        }

        Ext.EventManager.onWindowResize(function () {
            if (!loginWindow || loginWindow.isDestroyed) {
                return;
            }
            applyLoginWindowSize();
        });
    },
});

Application.MapLegend = Ext.extend(Ext.Window, {
    width: 300,
    height: 200,
    autoScroll: true,
    title: "Map Legends",
    hidden: true,
    closeAction: "hide",

    initComponent () {
        const config = {};
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MapLegend.superclass.initComponent.apply(this, arguments);
        this.buildItems();
    },
    buildItems () {},
});
