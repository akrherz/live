Ext.ns("Application");

Application.colors = ['000000', //black
'666666', // 
'D51460', // 
'FF0000', // 
'993333', //  
'FF9900', // 
'005500', //
'009900', // 
'00DD00', // 
'0066CC', //
'3399FF', // 
'0000FF', // 
'6666FF' // 
];
Application.colorpointer = 0;

Application.UserColorStore = new Ext.data.Store({
    fields : ['user', 'color']
});

Application.getUserColor = function(user) {
    idx = Application.UserColorStore.find('user', user);
    if (idx == -1){
        c = Application.colors[ Application.colorpointer ];
        Application.UserColorStore.add(new Ext.data.Record({user: user, color: c}));
        Application.colorpointer++;
        if (Application.colorpointer > 12){
            Application.colorpointer = 0;
        }
    } else {
        c = Application.UserColorStore.getAt(idx).get("color");
    }
    return c;
};