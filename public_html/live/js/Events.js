Ext.ns("Application");

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
	Application.XMPPConn.sendIQ(stanza.tree());
};

Application.removePreference = function(key) {
	idx = Application.prefStore.find('key', key);
	if (idx > -1) {
		Application.prefStore.removeAt(idx);
	}
};

Application.getPreference = function(key, base) {
	idx = Application.prefStore.find('key', key);
	if (idx > -1) {
		record = Application.prefStore.getAt(idx);
		return record.get('value');
	}
	return base;
};

Application.setPreference = function(key, value) {

	idx = Application.prefStore.find('key', key);
	if (idx > -1) {
		Application.log("Setting Preference: "+ key +" Value: "+ value);
		record = Application.prefStore.getAt(idx);
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
		idx = Application.SoundStore.find('id', sidx);
		if (idx == -1) {
			Application.log("Could not find sound: " + sidx);
			return;
		}
		record = Application.SoundStore.getAt(idx);
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

	enable = Application.getPreference("sound::" + sevent + "::enabled", 'true');
	if (enable == 'false') {
		return;
	}
	sidx = Application.getPreference("sound::" + sevent + "::sound", 'default');
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

	//Application.LoginDialog.show();
});

Application.MsgBus.on('loggedout', function() {
	Application.LoginDialog.show();
});

Application.MsgBus.on('loggedin', function() {

			Application.LoginDialog.hide();

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
			mcp = Ext.getCmp("chatpanel").getMUC(room);
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