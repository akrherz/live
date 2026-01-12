/**
 * XMPP Protocol Handlers
 * Connection, message, presence, roster, and IQ handlers
 */

import { UTCStringToDate } from '../events/event-handlers.js';
import { onBuddyPresence } from '../chat/ChatComponents.js';

function buildXMPP(){
    Application.log("Initializing XMPPConn Obj");
    Application.XMPPConn = new Strophe.Connection(Application.BOSH);
    Application.XMPPConn.disco
            .addFeature("http://jabber.org/protocol/chatstates");
    if (Application.DEBUGMODE) {
        Application.XMPPConn.rawInput = rawInput;
        Application.XMPPConn.rawOutput = rawOutput;
    }
}

/*
 * Called when we wish to login! 
 */
Application.login = function(username, password) {
    var jid = username + "@" + Application.XMPPHOST + "/"+ Application.XMPPRESOURCE;
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    Application.XMPPConn.connect(jid, password, onConnect, 60, 1,
            Application.ROUTE);
};

// Anonymous Login!
Application.doAnonymousLogin = function(){
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    Application.XMPPConn.connect(Application.XMPPHOST, null, onConnect);
};

// Registration!
Application.register = function(){
    if (typeof Application.XMPPConn === 'undefined') {
        buildXMPP();
    }
    var callback = function (status) {
        if (status === Strophe.Status.REGISTER) {
            Application.log("Strophe.Status.REGISTER");
            Application.XMPPConn.register.fields.username = Ext.get("reguser").getValue();
            Application.XMPPConn.register.fields.password = Ext.get("regpass").getValue();
            Application.XMPPConn.register.fields.email = Ext.get("regemail").getValue();
            Application.XMPPConn.register.submit();
        } else if (status === Strophe.Status.REGISTERED) {
            Application.log('Username '+Application.XMPPConn.register.fields.username+' registered with server ...');
            Ext.getCmp('loginwindow').items.items[0].activate(0);
            document.getElementById('username').value = Application.XMPPConn.register.fields.username;
            document.getElementById('password').value = Application.XMPPConn.register.fields.password;
            Application.XMPPConn.disconnect();
            Application.doLogin();
        } else if (status === Strophe.Status.CONFLICT) {
            Application.log("Contact already existed!");
        } else if (status === Strophe.Status.NOTACCEPTABLE) {
            Application.log("Registration form not properly filled out.");
        } else if (status === Strophe.Status.REGIFAIL) {
            Application.log("The Server does not support In-Band Registration");
        } else if (status === Strophe.Status.CONNECTED) {
            Application.log('connected?');
            Application.USERNAME = Strophe.getNodeFromJid(Application.XMPPConn.jid);
            // do something after successful authentication
        } else {
            Application.log(status);
            // Do other stuff
        }
    };
    Application.XMPPConn.register.connect(Application.XMPPHOST, callback);
};

/*
 * Handle Strophe Connection Changes, we need to account for the following 1.
 * User is attempting to log in 2. User gets forced logged out via some failure
 * 3. User wants to log out...
 */
