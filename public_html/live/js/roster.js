Ext.ns('Application');
/*
 * Handles all of the ROSTER related activities
 */

/*
 * Handle presence from a buddy. This gets into complicated UI land, but we'll
 * try to handle it all
 */
function onBuddyPresence(msg) {

	// Okay, we know who we got the presence from
	var jid = msg.getAttribute('from');
	var barejid = Strophe.getBareJidFromJid(jid);
	var resource = Strophe.getResourceFromJid(jid);
	var username = Strophe.getNodeFromJid(jid);
	var status = 'Available';
	/* IMPORTANT: If we find our own username, then we need to set a global 
	 * flag to prevent auto-login from working
	 */
	if (username == Application.USERNAME && 
	    resource != Application.XMPPRESOURCE && 
	    resource.match(/^NWSChatLive/)){
		if (msg.getAttribute('type') == 'unavailable'){
			Application.log("Self presence: ["+ username +"] ["+ resource +"] unavailable");			
		} else {
			Application.log("Self presence: ["+ username +"] ["+ resource +"] available");			
			if (Application.AUTOJOIN){
				Ext.Msg.alert('Warning',
						'The chat server indicated you have another '+Application.NAME+' session ['
								+ resource + '] active. Disabling auto-joined chatrooms.');
				Application.AUTOJOIN = false;
			}
		}
	}
	/* Check for status */
	if ($(msg).find('status').length > 0) {
		status = $(msg).find('status').text();
	}
	/* Check for subscription request */
	if (msg.getAttribute('type') == 'subscribe'){
		Ext.Msg.show({
			
			   title:'New Buddy Request',
			   msg: 'User '+ username +' wishes to add you as a buddy. Is this okay?',
			   buttons: Ext.Msg.YESNO,
			   fn: function(btn){
				 if (btn == 'yes'){
					 /* <presence to='fire-daryl.e.herzmann@localhost' type='subscribed'/> */
					 var stanza = $pres({to: jid, type: 'subscribed'});
					 Application.XMPPConn.send(stanza.tree());
					 Application.buildAddBuddy(username, username ,'Buddies');
				 }  else {
					 var stanza = $pres({to: jid, type: 'unsubscribed'});
					 Application.XMPPConn.send(stanza.tree()); 
				 }
			   },
			   icon: Ext.MessageBox.QUESTION
			});
		
		return;
	}

	// Go look for our barejid
	Ext.getCmp("buddies").root.eachChild(function(node) {
		node.eachChild(function(leaf){
			//console.log("Looking for:"+ barejid +", this node:"+ 
			//	leaf.attributes.jid);
				if (leaf.attributes.barejid == barejid) {
					res = leaf.attributes.resources.get(resource);
					if (!res){
						//console.log("Adding:"+ resource +" Status:"+ status);
						leaf.attributes.resources.add(resource, {
							status : status,
							resource : resource
						});
					}
					if (!msg.getAttribute('type')) {
						if ($(msg).find('show').length > 0) {
							leaf.setIconCls('buddy-away');
						} else {
							leaf.setIconCls('buddy-online');
						}
						leaf.attributes.presence = 'online';
						leaf.ui.show();
						//console.log("Replace"+ resource +" Status:"+ status);
						leaf.attributes.resources.replace(resource, {
							status : status,
							resource : resource
						});
					} else if (msg.getAttribute('type') == 'unavailable'){
						if (leaf.attributes.resources.length == 1){
							leaf.attributes.presence = 'offline';
							leaf.setIconCls('buddy-offline');
							leaf.ui.hide();
						}
						leaf.attributes.resources.remove(resource);
					}
				}
			});
	});

}
