Ext.ns("Application");

Application.DebugWindow = Ext.extend(Ext.Window, {
	initComponent : function(){
		this.items = [{
			xtype: 'panel',
			title : 'Debug Log',

			html : "<p>Browser CodeName: " + navigator.appCodeName + "</p>"
			+ "<p>Browser Name: " + navigator.appName + "</p>"
			+ "<p>Browser Version: " + navigator.appVersion + "</p>"
			+ "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>"
			+ "<p>Platform: " + navigator.platform + "</p>"
			+ "<p>User-agent header: " + navigator.userAgent + "</p>",
			autoScroll : true
		}];
	
		this.tbar = [{
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
				this.items.items[0].update("");
			},
			scope: this
		}];	
		
        var config = {
        		width : 600,
        		height : 300,
        		title : 'Debug Window',
        		closeAction : 'hide',
        		hidden : true,
        		autoScroll : true,
        		layout : 'fit'
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.DebugWindow.superclass.initComponent.apply(this,
                                        arguments);
	}, // End of initComponent
	addMessage : function(msg){
        Application.msgtpl.append(
                this.items.items[0].body, {
                        msg : msg,
                        date : new Date()
                });
	} // End of addMessage
});
