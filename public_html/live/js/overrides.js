/*
 * https://groups.google.com/forum/#!topic/strophe/glSI-BCNzls
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/*
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
 */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}

/* 
 * Need to be able to have filters that can be reapplied
 * http://www.sencha.com/forum/showthread.php?76029-DISCUSS-Persistent-store-filter
 * REMOVED, could not get to work, add store event would cause race with panel, sigh
 */

/*
 * Helper functions to move dates between UTC and the browser local time
 */
Ext.override(Date, {
    toUTC : function() {
        // Convert the date to the UTC date
        return this.add(Date.MINUTE, this.getTimezoneOffset());
    },
    fromUTC : function() {
        // Convert the date from the UTC date
        return this.add(Date.MINUTE, -this.getTimezoneOffset());
    }
});

/*
 * Be able to change the tab panel's icon on the fly
 */
Ext.override(Ext.Panel, {
    setIconCls : function(i) {
        Ext.fly(this.ownerCt.getTabEl(this)).child('.x-tab-strip-text')
                        .replaceClass(this.iconCls, i);
        this.setIconClass(i);
    }
});

/**
 * @version 0.4
 * @author nerdydude81
 */
Ext.override(Ext.Element, {
    /**
     * @cfg {string} printCSS The file path of a CSS file for printout.
     */
    printCSS : null,
    /**
     * @cfg {Boolean} printStyle Copy the style attribute of this element to the
     *      print iframe.
     */
    printStyle : false,
    /**
     * @property {string} printTitle Page Title for printout.
     */
    printTitle : document.title,
    /**
     * Prints this element.
     * 
     * @param config
     *            {object} (optional)
     */
    print : function(config) {
        Ext.apply(this, config);

        var el = Ext.get(this.id).dom;
        if (this.isGrid)
            el = el.parentNode;

        var c = document.getElementById('printcontainer');
        var iFrame = document.getElementById('printframe');

        var strTemplate = '<HTML><HEAD>{0}<TITLE>{1}</TITLE></HEAD><BODY onload="{2}"><DIV {3}>{4}</DIV></BODY></HTML>';
        var strLinkTpl = '<link rel="stylesheet" type="text/css" href="{0}"/>';
        var strAttr = '';
        var strFormat;
        var strHTML;

        if (c) {
            if (iFrame)
                c.removeChild(iFrame);
            el.removeChild(c);
        }

        for (var i = 0; i < el.attributes.length; i++) {
            if (Ext.isEmpty(el.attributes[i].value)
                    || el.attributes[i].value.toLowerCase() != 'null') {
                strFormat = Ext.isEmpty(el.attributes[i].value)
                        ? '{0}="true" '
                        : '{0}="{1}" ';
                if (this.printStyle ? this.printStyle : el.attributes[i].name
                        .toLowerCase() != 'style')
                    strAttr += String.format(strFormat, el.attributes[i].name,
                            el.attributes[i].value);
            }
        }

        var strLink = '';
        if (this.printCSS) {
            if (!Ext.isArray(this.printCSS))
                this.printCSS = [this.printCSS];

            for (var i = 0; i < this.printCSS.length; i++) {
                strLink += String.format(strLinkTpl, this.printCSS[i]);
            }
        }

        strHTML = String.format(strTemplate, strLink, this.printTitle, '',
                strAttr, el.innerHTML);

        c = document.createElement('div');
        c.setAttribute('style', 'width:0px;height:0px;'
                        + (Ext.isSafari
                                ? 'display:none;'
                                : 'visibility:hidden;'));
        c.setAttribute('id', 'printcontainer');
        el.appendChild(c);
        if (Ext.isIE)
            c.style.display = 'none';

        iFrame = document.createElement('iframe');
        iFrame.setAttribute('id', 'printframe');
        iFrame.setAttribute('name', 'printframe');
        c.appendChild(iFrame);

        iFrame.contentWindow.document.open();
        iFrame.contentWindow.document.write(strHTML);
        iFrame.contentWindow.document.close();

        if (this.isGrid) {
            var iframeBody = Ext.get(iFrame.contentWindow.document.body);
            var cc = Ext.get(iframeBody.first().dom.parentNode);
            cc.child('div.x-panel-body').setStyle('height', '');
            cc.child('div.x-grid3').setStyle('height', '');
            cc.child('div.x-grid3-scroller').setStyle('height', '');
        }
        if (Ext.isIE)
            iFrame.contentWindow.document.execCommand('print');
        else
            iFrame.contentWindow.print();
    }
});