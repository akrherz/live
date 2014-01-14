Ext.ns("Application");

Application.ChatPanel = Ext.extend(Ext.Panel, {
	hideMode : 'offsets',
	closable : true,
	layout : 'border',
	iconCls : 'tabno',
	chatType : 'chat',
	barejid : null,
	handle : null,
	anonymous : null,
	
	initComponent : function() {
		this.items = [
				new Application.ChatGridPanel({
					region : 'center'
				}),
				new Application.ChatTextEntry({
					region : 'south',
					height : 50,
					split : true
				})
			];
		var config = {
			listeners : {
				activate : function(self) {
					self.setIconCls('tabno');
				},
				deactivate : function(self) {
					self.setIconCls('tabno');
				},
				beforedestroy : function(self){
					if (self.te.chatstate){
						self.te.chatstate.cancel();
					}
					Application.XMPPConn.send($msg({
						to : self.barejid,
						type : self.chatType
					}).c("gone", {xmlns : 'http://jabber.org/protocol/chatstates'}));
				}
				
			}
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		Application.ChatPanel.superclass.initComponent.apply(this,
						arguments);
		this.buildItems();
	},
	getJidByHandle : function(handle){
		return this.barejid;
	},
	buildItems : function() {
		this.gp = this.items.items[0];
		this.te = this.items.items[1];
		/* Remove nwsbot muter */
		this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
		/* Remove sound muter */
		this.gp.getTopToolbar().remove( this.gp.getTopToolbar().items.items[3] );
	}
});

Ext.reg('chatpanel', Application.ChatPanel);