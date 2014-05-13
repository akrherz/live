Ext.ns("Application");

Application.ChatTextEntry = Ext.extend(Ext.Panel, {
			layout : 'hbox',
			layoutConfig : {
				align : "stretch"
			},
			border : false,
			chatstate : null,
			initComponent : function() {
				
				this.items = [{
					xtype : 'textarea',
					flex : 1,
					cls : 'message-entry-box',				
					autoCreate : {
						tag : 'textarea',
						style : 'rows:10;cols:72;wrap:"hard";',
						autocomplete : 'off'
					},
					style : {
						background : '#'
								+ Application.getPreference('bgcolor', 'FFFFFF'),
						color : '#'
								+ Application.getPreference('fgcolor', '000000')
					},
					enableKeyEvents : true,
					listeners : {
						keyup : function(elTxt, e) {
							// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
							// e.TAB, e.ESC, arrow keys: e.LEFT,
							// e.RIGHT, e.UP,
							// e.DOWN
							if (e.getKey() === e.ENTER && !e.shiftKey) {
								if (this.chatstate){
									this.chatstate.cancel();
								}
								this.chatstate = null;
								this.ownerCt.getComponent(1).handler();
								return true;
							}
							/* Chat States! */
							if (this.ownerCt.ownerCt.chatType == 'chat') {
								if (!this.chatstate){
									this.chatstate = new Ext.util.DelayedTask(function(){
										if (!this.ownerCt || !this.ownerCt.ownerCt){
											return;
										}
										Application.XMPPConn.send($msg({
											to : this.ownerCt.ownerCt.barejid,
											type : this.ownerCt.ownerCt.chatType
										}).c("paused", {xmlns : 'http://jabber.org/protocol/chatstates'}));
										this.chatstate = null;
									}, this);
									Application.XMPPConn.send($msg({
										to : this.ownerCt.ownerCt.barejid,
										type : this.ownerCt.ownerCt.chatType
									}).c("composing", {xmlns : 'http://jabber.org/protocol/chatstates'}));
								}
								/* Wait 5 seconds before pausing */
								this.chatstate.delay(5000);
							}
						},
						render : {
							delay : 500,
							fn : function() {
								this.focus();
							}
						}
					}
				}, {
					xtype : 'button',
					text : 'Send',
					width : 60,
					popup : null,
					handler : function() {
						var txt = this.ownerCt.getComponent(0);
						var text = txt.getValue().trim();
						if (text.length === 0) {
							txt.focus();
							return false;
						}
						var bgcolor = Application.getPreference('bgcolor', 'FFFFFF');
						var fgcolor = Application.getPreference('fgcolor', '000000');
						
						/* allchat */
						if (this.ownerCt.ownerCt.chatType == "allchats"){
							txt.emptyText = '';
							txt.setValue('');
							(new Application.AllChatMessageWindow({
								message: Application.replaceURLWithHTMLLinks(text)
							})).show();
						} else {
						var nodes = $.parseHTML(Application.replaceURLWithHTMLLinks(text));
						var msg = $msg({
							to : this.ownerCt.ownerCt.barejid,
							type : this.ownerCt.ownerCt.chatType
						}).c("active", {xmlns : 'http://jabber.org/protocol/chatstates'}).up()
						.c("body").t(text).up().c("html", {
							xmlns : 'http://jabber.org/protocol/xhtml-im'
						}).c("body", {
							xmlns : 'http://www.w3.org/1999/xhtml'
						}).c("p").c("span", {
					style : "color:#" + fgcolor + ";background:#"
							+ bgcolor + ";"
						});
						for (var i=0;i<nodes.length;i++){
							msg = msg.cnode(nodes[i]);
							if (i < nodes.length){
							  msg = msg.up();
							}
						}
						Application.XMPPConn.send(msg);
						txt.setValue("");
						txt.focus();

						// Since we don't get our messages back via XMPP
						// we need to manually add to the store
						if (this.ownerCt.ownerCt.chatType == 'chat') {
							text = "<span "+ "style='color:#" + fgcolor + ";background:#" + bgcolor + ";'>"+ text +"</span>";
							this.ownerCt.ownerCt.gp.getStore().addSorted(new Ext.data.Record({
												ts : (new Date()),
												author : Application.USERNAME,
												message :Application.replaceURLWithHTMLLinks(text)
											}));
							//i = this.ownerCt.ownerCt.gp.getStore().getCount()
							//		- 1;
							//this.ownerCt.ownerCt.gp.getView().getRow(i).scrollIntoView();
						}
						}

					}
				}];
				Application.ChatTextEntry.superclass.initComponent.apply(this,
						arguments);

			}
		});

Ext.reg('chattextentry', Application.ChatTextEntry);
