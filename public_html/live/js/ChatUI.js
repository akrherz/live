Ext.ns("Application");

/*
 * Need a simple filter for IEMBot messages
 */
function iembotFilter(record, _id){
    if (record.get("author") == "iembot"){ return false;}
      return true;
}

/*
 * Generate a html version of the active grid
 */
function grid2html(gridPanel) {
    var ds = gridPanel.getStore();
    var roomname = gridPanel.ownerCt.title;
    t = "<html><head></head><body>";
    t += "<table cellpadding='2' cellspacing='0' border='1'><tr><th>Roomname</th><th>Date</th><th>Author</th><th>Message</th></tr>";
    for (var i = 0; i < ds.getCount(); i++) {
        row = ds.getAt(i);
        t += String
                .format(
                        "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>\r\n",
                        row.get('roomname') || roomname, row.get("ts")
                                .format('Y/m/d g:i A'), row.get("author"), row
                                .get("message"));
    }
    t += "</table></body></html>";
    return t;
}
/*
 * Necessary to support changing the icon on the panel's tab
 */




function htmlExport(gridPanel) {
    if (Ext.isIE6 || Ext.isIE7 || Ext.isSafari || Ext.isSafari2
            || Ext.isSafari3) {
        Ext.Msg.alert('Status',
                'Sorry, this tool does not work with this browser.');
    } else {
        t = grid2html(gridPanel);
        document.location = 'data:plain/html;base64,' + encode64(t);
    }
};

function showHtmlVersion(gridPanel) {
    var win = new Ext.Window({
                title : 'Text Version',
                closable : true,
                width : 600,
                height : 350,
                plain : true,
                autoScroll : true,
                html : grid2html(gridPanel)
            });
    win.show();
};

var LinkInterceptor = {
    render : function(p) {
        p.body.on({
                    'mousedown' : function(e, t) { // try to intercept the easy
                        // way
                    
                        t.target = '_blank';
                        Application.TextWindow.hide();
                    },
                    'click' : function(e, t) { // if they tab + enter a link,
                        // need to do it old fashioned
                        // way
            
                        if (String(t.target).toLowerCase() != '_blank') {
                            e.stopEvent();
                            window.open(t.href);
                        }
                        Application.TextWindow.hide();
                    },
                    delegate : 'a'
                });
    }
};


/*
var msgFormatter = new Ext.XTemplate(
        '<p class="mymessage"><span class="myauthor">({ts:date("g:i A")}) ',
        '{author}: </span>', '{message}</p>');

function chatRenderer(value, p, record) {
    return msgFormatter.apply(record.data);
}
*/

