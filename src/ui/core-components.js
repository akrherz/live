/**
 * UI Components
 * DebugWindow, LiveViewport, MapLegend
 */

import { createLoginPanel } from "../auth/LoginPanel.js";
import { MapPanel } from "../map/MapPanel.js";

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
        const mp = Ext.getCmp("map");
        if (mp && mp.map && mp.map.events) {
            mp.map.events.register("changelayer", null, function () {
                const myobj = { lstring: "" };
                Application.layerstore.data.each(function (record) {
                    const layer = record.getLayer();
                    if (layer.getVisibility()) {
                        this.lstring += "||" + layer.name;
                    }
                }, myobj);
                Application.setPreference("layers", myobj.lstring);
            });
            Ext.TaskMgr.start(Application.MapTask);
        } else {
            console.warn("Map component or map.events is not ready in doStuff");
        }

        new Application.DebugWindow({
            id: "debug",
            renderTo: Ext.getBody(),
        });

        const loginPanel = createLoginPanel();
        new Ext.Window({
            id: "loginwindow",
            modal: true,
            closable: false,
            title: "Weather.IM Live Login Options",
            items: [loginPanel],
        }).show();
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
