Ext.ns("Application");

function saveBookmarks() {
	/* Save bookmarks to the server, please */
	var root = Ext.getCmp("bookmarks").root;
	var stanza = $iq({
				type : 'set',
				id : '_set1'
			}).c('query', {
				xmlns : 'jabber:iq:private'
			}).c('storage', {
				xmlns : 'storage:bookmarks'
			});
	root.eachChild(function(n) {
				this.c('conference', {
							name : n.attributes.alias,
							anonymous : n.attributes.anonymous ? 'true': 'false',
							autojoin : n.attributes.autojoin ? 'true': 'false',
							jid : n.attributes.jid
						}).c('nick', n.attributes.handle).up().up();
			}, stanza);
	Application.XMPPConn.sendIQ(stanza.tree());
}

function onPresenceCheck(item, checked) {
	if (item.xmpp == 'available') {
		Application.XMPPConn.send($pres());
	} else {
		Application.XMPPConn.send($pres().c('show', 'away').up().c('status',
				item.xmpp));
	}
	Ext.getCmp("presenceUI").setText(item.text);
};

Application.Control = {
	region : 'west',
	title : 'NWSChat Live',
	collapsible : true,
	width : 200,
	split : true,
	layout : 'accordion',
	layoutConfig : {
		autoWidth : false
	},
	autoScroll : true,
	tbar : [{
		text : "Actions",
		menu : [{
					checked : false,
					text : 'Show Offline Buddies',
					checkHandler : function(item, checked) {

						Ext.getCmp('buddies').root.cascade(function(n) {
									if (checked) {
										n.ui.show();
									} else {
										if (n.attributes.presence == 'offline') {
											n.ui.hide();
										}
									}
								});
					}
				}, {
					xtype : 'menuitem',
					text : 'Chat with User',
					handler : function() {
						Application.CreatePrivateChat.show();
					}
				}, {
					xtype : 'menuitem',
					text : 'Add Buddy...',
					handler : function() {
						Application.buildAddBuddy(null,null,null);
					}
				},{
					xtype : 'menuitem',
					text : 'Join Group Chat',
					handler : function() {
						Application.JoinChatroomDialog.show();
					}
				}, {
					text : 'Msg Text Color',
					menu : {
						items : [
							new Ext.ColorPalette({
								id : 'fgcolor',
								value : '000000',
								listeners : {
									select : function(cp,color){
										Application.setPreference('fgcolor', color);
									}
								}
							})
						]
					}
				},{
					text : 'Msg Background Color',
					menu : {
						items : [
							new Ext.ColorPalette({
								id : 'bgcolor',
								value : 'FFFFFF',
								listeners : {
									select : function(cp,color){
										Application.setPreference('bgcolor', color);
									}
								}
							})
						]
					}
				},{
					xtype : 'menuitem',
					text : 'Show Debug Window',
					handler : function() {
						Application.DebugWindow.show();
						
					}
				},{
					xtype : 'menuitem',
					text : 'Log Out',
					handler : function() {
						/* Don't try to reconnect */
						Application.log("Manual logout requested.");
						Application.RECONNECT = false;
						Application.XMPPConn.disconnect();
					}
				}]
	}, {
		xtype : 'tbseparator'
	}, {
		text : 'Available',
		id : 'presenceUI',
		menu : {
			items : [{
						text : 'Available',
						xmpp : 'available',
						checked : true,
						group : 'presence',
						checkHandler : onPresenceCheck
					}, {
						text : 'Be Right Back',
						xmpp : 'Be Right Back',
						checked : false,
						group : 'presence',
						checkHandler : onPresenceCheck
					}, {
						text : 'Away',
						xmpp : 'away',
						checked : false,
						group : 'presence',
						checkHandler : onPresenceCheck
					}]
		}
	}, {
		xtype : 'splitbutton',
		id : 'sound',
		scale : 'medium',
		soundOn : true,
		handler : function(btn) {
			if (btn.soundOn) {
				btn.setIcon('icons/mute.png');
				soundManager.muteAll();
				btn.soundOn = false;
			} else {
				btn.setIcon('icons/volume.png');
				soundManager.unmuteAll();
				btn.soundOn = true;
				Application.MsgBus.fireEvent("soundevent", "default");
			}
		},
		arrowHandler : function() {
			Application.soundPrefs.show();
		},
		icon : 'icons/volume.png'
	}],
	items : [{
				flex : 1,
				xtype : 'treepanel',
				id : 'buddies',
				title : 'Buddies',
				collapsed : false,
				rootVisible : false,
				lines : false,
				autoScroll : true,
				containerScroll: true,
				plugins: new Ext.ux.DataTip({
        			tpl: new Ext.XTemplate(
        			'<tpl if="typeof(resources) !== &quot;undefined&quot;">',
        			'<div>',
        			'<tpl for="resources.items">',
        				'<p><b>Resource:</b> {resource} <b>Status:</b> {status}</p>',
        			'</tpl>',
        			'</div>',
        			'</tpl>'
        			)
    			}),
				listeners : {
					click : function(n) {
						cp = Ext.getCmp("chatpanel").getChat( n.attributes.barejid );
						if (! cp){
							cp = Ext.getCmp("chatpanel").addChat( n.attributes.barejid );
						}
						Ext.getCmp("chatpanel").setActiveTab(cp);
					}
				},
				root : new Ext.tree.TreeNode()
			}, {
				flex : 1,
				xtype : 'treepanel',
				id : 'bookmarks',
				title : 'Chatroom Bookmarks',
				collapsed : false,
				rootVisible : false,
				enableDD : true,
				lines : false,
				containerScroll: true,
				autoScroll : true,
				plugins: new Ext.ux.DataTip({
        			tpl: '<div>Anonymous: {anonymous}<br />Autojoin: {autojoin}</div>'
    			}),
				contextMenu : new Ext.menu.Menu({
							items : [{
										id : 'delete-node',
										icon : 'icons/close.png',
										text : 'Delete Bookmark'
									}],
							listeners : {
								itemclick : function(item) {
									var n = item.parentMenu.contextNode;
									switch (item.id) {
										case 'delete-node' :
											if (n.parentNode) {
												n.remove();
												saveBookmarks();
											}
											break;
									}
								}
							}
						}),
				listeners : {
					contextmenu : function(node, e) {
						node.select();
						var c = node.getOwnerTree().contextMenu;
						c.contextNode = node;
						c.showAt(e.getXY());
					},
					movenode: function(tp, node, oldParent, newParent, index){
						saveBookmarks();
					},
					click : function(n) {
						Application.JoinChatroomDialog.show(null, function(){
							form = this.items.items[0].getForm();
							form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
							form.findField("roomhandle").setValue(n.attributes.handle);
							form.findField("bookmark").enable();
							form.findField("anonymous").setValue(n.attributes.anonymous);
							form.findField("autojoin").setValue(n.attributes.autojoin);
							form.findField("roomalias").setValue(n.attributes.alias);
							});
						}
				},
				root : new Ext.tree.TreeNode({
							initialLoad : false,
							listeners : {
								beforeappend : function(tree, root, node, index) {
									/*
									 * Ensure that we are appending an unique
									 * node
									 */
									var oldnode = root.findChild('jid', node.attributes.jid);
									if (oldnode) {
										Application.log("Replacing MUC bookmark: "+ node.attributes.jid );
										root.removeChild(oldnode, true);
									}
									return true; /* lets be safe */
								},
								append : function(tree, root, node, index) {
									if (root.initialLoad) {
										saveBookmarks();
									}
								}
							}
						})
			}, {
				flex : 2,
				xtype : 'treepanel',
				id : 'chatrooms',
				title : 'Chatrooms',
				collapsed : false,
				rootVisible : false,
				lines : false,
				autoScroll : true,
				containerScroll: true,
				listeners : {
					click : function(n) {
						Application.JoinChatroomDialog.show(null, function(){
							form = this.items.items[0].getForm();
							form.findField("roomname").setValue(Strophe.getNodeFromJid(n.attributes.jid));
							form.findField("roomhandle").setValue(Application.USERNAME);
							form.findField("bookmark").enable();
							form.findField("anonymous").setValue(false);
							form.findField("autojoin").setValue(false);
							form.findField("roomalias").setValue(Strophe.getNodeFromJid(n.attributes.jid));
							});
					}
				},
				root : new Ext.tree.TreeNode()
			}]
};