function onConnect(status) {

    if (status == Strophe.Status.CONNECTING) {
        Application.log('Strophe.Status.CONNECTING...');
    } else if (status == Strophe.Status.ERROR) {
        Application.log('Strophe.Status.ERROR...');
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status == Strophe.Status.AUTHFAIL) {
        Application.log('Strophe.Status.AUTHFAIL...');
        Application.RECONNECT = false;
        Ext.getCmp('loginpanel').addMessage(
            'Authentication failed, please check username and password...');
        Application.XMPPConn.disconnect();
    } else if (status == Strophe.Status.CONNFAIL) {
        Application.log('Strophe.Status.CONNFAIL...');
        // Application.MsgBus.fireEvent("loggedout");
    } else if (status == Strophe.Status.DISCONNECTED) {
        Application.log('Strophe.Status.DISCONNECTED...');
        Application.MsgBus.fireEvent("loggingout");
        if (Application.RECONNECT) {
            /* Lets wait 5 seconds before trying to reconnect */
            Application.log("Relogging in after 3 seconds delay");
            Application.doLogin.defer(3000, this);
        } else {
            Application.MsgBus.fireEvent("loggedout");
        }
    } else if (status == Strophe.Status.AUTHENTICATING) {
        Application.log('Strophe.Status.AUTHENTICATING...');
    } else if (status == Strophe.Status.DISCONNECTING) {
        Application.log('Strophe.Status.DISCONNECTING...');
        Application.XMPPConn.flush();
        //Application.XMPPConn.disconnect();
    } else if (status == Strophe.Status.ATTACHED) {
        Application.log('Strophe.Status.ATTACHED...');
    } else if (status == Strophe.Status.CONNECTED) {
        Application.log('Strophe.Status.CONNECTED...');
        Application.USERNAME = Strophe.getNodeFromJid(Application.XMPPConn.jid);
        Application.RECONNECT = true;

        /* Add Connection Handlers, removed on disconnect it seems */
        Application.XMPPConn.addHandler(onMessage, null, 'message', null, null,
                null);
        Application.XMPPConn.addHandler(onPresence, null, 'presence', null,
                null, null);
        Application.XMPPConn.addHandler(onRoster, Strophe.NS.ROSTER, 'iq',
                null, null, null);
        Application.XMPPConn.addHandler(onIQ, null, 'iq', null, null, null);

        /* Send request for roster */
        Application.XMPPConn.send($iq({
                    type : 'get'
                }).c('query', {
                    xmlns : Strophe.NS.ROSTER
                }).tree());

        /* Attempt to re-establish already joined chatrooms */
        var rejoinedRooms = 0;
        Ext.getCmp("chatpanel").items.each(function(panel) {
                    if (panel.chatType == 'groupchat') {
                        Application.log("Attempting to rejoin MUC: "
                                + panel.barejid);
                        var p = $pres({
                                    to : panel.barejid + '/' + panel.handle
                                });
                        if (panel.anonymous) {
                            p.c('x', {
                                        'xmlns' : 'http://jabber.org/protocol/muc#user'
                                    }).c('item').c('role', 'visitor');
                        }
                        (function() {
                            Application.XMPPConn.send(this.p);
                        }).defer(5000*rejoinedRooms, {
                            p : p
                        });
                        rejoinedRooms += 1;
                    }
                });

        /* Send request for Live prefs */
        var stanza = $iq({
                    type : 'get',
                    id : '_get3'
                }).c('query', {
                    xmlns : 'jabber:iq:private'
                }).c('storage', {
                    xmlns : 'nwschatlive:prefs'
                }).tree();
        Application.XMPPConn.sendIQ(stanza, parsePrefs);

        /* Send request for Live views */
        var stanza = $iq({
                    type : 'get',
                    id : '_get2'
                }).c('query', {
                    xmlns : 'jabber:iq:private'
                }).c('storage', {
                    xmlns : 'nwschatlive:views'
                }).tree();
        Application.XMPPConn.sendIQ(stanza, parseViews);

        Application.MsgBus.fireEvent("loggedin");
    }
}
/*
 * Update the map layers based on our stored preferences
 */
function updateMap() {

    var lstring = Application.getPreference("layers");
    if (lstring == null) {
        return;
    }
    var tokens = lstring.split("||");
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] == "") {
            continue;
        }
        var idx = Application.layerstore.find('title', tokens[i]);
        if (idx == -1) {
            continue;
        }
        Application.log("Setting Layer " + tokens[i] + " visable");
        var layer = Application.layerstore.getAt(idx).getLayer();
        layer.setVisibility(true);
    }
}

