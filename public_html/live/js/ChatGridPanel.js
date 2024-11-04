Ext.ns("Application");

Application.msgFormatter = new Ext.XTemplate(
        '<p class="mymessage">',
        '<span ',
        '<tpl if="values.me == values.author">', 'class="author-me"', "</tpl>",
        '<tpl if="values.me != values.author">', 
          'class="{[this.getAuthorClass(values.jid)]}" style="color: #{[Application.getUserColor(values.author)]};"',
        '</tpl>',
          '>(', '<tpl if="this.isNotToday(ts)">', '{ts:date("d M")} ', '</tpl>',
        '{ts:date("g:i A")}) ', 
        '<tpl if="values.room != null">', 
          '[{room}] ',
        '</tpl>',
        '{author}:</span> ', '{message}</p>', {
            isNotToday : function(ts) {
                return (new Date()).format('md') != ts.format('md');
            },
            getAuthorClass : function(jid) {
                //console.log("node: "+Strophe.getNodeFromJid(jid) );
                if (jid == null) return "author-default";
                if (Strophe.getNodeFromJid(jid) == 'iembot'){
                    return "author-iembot";
                }
                if (Strophe.getNodeFromJid(jid).match(/^nws/)){
                    return "author-nws";
                }

                return "author-chatpartner";
            }
        });

