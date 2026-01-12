/**
 * Login Panel Component
 * Simple panel with login content
 */

Ext.ns("Application");

/**
 * LoginPanel - Simple login panel with HTML content
 */
Application.LoginPanel = Ext.extend(Ext.Panel, {
    initComponent : function() {
        var config = {
            html: '<div style="text-align:center;"><img src="/images/nws.png" width="100"/></div>' +
                  '<p><label>Username:</label><br/>' +
                  '<input type="text" id="username" name="username" /></p>' +
                  '<p><label>Password:</label><br/>' +
                  '<input type="password" id="password" name="password" /></p>' +
                  '<p><button type="button" onclick="Application.doLogin()">Login</button> ' +
                  '<button type="button" onclick="Ext.getCmp(\'debug\').show()">Show Debug</button></p>' +
                  '<p>Welcome to Weather.IM... please log in with your user account.<br />' +
                  '<a href="/pwupdate.php">Forgot your password?</a></p>' +
                  '<hr/>' +
                  '<p><strong>Anonymous Login:</strong></p>' +
                  '<p>You can login to this service without registering. You will not be able to ' +
                  'chat within the rooms nor save preferences.</p>' +
                  '<button type="button" onclick="Application.doAnonymousLogin()">Login Anonymously</button>' +
                  '<hr/>' +
                  '<p><strong>Register for An Account:</strong></p>' +
                  '<p>Due to spammers, you need to register for an account <a href="/create.php">here</a>.</p>',
            border: false,
            autoScroll: true,
            bodyStyle: 'padding:10px'
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Application.LoginPanel.superclass.initComponent.apply(this, arguments);
    }
});
