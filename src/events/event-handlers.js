/**
 * Event Bus and Handlers
 * MsgBus events, sound system, chat events
 */

Ext.ns("Application");

export function UTCStringToDate(dtStr, format) {
    const dt = Date.parseDate(dtStr, format);
    if (dt == undefined)
        return ''; // or whatever you want to do
    if (typeof dt.fromUTC === 'function') {
        return dt.fromUTC();
    }
    return dt;
}

Application.MsgBus = new Ext.util.Observable();
Application.MsgBus.addEvents('message');
Application.MsgBus.addEvents('loggedin');
Application.MsgBus.addEvents('loggedout');

// Audio cache for reusing Audio objects
const audioCache = {};

Application.playSound = function(sidx) {
    // Check if audio is muted
    if (Application.audioMuted) {
        return;
    }
    
    const idx = Application.SoundStore.find('id', sidx);
    if (idx == -1) {
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
    audio.volume = Application.getPreference('volume', 100) / 100;
    
    // Reset to beginning if already playing
    audio.currentTime = 0;
    audio.play().catch(function(err) {
        console.error('Error playing sound:', err);
    });
};

Application.MsgBus.on('soundevent', function(sevent) {

    const enable = Application.getPreference("sound::" + sevent + "::enabled", 'true');
    if (enable == 'false') {
        return;
    }
    const sidx = Application.getPreference("sound::" + sevent + "::sound", 'default');
    Application.playSound(sidx);

});

Application.MsgBus.on('loggingout', function() {
    /* Remove chatrooms from view */
    Ext.getCmp("chatpanel").items.each(function(panel) {
                if (panel.chatType == "groupchat") {
                    //Ext.getCmp('chatpanel').remove(panel);
                    panel.clearRoom();
                }
            });
    /* Remove buddies */
    Ext.getCmp('buddies').root.removeAll();
    /* Remove bookmarks */
    Ext.getCmp('bookmarks').root.suspendEvents(false);
    Ext.getCmp('bookmarks').root.removeAll();
    Ext.getCmp('bookmarks').root.resumeEvents();
    Ext.getCmp('bookmarks').root.initalLoad = false;
    /* Remove chatrooms */
    Ext.getCmp('chatrooms').root.removeAll();

});

Application.MsgBus.on('loggedout', function() {
    Ext.getCmp('loginwindow').show();
});

Application.MsgBus.on('loggedin', function() {

            Ext.getCmp('loginwindow').hide();

            Application.XMPPConn.send($iq({
                        type : 'get',
                        id : 'fetchrooms',
                        to : 'conference.' + Application.XMPPHOST
                    }).c('query', {
                        xmlns : 'http://jabber.org/protocol/disco#items'
                    }));

        });

Application.MsgBus.on('joinchat', function(room, handle, anonymous) {
            if (handle == null || handle == "") {
                handle = Application.USERNAME;
            }
            let mcp = Ext.getCmp("chatpanel").getMUC(room);
            if (mcp == null) {
                
                Application.log("Creating chatroom:" + room);
                mcp = Ext.getCmp("chatpanel").addMUC(room, handle, anonymous);
                // Ext.getCmp("chatpanel").setActiveTab(mcp);
                /* Initial Presence */
                const p = $pres({
                            to : room + '/' + handle
                        });
                if (anonymous) {
                    p.c('x', {
                                'xmlns' : 'http://jabber.org/protocol/muc#user'
                            }).c('item').c('role', 'visitor');
                }
                Application.XMPPConn.send(p);
                mcp.on('destroy', function() {
                            if (Application.XMPPConn.authenticated &&
                                    this.joinedChat) {
                                Application.XMPPConn.send($pres({
                                            type : 'unavailable',
                                            to : room + '/' + handle
                                        }));
                            }
                });

            }
            Ext.getCmp("chatpanel").setActiveTab(mcp);

        });
