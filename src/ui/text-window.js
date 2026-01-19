let textWindow = null;

function getTextWindow() {
    if (!textWindow) {
        textWindow = new Ext.Window({
            width: 550,
            height: 300,
            title: "Product Text",
            closeAction: "hide",
            constrain: true,
            hidden: true,
            autoScroll: true,
            html: "Loading....",
        });
    }
    return textWindow;
}

function loadTextWindow(config) {
    const win = getTextWindow();
    win.show();
    if (win.setLoading) {
        win.setLoading(config && config.text ? config.text : "Loading...");
    } else {
        win.update(config && config.text ? config.text : "Loading...");
    }

    Ext.Ajax.request({
        url: "https://mesonet.agron.iastate.edu/p.php",
        method: config && config.method ? config.method : "GET",
        params: config && config.params ? config.params : {},
        success: function (response) {
            if (win.setLoading) {
                win.setLoading(false);
            }
            win.update(response.responseText);
        },
        failure: function (response) {
            if (win.setLoading) {
                win.setLoading(false);
            }
            win.update(
                "Failed to load content. Status: " + response.status
            );
        },
    });
}

function hideTextWindow() {
    if (textWindow) {
        textWindow.hide();
    }
}

export { getTextWindow, loadTextWindow, hideTextWindow };
