/**
 * Event Bus and Handlers
 * MsgBus events, sound system, chat events
 */

Ext.ns("Application");

export function UTCStringToDate(dtStr, format) {
    var dt = Date.parseDate(dtStr, format);
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

Application.playSound = function(sidx) {
    if (!soundManager || ! soundManager.ok() || soundManager.playState == 1) {
        return;
    }
    
    var snd = soundManager.getSoundById(sidx);
    if (!snd) {
        var idx = Application.SoundStore.find('id', sidx);
        if (idx == -1) {
            Application.log("Could not find sound: " + sidx);
            return;
        }
        var record = Application.SoundStore.getAt(idx);
        snd = soundManager.createSound({
                    id : record.get("id"),
                    url : record.get("src"),
                    onplay : function() {
                    },
                    onfinish : function() {
                    }
                });
    }
    if (snd){
        snd.play({
                volume : Application.getPreference('volume', 100)
            });
    }
};

Application.MsgBus.on('soundevent', function(sevent) {

    var enable = Application.getPreference("sound::" + sevent + "::enabled", 'true');
    if (enable == 'false') {
        return;
    }
    var sidx = Application.getPreference("sound::" + sevent + "::sound", 'default');
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
            var mcp = Ext.getCmp("chatpanel").getMUC(room);
            if (mcp == null) {
                
                Application.log("Creating chatroom:" + room);
                mcp = Ext.getCmp("chatpanel").addMUC(room, handle, anonymous);
                // Ext.getCmp("chatpanel").setActiveTab(mcp);
                /* Initial Presence */
                var p = $pres({
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
