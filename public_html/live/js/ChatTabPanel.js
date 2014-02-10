Ext.ns("Application");

Application.ChatTabPanel = Ext.extend(Ext.ux.panel.DDTabPanel, {
	activeTab : 0,
	deferredRender : false,
	split : true,
        enableTabScroll: true,
	initComponent : function() {
		var config = {

		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		Application.ChatTabPanel.superclass.initComponent.apply(this,
				arguments);
		this.buildItems();
	},
	buildItems : function() {
		this.add({
			contentEl : 'help',
			title : 'Help',
			preventBodyReset : true,
			style : {
				margin : '5px'
			},
			autoScroll : true
		});
		this.add(new Application.MUCChatPanel({
			title : 'All Chats',
			closable : false,
			chatType : 'allchats',
			barejid : '__allchats__@'+ Application.XMPPMUCHOST,
			id : '__allchats__'
		}));
	},
	addMUC : function(barejid, handle, anonymous){
		var mcp = new Application.MUCChatPanel({
			title : Strophe.getNodeFromJid(barejid),
			barejid : barejid,
			handle : handle,
			anonymous : anonymous
		});
		return this.add(mcp);
	},
	getMUC : function(barejid){
		return this.find('barejid', barejid)[0];
	},
	removeMUC : function(barejid){
		this.remove( this.getMUC(barejid) );
	},
	addChat : function(jid){
		var title = Strophe.getNodeFromJid(jid);
		if (Strophe.getDomainFromJid(jid) == Application.XMPPMUCHOST){
			title = Strophe.getResourceFromJid(jid);
		}
		var cp = new Application.ChatPanel({
			title : title,
			handle : Application.USERNAME,
			barejid : jid
		});
		return this.add(cp);
	},
	getChat : function(jid){
		return this.find('barejid', jid)[0];
	},
	removeChat : function(jid){
		this.remove( this.getChat(jid) );
	}
});

Ext.reg('chattabpanel', Application.ChatTabPanel);