function setSounds() {
    Application.prefStore.each(function(record) {
        var key = record.get("key");
        if (key == "volume"){
            Ext.getCmp("volume").setValue(record.get("value"));
            return;
        }
        if (key.indexOf("sound::") != 0) {
            return;
        }
        var tokens = key.split("::");
        if (tokens.length != 3) {
            return;
        }
        var sidx = tokens[1];
        var opt = tokens[2];
        var store = Ext.getCmp("soundpanel").getStore();
        var idx = store.find('id', sidx);
        if (idx > -1) {
            var lrecord = store.getAt(idx);
            var val = record.get("value");
            if (val == "true"){
                val = true;
            }
            if (val == "false"){
                val = false;
            }
            lrecord.set(opt, val);
            //console.log("Setting sound "+ sidx +"| Opt "+ opt
            // +"| Value "+ val + "--"+ typeof(val));
        }
    });
}

/*
 * Parse preferences stored on the server side, please
 */
function parsePrefs(msg) {
    Application.prefStore.removeAll();
    var elem = $(msg).find("pref");
    for (var i = 0; i < elem.length; i++) {
        var key = elem[i].getAttribute("key");
        var value = elem[i].getAttribute("value");
        Application.setPreference(key, value);
    }
    Application.prefStore.locked = true;
    setSounds();
    var size = parseInt(Application.getPreference('font-size', 14)) + 2;
    // var cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
    var cssfmt = String.format('normal {0}px arial', size);
    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
    updateMap();
    Application.updateColors();
    Application.prefStore.locked = false;
}

function parseViews(msg) {
    if (!Ext.getCmp("map")) {
        return;
    }
    var elem = $(msg).find("view");
    for (var i = 0; i < elem.length; i++) {
        var label = elem[i].getAttribute("label");
        var bounds = elem[i].getAttribute("bounds");
        if (label != "") {
            Ext.getCmp("mfv" + (i + 1)).setValue(label);
            Ext.getCmp("fm" + (i + 1)).setText(label);
        }
        Ext.getCmp("mfv" + (i + 1)).bounds = OpenLayers.Bounds.fromArray(bounds
                .split(","));
        if (i == 0) {
            Ext.getCmp('map').map.zoomToExtent(OpenLayers.Bounds
                            .fromArray(bounds.split(",")), true);
        }
    }
}

function parseBookmarks(msg) {
    var elem = $(msg).find("conference");
    var autoJoinedRooms = 0;
    for (var i = 0; i < elem.length; i++) {
        var alias = elem[i].getAttribute("name");
        var jid = elem[i].getAttribute("jid");
        var nick = $(elem[i]).find('nick').text();
        if (nick == null || nick == "") {
            nick = Application.USERNAME;
        }
        var anonymous = (elem[i].getAttribute("anonymous") == 'true');
        var autojoin = (elem[i].getAttribute("autojoin") == 'true');

        Ext.getCmp("bookmarks").root.appendChild({
                    text : alias + " (" + Strophe.getNodeFromJid(jid) + ")",
                    jid : jid,
                    alias : alias,
                    autojoin : autojoin,
                    iconCls : 'chatroom-icon',
                    handle : nick,
                    anonymous : anonymous,
                    leaf : true
                });
        if (autojoin && Ext.getCmp("chatpanel").getMUC(jid) == null) {
            /*
             * We need to slow down the loading of chatrooms as this can be
             * a very expensive browser operation, IE will complain about
             * unresponsive script.
             */
            Application.log("Autojoining MUC: "+ jid);
            (function() {
                Application.MsgBus.fireEvent('joinchat', this.jid, this.nick, 
                        this.anonymous);
            }).defer(5000*autoJoinedRooms, {
                jid : jid,
                nick : nick,
                anonymous : anonymous
            });
            autoJoinedRooms += 1;
        }
    }
    Ext.getCmp('bookmarks').root.initialLoad = true;
}


function onIQ(msg) {
    try {
        iqParser(msg);
    } catch (err) {
        console.error("IQ Bug:", err);
        console.error("Stack trace:", err.stack);
        console.error("Message:", Strophe.serialize(msg));
        Application.log("IQ Bug - see console for details: " + err.message);
    }
    return true;
}