Application.ChatGridPanel = Ext.extend(Ext.grid.GridPanel, {
    region : 'center',
    soundOn : true,
    iembotHide: false,
    stripeRows : true,
    autoExpandColumn : 'message',
    autoScroll : true,

    tbar : [{
                text : 'Clear Room Log',
                cls : 'x-btn-text-icon',
                icon : 'icons/close.png',
                handler : function(btn, e) {
                    btn.ownerCt.ownerCt.getStore().removeAll();
                }
            }, {
                text : 'Print Log',
                icon : 'icons/print.png',
                cls : 'x-btn-text-icon',
                handler : function(btn, e) {
                    btn.ownerCt.ownerCt.getGridEl().print({
                                isGrid : true
                            });
                }
            }, {
                text : 'View As HTML',
                handler : function(btn, e) {
                    showHtmlVersion(btn.ownerCt.ownerCt);
                },
                icon : 'icons/text.png',
                cls : 'x-btn-text-icon'
            }, {
                text : 'Hide IEMBot',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    var pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                    +"::iembothidden";
                    var store = btn.ownerCt.ownerCt.getStore();
                    btn.ownerCt.ownerCt.iembotHide = toggled;
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        store.filterBy(iembotFilter);
                        btn.setText("IEMBot Hidden");
                    } else {
                        Application.removePreference(pref);
                        store.clearFilter(false);
                        btn.setText("Hide IEMBot");
                    }
                }
            }, {
                text : 'Mute Sounds',
                enableToggle : true,
                toggleHandler : function(btn, toggled) {
                    //var store = btn.ownerCt.ownerCt.getStore();
                    var pref = "muc::"+ Strophe.getNodeFromJid( btn.ownerCt.ownerCt.ownerCt.barejid )
                                +"::mute";
                    if (toggled) {
                        Application.setPreference(pref, 'true');
                        btn.ownerCt.ownerCt.soundOn = false;
                        btn.setText("Sounds Muted");
                    } else {
                        Application.removePreference(pref);
                        btn.ownerCt.ownerCt.soundOn = true;
                        btn.setText("Mute Sounds");
                    }
                }
            },{
                icon : 'icons/font-less.png',
                handler : function(){
                    var size = parseInt(Application.getPreference('font-size', 14)) - 2;
                    Application.setPreference('font-size', size);
                    //cssfmt = String.format('normal {0}px/{1}px arial', size, size +2);
                    cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }, {
                icon : 'icons/font-more.png',
                handler : function(){
                    var size = parseInt(Application.getPreference('font-size', 14)) + 2;
                    Application.setPreference('font-size', size);
                    cssfmt = String.format('normal {0}px arial', size);
                    Ext.util.CSS.updateRule('td.x-grid3-td-message', 'font', cssfmt);
                    Ext.util.CSS.updateRule('.message-entry-box', 'font', cssfmt);
                }
            }],
    initComponent : function() {
        this.columns = [{
                    header : 'Author',
                    sortable : true,
                    dataIndex : 'author',
                    hidden : true
                }, {
                    id : 'message',
                    header : 'Message',
                    sortable : true,
                    dataIndex : 'ts',
                    scope : this,
                    renderer : function(value, p, record) {
                        return Application.msgFormatter.apply({
                            author: record.get('author'),
                            message: record.get('message'),
                            ts: record.get('ts'),
                            room: record.get('room'),
                            jid: record.get('jid'),
                            me: this.ownerCt.handle});
                    }
                }];
        this.store = new Ext.data.ArrayStore({
                    sortInfo : {
                        field : 'ts',
                        direction : 'ASC'
                    },
                    fields : [{
                                name : 'ts',
                                type : 'date'
                            }, 'author', 'message', 'product_id', 'jid', 'room',
                            {
                                name : 'xdelay',
                                type : 'boolean'
                            }]
                });
        this.store.on('add', function(store, records, index) {
            if (!this.soundOn){
                return true;
            }
            var nonIEMBot = false;
            var nothingNew = true;
            for (var i = 0; i < records.length; i++) {
                /* No events for delayed messages */
                if (records[i].get('xdelay')){
                    continue;
                }
                /* No events if I talked! */
                if (records[i].get('author') == this.ownerCt.handle){
                    continue;
                }
                if (records[i].get("author") != "iembot") {
                    nonIEMBot = true;
                }
                if (records[i].get("message").match(/tornado/i)){
                    Application.MsgBus.fireEvent("soundevent", "tornado");
                }
                // TODO: figure out how to make this case insensitive
                if (records[i].get("message").match(this.ownerCt.handle)){
                    Application.MsgBus.fireEvent("soundevent", "myhandle");
                }
                nothingNew = false;
            }//end of for()
            if (nothingNew){
                return true;
            }
            if (nonIEMBot) {
                // Make this tab show the new icon for the new message
                this.ownerCt.setIconCls('new-tab');
                Application.MsgBus.fireEvent("soundevent", "new_message");
            } else {
                // If iembot is muted, lets stop the events
                if (! this.iembotHide){
                    this.ownerCt.setIconCls('new-tab');
                    Application.MsgBus.fireEvent("soundevent", "iembot");
                }
            }
        }, this);
        var config = {
            viewConfig : {
                onAdd : function(ds, records, index) {
                    this.constructor.prototype.onAdd.apply(this, arguments);
                    //this.grid.getSelectionModel().selectRow(index);
                    //this.focusRow(index);
                    
                    row = this.grid.getView().getRow(index);
                    if (row) row.scrollIntoView();
                },
                templates : {
                    cell : new Ext.Template(
                            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}"  tabIndex="0" {cellAttr}>',
                            '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                            '</td>')
                }
            },

            sm : new Ext.grid.RowSelectionModel({
                        listeners : {
                            rowselect : function(sm, rowIdx, r) {
                                if (r.data.product_id) {
                                    Application.TextWindow.show();
                                    Application.TextWindow.load({
                                                params : {
                                                    pid : r.data.product_id,
                                                    bypass : 1
                                                },
                                                text : 'Loading...',
                                                method : 'GET',
                                                url : '../p.php'
                                            });
                                }
                            }
                        }
                    }),
            listeners : {
                render : function(p) {
                    p.getView().mainBody.on('mousedown', function(e, t) {
                                //console.log("Daryl1:"+ t.tagName);
                                if (t.tagName == 'A') {
                                    e.stopEvent();
                                    t.target = '_blank';
                                }
                            });
                    p.body.on({
                                'mousedown' : function(e, t) { // try to
                                    // intercept the
                                    // easy
                                    // way
                                    //console.log("Daryl2:"+ t.tagName);
                                    t.target = '_blank';
                                    Application.TextWindow.hide();
                                },
                                'click' : function(e, t) { // if they tab +
                                    // enter a link,
                                    // need to do it old fashioned
                                    // way
                                    //console.log("Daryl3:"+ t.tagName);
                                    if (String(t.target).toLowerCase() != '_blank') {
                                        e.stopEvent();
                                        window.open(t.href);
                                    }
                                    Application.TextWindow.hide();
                                },
                                delegate : 'a'
                            });

                }
            }
        };
        Ext.apply(this, config);

        Application.ChatGridPanel.superclass.initComponent.apply(this,
                arguments);

        /*
         * this.view = new Ext.grid.GridView({ cellTpl: new Ext.Template( '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div
         * class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"
         * {attr}>{value}</div>', '</td>' ) });
         */
    }
});

Ext.reg('chatgridpanel', Application.ChatGridPanel);