Application.doLogin = function() {
	Application.RECONNECT = true;
	Application.ATTEMPTS += 1;
	if (Application.ATTEMPTS > 11){
		Application.log("Application Login Limit Reached!");
		return;
	}
	username = Ext.getCmp('username').getValue();
	if (username.indexOf("@") > 0) {
		username = Strophe.getNodeFromJid(username);
	}
	username = username.toLowerCase();
	username = username.replace(/^\s+|\s+$/g, '');
	password = Ext.getCmp('password').getValue();
	if (username == "") {
		Application.log("Invalid Username");
		return;
	}
	if (password == "") {
		Application.log("Invalid Password");
		return;
	}
	Application.USERNAME = username;
	Application.login(username, password);
};

Application.buildView = function(cfg) {
	
	/*
	 * Register MapPanel events here?
	 */
	var mp = Ext.getCmp("map");
	if (mp){
		mp.map.events.register("changelayer", null, function(evt){
//		var layer = evt.layer;
//		if (evt.property == 'visibility' && !layer.isBaseLayer && layer.getVisibility()){
//			console.log(layer.name);
//		}
		var myobj = {lstring: ''};
		Application.layerstore.data.each(function(record) {
				var layer = record.getLayer();
				if (layer.getVisibility()) {
					this.lstring += "||"+ layer.name;
				}
		}, myobj);
		Application.setPreference("layers", myobj.lstring);
		});
		
		Ext.TaskMgr.start(Application.MapTask);
		/* Dunno why I have to wait until here */
		var ctrl = new OpenLayers.Control.SelectFeature([lsrs,sbws]);
		Ext.getCmp('map').map.addControl(ctrl);
		ctrl.activate();
	}
	



	Application.DebugWindow = new Ext.Window({
			width : 600,
			height : 300,
			title : 'Debug Window',
			closeAction : 'hide',
			hidden : true,
			autoScroll : true,
			layout : 'fit',
			renderTo:Ext.getBody(),
			tbar : [{
				text : 'Click to send this log to developer!',
				icon : 'icons/print.png',
				handler : function(){
					Ext.Ajax.request({
	   					url: 'bug.php',
	   					method : 'POST',
	   					success: function(response){
	   						alert(response.responseText);
	   					},
	   					failure: function () {
	   					},
	   					headers: {
	       					'my-header': 'foo'
	   					},
	  					 params: { data: Application.DebugWindow.items.items[0].body.dom.innerHTML,
	  					 user: Application.USERNAME }
					});
				}
			},{
				text : 'Clear Log',
				icon : 'icons/close.png',
				handler : function(){
					Ext.getCmp("sysmsg").update("");
				}
			}],
			items : [new Ext.Panel({
							title : 'Debug Log',
							
							html : "<p>Browser CodeName: " + navigator.appCodeName + "</p>"
+ "<p>Browser Name: " + navigator.appName + "</p>"
+ "<p>Browser Version: " + navigator.appVersion + "</p>"
+ "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>"
+ "<p>Platform: " + navigator.platform + "</p>"
+ "<p>User-agent header: " + navigator.userAgent + "</p>",
							id : 'sysmsg',
							autoScroll : true
				})
			]
		});


	Application.LoginDialog = new Ext.Window({
				width : 420,
				height: 250,
				autoScroll : true,
				modal : true,
				closable : false,
				title : 'NWSChat Live Login',
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				items : [{
							html : '<img src="../images/nws.png" width="100"/>',
							height : 105,
							width : 105
						}, {
							xtype : 'panel',
							autoShow : true,
							el : 'myloginform',
							layout : 'form',
							id : 'myform',
							width : 276,
							labelWidth : 76,
							defaultType : 'textfield',
							defaults : {
								allowBlank : false
							},
							items : [{
										anchor : '100%',
										el : 'username',
										id : 'username',
										autoShow : true,
										fieldLabel : 'Username'
									}, {
										anchor : '100%',
										el : 'password',
										id : 'password',
										autoShow : true,
										fieldLabel : 'Password',
										listeners : {
											specialkey : function(elTxt, e){
												if (e.getKey() === e.ENTER) {
                                                     Application.doLogin();
                                                     e.stopEvent();
                                                 }

											}
										}
									}],
							buttons : [{
									text : 'Show Debug',
									handler : function(){
										Application.DebugWindow.show();
									}
								},{
									text : "Browser Save Login",
									handler : function(b,e){
										Ext.get('submit').dom.click();	
									}
								},{
									text : "Login",
									handler : Application.doLogin
								}]
						},{
										xtype : 'panel',
										colspan : 2,
										contentEl : 'loginmessage',
										preventBodyReset : true
									}
					]
			});
	Application.LoginDialog.show();
};
