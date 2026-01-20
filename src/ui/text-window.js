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

function loadTextProductInWindow(product_id) {
    const win = getTextWindow();
    win.show();
    if (win.setLoading) {
        win.setLoading("Loading...");
    } else {
        win.update("Loading...");
    }

    const url = `https://mesonet.agron.iastate.edu/api/1/nwstext/${product_id}`;

    fetch(url)
        .then(async (response) => {
            if (win.setLoading) {
                win.setLoading(false);
            }
            if (!response.ok) {
                win.update("Failed to load content. Status: " + response.status);
                return;
            }
            const text = await response.text();
            win.update(`<pre>${text}</pre>`);
        })
        .catch((err) => {
            if (win.setLoading) {
                win.setLoading(false);
            }
            win.update("Failed to load content. Error: " + err);
        });
}

function hideTextWindow() {
    if (textWindow) {
        textWindow.hide();
    }
}

export { getTextWindow, loadTextProductInWindow, hideTextWindow };
