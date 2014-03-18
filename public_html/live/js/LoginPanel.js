Ext.ns("Application");

Application.LoginWindow = Ext.extend(Ext.Window, { 

	initComponent : function() {
		
		this.items = [{
					html : '<img src="../images/nws.png" width="100"/>',
					height : 105,
					width : 105
		},{
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
					Ext.getCmp("debug").show();
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
				}];
        var config = {
        		width : 420,
        		height: 250,
        		autoScroll : true,
        		modal : true,
        		closable : false,
        		title : 'NWSChat Live Login',
        		layout : 'table',
        		layoutConfig : {
        			columns : 2
        		}
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Application.LoginWindow.superclass.initComponent.apply(this,
                                        						arguments);
	}, // end of initComponent
	addMessage : function(msg){
		Application.msgtpl.insertFirst(
				this.items.items[2].body, {
					msg : msg,
					date : new Date()
				});
	} // End of addMessage
});