/**
 * Utility Functions
 * Grid export, filters, link interceptor
 */

import { hideTextWindow } from "../ui/text-window.js";

function iembotFilter(record) {
    return record.get("author") !== "iembot";
}

function formatTimestamp(value) {
    if (!value) {
        return "";
    }

    let dateValue = value;
    if (!(dateValue instanceof Date)) {
        dateValue = new Date(value);
    }
    if (Number.isNaN(dateValue.getTime())) {
        return String(value);
    }

    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    const hours = dateValue.getHours();
    const minutes = String(dateValue.getMinutes()).padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;

    return `${year}/${month}/${day} ${hour12}:${minutes} ${suffix}`;
}

/*
 * Generate a html version of the active grid
 */
function grid2html(gridPanel) {
    const ds = gridPanel.getStore();
    const roomname = gridPanel.ownerCt.title;
    let t = "<html><head></head><body>";
    t +=
        "<table cellpadding='2' cellspacing='0' border='1'><tr><th>Roomname</th><th>Date</th><th>Author</th><th>Message</th></tr>";
    for (let i = 0; i < ds.getCount(); i++) {
        const row = ds.getAt(i);
        t += `<tr><td>${row.get("roomname") || roomname}</td><td>${formatTimestamp(row.get("ts"))}</td><td>${row.get("author")}</td><td>${row.get("message")}</td></tr>\r\n`;
    }
    t += "</table></body></html>";
    return t;
}
/*
 * Necessary to support changing the icon on the panel's tab
 */

function htmlExport(gridPanel) {
    if (
        Ext.isIE6 ||
        Ext.isIE7 ||
        Ext.isSafari ||
        Ext.isSafari2 ||
        Ext.isSafari3
    ) {
        Ext.Msg.alert(
            "Status",
            "Sorry, this tool does not work with this browser.",
        );
    } else {
        const t = grid2html(gridPanel);
        document.location = "data:plain/html;base64," + encode64(t);
    }
}

function showHtmlVersion(gridPanel) {
    const win = new Ext.Window({
        title: "Text Version",
        closable: true,
        width: 600,
        height: 350,
        plain: true,
        autoScroll: true,
        html: grid2html(gridPanel),
    });
    win.show();
}

function printGrid(gridPanel) {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
        return;
    }
    printWindow.document.open();
    printWindow.document.write(grid2html(gridPanel));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

const LinkInterceptor = {
    render: function (p) {
        p.body.on({
            mousedown: function (e, t) {
                // try to intercept the easy
                // way

                t.target = "_blank";
                t.rel = "noopener noreferrer";
                hideTextWindow();
            },
            click: function (e, t) {
                // if they tab + enter a link,
                // need to do it old fashioned
                // way

                if (String(t.target).toLowerCase() !== "_blank") {
                    e.stopEvent();
                    open(t.href, "_blank", "noopener,noreferrer");
                }
                hideTextWindow();
            },
            delegate: "a",
        });
    },
};

export {
    iembotFilter,
    grid2html,
    htmlExport,
    printGrid,
    showHtmlVersion,
    LinkInterceptor,
};