function iqParser(msg) {
    if (msg.getAttribute('id') == 'fetchrooms') {
        var items = msg.firstChild.getElementsByTagName('item');
        for (var i = 0; i < items.length; i++) {

            Ext.getCmp("chatrooms").root.appendChild({
                        text : items[i].getAttribute("name")
                                + " ("
                                + Strophe.getNodeFromJid(items[i]
                                        .getAttribute('jid')) + ")",
                        jid : items[i].getAttribute('jid'),
                        iconCls : 'chatroom-icon',
                        leaf : true
                    });
        }
        var myTreeSorter = new Ext.tree.TreeSorter(Ext.getCmp("chatrooms"), {
                    folderSort : true,
                    dir : 'asc'
                });
        myTreeSorter.doSort(Ext.getCmp("chatrooms").getRootNode());
    }
}

function onRoster(msg) {
    try {
        rosterParser(msg);
    } catch (err) {
        var vDebug = "Roster Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function rosterParser(msg) {
    var root = Ext.getCmp("buddies").root;
    var roster_items = $(msg).find('item');
    for (var i = 0; i < roster_items.length; i++) {
        /* Look to see if there is a group */
        var groups = $(roster_items[i]).find('group');
        for (var j = 0; j < groups.length; j++) {
            var group = $(groups[j]);
            var child = root.findChild('group', group.text()) || root.appendChild({
                        leaf : false,
                        group : group.text(),
                        text : group.text(),
                        expanded : true,
                        loaded : true
                    });

            child.appendChild({
                        text : roster_items[i].getAttribute('name'),
                        barejid : roster_items[i].getAttribute('jid'),
                        resources : new Ext.util.MixedCollection(),
                        iconCls : 'buddy-offline',
                        presence : 'offline',
                        hidden : true,
                        leaf : true
                    });
            // console.log("Buddy JID:"+ roster_items[i].getAttribute('jid')
            // +" Group:"+ group.text() );
        }
    }
    /* Send initial presence */
    Application.XMPPConn.send($pres().tree());
        /* Send request for private storage */
        var stanza = $iq({
             type : 'get',
             id : '_get1'
             }).c('query', {
                  xmlns : 'jabber:iq:private'
                  }).c('storage', {
                       xmlns : 'storage:bookmarks'
                       }).tree();
        (function() {
          Application.XMPPConn.sendIQ(stanza, parseBookmarks);
        }).defer(3000, this);

    return true;
}

function onPresence(msg) {
    try {
        presenceParser(msg);
    } catch (err) {
        var vDebug = "Presence Bug\n:";
        vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
        for (var prop in err) {
            vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
        }
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
        Application.log(vDebug);
    }
    return true;
}

function getMUCIcon(affiliation) {
    if (affiliation == 'owner')
        return 'icons/owner.png';
    if (affiliation == 'admin')
        return 'icons/admin.png';

    return 'icons/participant.png';
}

function presenceParser(msg) {
    var from = msg.getAttribute('from');

    // Lets see if this is from a chatroom!
    if (Strophe.getDomainFromJid(from) == 'conference.' + Application.XMPPHOST) {
        var room = Strophe.getBareJidFromJid(from);
        var mcp = Ext.getCmp("chatpanel").getMUC(room);
        if (mcp == null) {
            Application.log("ERROR: got presence from non-existant room: "
                    + room);
            return;
        }
        /* Look to see if we got a 201 status */
        if ($(msg).find('status').length > 0) {
            var error = $(msg).find('status');
            if (error[0].getAttribute('code') == '201') {
                Ext.Msg.alert('Status', 'Sorry, chatroom [' + room
                                + '] does not exist.');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 407 error */
        if ($(msg).find('error').length > 0) {
            error = $(msg).find('error');
            if (error[0].getAttribute('code') == '407') {
                Ext.Msg.alert('Status',
                        'Sorry, your account is not authorized to access chatroom ['
                                + room + ']');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 409 error */
        if ($(msg).find('error').length > 0) {
            error = $(msg).find('error');
            if (error[0].getAttribute('code') == '409') {
                Ext.Msg.alert('Status',
                        'Sorry, your requested chatroom handle is already in use by room ['
                                + room + ']');
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        /* Look to see if we got a 307 error */
        if ($(msg).find('status').length > 0) {
            error = $(msg).find('status');
            if (error[0].getAttribute('code') == '307') {
                Ext.Msg.alert('Status',
                                'Your account signed into this chatroom ['
                                        + room
                    + '] with the same handle from another location. Please use unique handles.');
                mcp.joinedChat = false;
                Ext.getCmp('chatpanel').removeMUC(room);
                return;
            }
        }
        var child = mcp.roomusers.root.findChild('text', Strophe
                        .getResourceFromJid(from));

        /* Look to see if we can see JIDs */
        var xitem = $(msg).find("item");
        var jid = from;
        var affiliation;
        var role;
        if (xitem.length > 0) {
            jid = xitem[0].getAttribute("jid") || jid;
            role = xitem[0].getAttribute("role");
            affiliation = xitem[0].getAttribute("affiliation");
            /*
             * <presence xmlns='jabber:client'
             * to='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * from='mafchat@conference.localhost/fire-daryl.e.herzmann'> <x
             * xmlns='http://jabber.org/protocol/muc#user'> <item><role>visitor</role></item></x>
             * <x xmlns='http://jabber.org/protocol/muc#user'> <item
             * jid='fire-daryl.e.herzmann@localhost/Live_127.0.0.1'
             * affiliation='none' role='participant'/></x> </presence>
             */
            var roletest = $(xitem[0]).find("role");
            if (roletest.length > 0) {
                try {
                    role = roletest.text();
                } catch (err) {
                    var vDebug = "roletest bug\n:";
                    vDebug += Strophe.xmlescape(Strophe.serialize( msg )) + "\n";
                    for (var prop in err) {
                        vDebug += "property: " + prop + " value: [" + err[prop]
                                + "]\n";
                    }
                    vDebug += "toString(): " + " value: [" + err.toString()
                            + "]";
                    Application.log(vDebug);
                }
            }
        }

        if (msg.getAttribute('type') == null) {
            // affiliation='none' role='participant'
            // affiliation='none' role='none' <-- Leave Room
            // affiliation='owner' role='moderator'

            if (!child && role != 'visitor') {
                mcp.joinedChat = true;
                mcp.roomusers.root.appendChild({
                            affiliation : affiliation,
                            role : role,
                            icon : getMUCIcon(affiliation, role),
                            text : Strophe.getResourceFromJid(from),
                            jid : jid,
                            leaf : true
                        });
            }
        }
        if (msg.getAttribute('type') == 'unavailable') {
            if (child) {
                mcp.roomusers.root.removeChild(child);
            }
        }
    } else {
        onBuddyPresence(msg);
    }
}

function onMessage(msg) {
    try {
        messageParser(msg);
    } catch (err) {
        console.error("Message Bug:", err);
        console.error("Stack trace:", err.stack);
        console.error("Message:", Strophe.serialize(msg));
        Application.log("Message Bug - see console for details: " + err.message);
    }
    return true;
}
// http://stackoverflow.com/questions/37684
Application.replaceURLWithHTMLLinks = function(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if (text == null) return null;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
};

function messageParser(msg) {
    //var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var x = $(msg).find("delay[xmlns='urn:xmpp:delay']");
    var html = $(msg).find('html');
    var body = elems[0];
    var txt = "";
    var isDelayed = false;
    var stamp;
    
    /*
     * We need to simplify the message into something that
     * will display pretty. 
     */
    if (html.length > 0) {
                var v = $(msg).find('html').find('body');
                txt = (navigator.userAgent.match(/msie/i)) ? v[0].xml : $(v[0]).html();
        txt = txt.replace(/\<p/g, "<span").replace(/\<\/p\>/g,"</span>");
        if (txt == ""){
            Application.log("Message Failure:"+ msg);
            txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
        }
    } else {
        txt = Application.replaceURLWithHTMLLinks(Strophe.getText(body));
    }

    if (x.length > 0) {
        stamp = UTCStringToDate(x[0].getAttribute('stamp').substring(0, 19),
                                'Y-m-d\\Th:i:s');
        isDelayed = true;
    } else {
        stamp = new Date();
    }
    
    if (type == "groupchat") {
        /* Look to see if a product_id is embedded */
        var product_id = null;
        var x = $(msg).find('x');
        for (var i = 0; i < x.length; i++) {
            if (x[i].getAttribute("product_id")) {
                product_id = x[i].getAttribute("product_id");
            }
        }
        geomParser(msg, isDelayed);
        var sender = Strophe.getResourceFromJid(from);
        var room = Strophe.getBareJidFromJid(from);
        var mpc = Ext.getCmp("chatpanel").getMUC(room);
        if (mpc && sender) {
            mpc.gp.getStore().addSorted(new Ext.data.Record({
                        ts : stamp,
                        author : sender,
                        message : txt,
                        room : null,
                        jid : mpc.getJidByHandle(sender),
                        xdelay : isDelayed,
                        product_id : product_id
                    }));
            // i = mpc.gp.getStore().getCount() - 1;
            // row = mpc.gp.getView().getRow(i);
            // if (row) row.scrollIntoView();
            if (mpc.gp.getStore().isFiltered()) {
                mpc.gp.getStore().filterBy(iembotFilter);
            }
            if (!isDelayed){
                /* Add to allchats */
                Ext.getCmp("__allchats__").gp.getStore().addSorted(new Ext.data.Record({
                    ts : stamp,
                    author : sender,
                    room : Strophe.getNodeFromJid(from),
                    message : txt,
                    jid : mpc.getJidByHandle(sender),
                    xdelay : isDelayed,
                    product_id : product_id
                }));
                if (Ext.getCmp("__allchats__").gp.getStore().isFiltered()) {
                    Ext.getCmp("__allchats__").gp.getStore().filterBy(iembotFilter);
                }
            }
        }
    } else if (type == "chat" && !txt && from != null) {
        var jid = Strophe.getBareJidFromJid(from);
        var cp = Ext.getCmp("chatpanel").getChat(jid);
        /* Chat states stuff! */
        var composing = $(msg).find("composing");
        if (composing.length > 0) {
            if (cp) {
                cp.setIconCls("typing-tab");
            }
        } /*
             * var active = $(msg).find("active"); if (active.length > 0){
             *  } var inactive = $(msg).find("inactive"); if (inactive.length >
             * 0){
             *  } var gone = $(msg).find("gone"); if (gone.length > 0){
             *  }
             */
        var paused = $(msg).find("paused");
        if (paused.length > 0) {
            if (cp) {
                cp.setIconCls("paused-tab");
            }
        }

    } else if (type == "chat" && txt && from != null) {

        var jid = Strophe.getBareJidFromJid(from);
        var username = Strophe.getNodeFromJid(from);
        if (Strophe.getDomainFromJid(from) != Application.XMPPHOST) {
            jid = from;
            username = Strophe.getResourceFromJid(from);
        }
        var cp = Ext.getCmp("chatpanel").getChat(jid);
        if (!cp) {
            cp = Ext.getCmp("chatpanel").addChat(jid);
            Application.MsgBus.fireEvent("soundevent", "new_conversation");
        }
        // Ext.getCmp("chatpanel").setActiveTab(cp);
        cp.gp.store.addSorted(new Ext.data.Record({
                    ts : stamp,
                    author : username,
                    room : null,
                    xdelay : false,
                    message : txt
                }));
        // i = cp.gp.store.getCount() - 1;
        // cp.gp.getView().getRow(i).scrollIntoView();
    } else if (from == Application.XMPPHOST) {
        /* Broadcast message! */
        (new Ext.Window({
                    width : 500,
                    maxWidth: 500,
                    height : 350,
                    constrain : true,
                    autoScroll : true,
                    bodyStyle : {
                        padding : '10',
                        background : '#fff'
                    },
                    title : $(msg).find("subject").text()
                            || 'System Message',
                    html : "<p><b>System Message</b><p>" + $(msg).find('body').text() + "</p>"

                })).show();
    }
}
function geomParser(msg, isDelayed) {
    if (!Ext.getCmp("map")) {
        return;
    }
    /* Look for iembot geometry declarations */
    var elems = msg.getElementsByTagName('body');
    var body = elems[0];
    var html = msg.getElementsByTagName('html');
    var txt = null;
    if (html.length > 0) {
                var v = $(msg).find('html').find('body');
                txt = (navigator.userAgent.match(/msie/i)) ? v[0].xml : $(v[0]).html();
    } else {
        txt = Strophe.getText(body);
    }
    var x = $(msg).find('x');
    if (x.length == 0) {
        return;
    }
    for (var i = 0; i < x.length; i++) {

        if (x[i].getAttribute("geometry") == null) {
            continue;
        }
        var geom = x[i].getAttribute('geometry');
        var wkt = new OpenLayers.Format.WKT();
        var collection = wkt.read(geom);
        if (collection) {
            if (collection.constructor != Array) {
                collection = [collection];
            }
            var vect = collection[0];
            /* Now we figure out when to remove this display */
            /* Our default duration is 2 hours, for LSRs */
            var delayed = 60 * 60 * 1000;
            if (x[i].getAttribute("skip")) {
                continue;
            }
            if (x[i].getAttribute("expire")) {
                var d = UTCStringToDate(x[i].getAttribute("expire"),
                        'Ymd\\Th:i:s');
                vect.attributes.expire = d.toUTC();
                var diff = d - (new Date());
                // console.log("Product Time Diff:"+ diff);
                if (diff <= 0) {
                    continue;
                }
                if (diff > 0) {
                    delayed = diff;
                }
            }
            if (x[i].getAttribute("valid")) {
                var d = UTCStringToDate(x[i].getAttribute("valid"),
                        'Ymd\\Th:i:s');
                vect.attributes.valid = d.toUTC();
            }
            // console.log("Product Time Delayed:"+ delayed);
            vect.attributes.ptype = x[i].getAttribute('ptype');
            vect.attributes.message = txt;
            vect.geometry.transform(new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));
            if ((x[i].getAttribute("category") == 'LSR' || x[i]
                    .getAttribute("category") == 'PIREP')
                    && vect.attributes.valid) {
                if (!isDelayed
                        || (isDelayed && ((new Date()) - vect.attributes.valid) < 7200000)) {
                    var lsrs = Application.lsrStore.layer;
                    lsrs.addFeatures([vect]);
                    (new Ext.util.DelayedTask(function() {
                                lsrs.removeFeatures([vect]);
                            })).delay(delayed);
                    var sstate = Application.lsrStore.getSortState();
                    Application.lsrStore.sort(sstate.field, sstate.direction);
                }
            }
            if (x[i].getAttribute("category") == 'SBW') {
                vect.attributes.vtec = x[i].getAttribute('vtec');
                var recordID = Application.sbwStore.find('vtec',
                        vect.attributes.vtec);
                if (x[i].getAttribute("status") == 'CAN') {
                    if (recordID > -1) {
                        Application.log('Removing SBW vtec ['
                                + vect.attributes.vtec + ']');
                        Application.sbwStore.removeAt(recordID);
                    }
                    continue;
                }
                if (recordID > -1) {
                    Application.log('Old SBW vtec [' + vect.attributes.vtec
                            + ']');
                    Application.sbwStore.removeAt(recordID);
                }
                Application.log('Adding SBW vtec [' + vect.attributes.vtec
                        + '] delay [' + delayed + ']');
                var sbws = Application.sbwStore.layer;
                sbws.addFeatures([vect]);
                (new Ext.util.DelayedTask(function() {
                            sbws.removeFeatures([vect]);
                        })).delay(delayed);
                var sstate = Application.sbwStore.getSortState();
                Application.sbwStore.sort(sstate.field, sstate.direction);

            }
        }
    }
}
// function log(msg) {
// Ext.getCmp('debug').body.insertHtml('beforeEnd', msg +"<br />");
// if (console in window){
// console.log(msg);
// }

// }
function rawInput(data) {
    Application.log('RECV: ' + Strophe.xmlescape(data));
}

function rawOutput(data) {
    Application.log('SENT: ' + Strophe.xmlescape(data));
}


/*
 * Update the style of the text entry window, typically
 * called after the preference is changed...
 */
Application.updateColors = function() {
    var bgcolor = Application.getPreference('bgcolor', 'FFFFFF');
    var fgcolor = Application.getPreference('fgcolor', '000000');
    Application.log('Attempting style adjustment bgcolor:'+
               bgcolor +', fgcolor:'+ fgcolor);
    Ext.getCmp("chatpanel").items.each(function(p) {
                if (p.te) {
                    
                    p.te.items.get(0).getEl().applyStyles({
                                background : '#' + bgcolor,
                                color : '#' + fgcolor
                            });
                }
            });
    /*
    Ext.util.CSS.updateRule('.me', 'color', 
            '#'+ Application.getPreference("handle_fgcolor", "000000"));
    Ext.util.CSS.updateRule('.me', 'background', 
            '#'+ Application.getPreference("handle_bgcolor", "FFFFFF"));
            */
};

/* 
 * Sync application Preferences upstream!
 */
Application.syncPreferences = function(){
    Application.log("Saving preferences to server...");
    var stanza = $iq({
                                type : 'set',
                                id : '_set1'
                            }).c('query', {
                                xmlns : 'jabber:iq:private'
                            }).c('storage', {
                                xmlns : 'nwschatlive:prefs'
                            });
    Application.prefStore.each(function(record) {
                                this.c('pref', {
                                            key : record.get("key"),
                                            value : record.get("value")
                                        }).up();
    }, stanza);
    if (Application.XMPPConn !== undefined){
        Application.XMPPConn.sendIQ(stanza.tree());
    }
};

Application.removePreference = function(key) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    Application.prefStore.removeAt(idx);
  }
};

Application.getPreference = function(key, base) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    var record = Application.prefStore.getAt(idx);
    return record.get('value');
  }
  return base;
};

Application.setPreference = function(key, value) {
  var idx = Application.prefStore.find('key', key);
  if (idx > -1) {
    Application.log("Setting Preference: "+ key +" Value: "+ value);
    var record = Application.prefStore.getAt(idx);
    record.set('value', value);
  } else {
        Application.log("Adding Preference: "+ key +" Value: "+ value);
        Application.prefStore.add(new Ext.data.Record({
                    key : key,
                    value : value
                }));
    }
};

/*
 * This will be how we handle the management and storage of application
 * preferences. It is a simple store, which can save its values to XMPP Private
 * Store
 */
Application.prefStore = new Ext.data.Store({
            fields : [{
                        id : 'key'
                    }, {
                        id : 'value'
                    }],
            locked : false,
            listeners : {
                remove : function(st, record, op) {
                    Application.log("prefStore remove event fired...");
                    if (st.locked) {
                        Application
                                .log("Skipping preference save due to locking");
                        return true;
                    }
                    /* save preferences to xmpp private storage */
                    Application.syncPreferences();
                },
                update : function(st, record, op) {
                    Application.log("prefStore update event fired...");
                    if (st.locked) {
                        Application
                                .log("Skipping preference save due to locking");
                        return true;
                    }
                    /* save preferences to xmpp private storage */
                    Application.syncPreferences();

                    if (record.get('key') == 'fgcolor'
                        || record.get('key') == 'bgcolor') {
                        Application.updateColors();
                    }

                }
            }
        });

