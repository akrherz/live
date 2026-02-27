/**
 * UI Components
 * DebugWindow, LiveViewport, MapLegend
 */

import { LoginPanel } from "../auth/LoginPanel.js";
import MapPanel from "../map/MapPanel.js";
import { getMap } from "../map/MapPanel.js";
import { setPreference } from "../xmpp/handlers.js";
import { Application } from "../app-state.js";

Application.msgtpl = new Ext.XTemplate(
    '<p>{date:date("g:i:s A")} :: {msg}</p>'
);

Application.DebugWindow = Ext.extend(Ext.Window, {
    initComponent: function () {
        this.items = [
            {
                xtype: "panel",
                title: "Debug Log",

                html:
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
                handler: function () {
                    this.items.items[0].update("");
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
    addMessage: function (msg) {
        Application.msgtpl.append(this.items.items[0].body, {
            msg: msg,
            date: new Date(),
        });
    }, // End of addMessage
});

Application.LiveViewport = Ext.extend(Ext.Viewport, {
    initComponent: function () {
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
    doStuff: function () {
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
                show: function () {
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

    initComponent: function () {
        const config = {};
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.MapLegend.superclass.initComponent.apply(this, arguments);
        this.buildItems();
    },
    buildItems: function () {},
});
