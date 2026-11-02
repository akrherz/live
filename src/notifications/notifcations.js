const ICON_URL = "https://weather.im/live/images/nws.png";

export function showNotification(title = "", body = "") {
    // Check if the Notification API is supported by the browser
    if (typeof Notification === "undefined") {
        return;
    }

    if (document.visibilityState === "visible") {
        //console.log("Notification skipped because the document is visible.");
        return;
    }

    // If for some reason, the title and body are not provided, we should skip.
    if (!title.trim() && !body.trim()) {
        return;
    }

    // If the user has not been prompted for notification permission yet, we should request it.
    if (Notification.permission === "default") {
        requestAndShowPermission(title, body);
        return;
    }

    // If the user has denied notification permission, we should not show the notification.
    if (Notification.permission === "denied") {
        return;
    }

    let notification = null;
    try {
        notification = new Notification(title, {
            body, // HTML removed text
            silent: true, // Disable sound for notifications
            icon: ICON_URL, // Set the icon for the notification/default IEM icon
        });
    } catch (error) {
        console.error("Unable to create browser notification:", error);
        return;
    }
    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    };
    notification.onerror = (error) => {
        console.error("Browser notification failed:", error);
    };
}

function requestAndShowPermission(title, body) {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            showNotification(title, body);
        }
    });
}
