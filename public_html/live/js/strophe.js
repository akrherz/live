(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.strophe = {}));
})(this, (function (exports) { 'use strict';

    /**
     * This module provides uniform
     * Shims APIs and globals that are not present in all JS environments,
     * the most common example for Strophe being browser APIs like WebSocket
     * and DOM that don't exist under nodejs.
     *
     * Usually these will be supplied in nodejs by conditionally requiring a
     * NPM module that provides a compatible implementation.
     */

    /* global globalThis */

    /**
     * WHATWG WebSockets API
     * https://www.w3.org/TR/websockets/
     *
     * Interface to use the web socket protocol
     *
     * Used implementations:
     * - supported browsers: built-in in WebSocket global
     *   https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Browser_compatibility
     * - nodejs: use standard-compliant 'ws' module
     *   https://www.npmjs.com/package/ws
     */
    function getWebSocketImplementation() {
      if (typeof globalThis.WebSocket === 'undefined') {
        try {
          return require('ws');
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error('You must install the "ws" package to use Strophe in nodejs.');
        }
      }
      return globalThis.WebSocket;
    }
    const WebSocket = getWebSocketImplementation();

    /**
     * Retrieves the XMLSerializer implementation for the current environment.
     *
     * In browser environments, it uses the built-in XMLSerializer.
     * In Node.js environments, it attempts to load the 'jsdom' package
     * to create a compatible XMLSerializer.
     */
    function getXMLSerializerImplementation() {
      if (typeof globalThis.XMLSerializer === 'undefined') {
        let JSDOM;
        try {
          JSDOM = require('jsdom').JSDOM;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error('You must install the "ws" package to use Strophe in nodejs.');
        }
        const dom = new JSDOM('');
        return dom.window.XMLSerializer;
      }
      return globalThis.XMLSerializer;
    }
    const XMLSerializer = getXMLSerializerImplementation();

    /**
     * DOMParser
     * https://w3c.github.io/DOM-Parsing/#the-domparser-interface
     *
     * Interface to parse XML strings into Document objects
     *
     * Used implementations:
     * - supported browsers: built-in in DOMParser global
     *   https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility
     * - nodejs: use 'jsdom' https://www.npmjs.com/package/jsdom
     */
    function getDOMParserImplementation() {
      const DOMParserImplementation = globalThis.DOMParser;
      if (typeof DOMParserImplementation === 'undefined') {
        // NodeJS
        let JSDOM;
        try {
          JSDOM = require('jsdom').JSDOM;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error('You must install the "jsdom" package to use Strophe in nodejs.');
        }
        const dom = new JSDOM('');
        return dom.window.DOMParser;
      }
      return DOMParserImplementation;
    }
    const DOMParser = getDOMParserImplementation();

    /**
     * Creates a dummy XML DOM document to serve as an element and text node generator.
     *
     * Used implementations:
     *  - browser: use document's createDocument
     * - nodejs: use 'jsdom' https://www.npmjs.com/package/jsdom
     */
    function getDummyXMLDOMDocument() {
      if (typeof document === 'undefined') {
        // NodeJS
        let JSDOM;
        try {
          JSDOM = require('jsdom').JSDOM;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error('You must install the "jsdom" package to use Strophe in nodejs.');
        }
        const dom = new JSDOM('');
        return dom.window.document.implementation.createDocument('jabber:client', 'strophe', null);
      }
      return document.implementation.createDocument('jabber:client', 'strophe', null);
    }

    var shims = /*#__PURE__*/Object.freeze({
        __proto__: null,
        WebSocket: WebSocket,
        XMLSerializer: XMLSerializer,
        DOMParser: DOMParser,
        getDummyXMLDOMDocument: getDummyXMLDOMDocument
    });

    /**
     * Common namespace constants from the XMPP RFCs and XEPs.
     *
     * @typedef { Object } NS
     * @property {string} NS.HTTPBIND - HTTP BIND namespace from XEP 124.
     * @property {string} NS.BOSH - BOSH namespace from XEP 206.
     * @property {string} NS.CLIENT - Main XMPP client namespace.
     * @property {string} NS.AUTH - Legacy authentication namespace.
     * @property {string} NS.ROSTER - Roster operations namespace.
     * @property {string} NS.PROFILE - Profile namespace.
     * @property {string} NS.DISCO_INFO - Service discovery info namespace from XEP 30.
     * @property {string} NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
     * @property {string} NS.MUC - Multi-User Chat namespace from XEP 45.
     * @property {string} NS.SASL - XMPP SASL namespace from RFC 3920.
     * @property {string} NS.STREAM - XMPP Streams namespace from RFC 3920.
     * @property {string} NS.BIND - XMPP Binding namespace from RFC 3920 and RFC 6120.
     * @property {string} NS.SESSION - XMPP Session namespace from RFC 3920.
     * @property {string} NS.XHTML_IM - XHTML-IM namespace from XEP 71.
     * @property {string} NS.XHTML - XHTML body namespace from XEP 71.
     * @property {string} NS.STANZAS
     * @property {string} NS.FRAMING
     */
    const NS = {
      HTTPBIND: 'http://jabber.org/protocol/httpbind',
      BOSH: 'urn:xmpp:xbosh',
      CLIENT: 'jabber:client',
      SERVER: 'jabber:server',
      AUTH: 'jabber:iq:auth',
      ROSTER: 'jabber:iq:roster',
      PROFILE: 'jabber:iq:profile',
      DISCO_INFO: 'http://jabber.org/protocol/disco#info',
      DISCO_ITEMS: 'http://jabber.org/protocol/disco#items',
      MUC: 'http://jabber.org/protocol/muc',
      SASL: 'urn:ietf:params:xml:ns:xmpp-sasl',
      STREAM: 'http://etherx.jabber.org/streams',
      FRAMING: 'urn:ietf:params:xml:ns:xmpp-framing',
      BIND: 'urn:ietf:params:xml:ns:xmpp-bind',
      SESSION: 'urn:ietf:params:xml:ns:xmpp-session',
      VERSION: 'jabber:iq:version',
      STANZAS: 'urn:ietf:params:xml:ns:xmpp-stanzas',
      XHTML_IM: 'http://jabber.org/protocol/xhtml-im',
      XHTML: 'http://www.w3.org/1999/xhtml'
    };
    const PARSE_ERROR_NS = 'http://www.w3.org/1999/xhtml';

    /**
     * Contains allowed tags, tag attributes, and css properties.
     * Used in the {@link Strophe.createHtml} function to filter incoming html into the allowed XHTML-IM subset.
     * See [XEP-0071](http://xmpp.org/extensions/xep-0071.html#profile-summary) for the list of recommended
     * allowed tags and their attributes.
     */
    const XHTML = {
      tags: ['a', 'blockquote', 'br', 'cite', 'em', 'img', 'li', 'ol', 'p', 'span', 'strong', 'ul', 'body'],
      attributes: {
        'a': ['href'],
        'blockquote': ['style'],
        /** @type {never[]} */
        'br': [],
        'cite': ['style'],
        /** @type {never[]} */
        'em': [],
        'img': ['src', 'alt', 'style', 'height', 'width'],
        'li': ['style'],
        'ol': ['style'],
        'p': ['style'],
        'span': ['style'],
        /** @type {never[]} */
        'strong': [],
        'ul': ['style'],
        /** @type {never[]} */
        'body': []
      },
      css: ['background-color', 'color', 'font-family', 'font-size', 'font-style', 'font-weight', 'margin-left', 'margin-right', 'text-align', 'text-decoration']
    };

    /** @typedef {number} connstatus */

    /**
     * Connection status constants for use by the connection handler
     * callback.
     *
     * @typedef {Object} Status
     * @property {connstatus} Status.ERROR - An error has occurred
     * @property {connstatus} Status.CONNECTING - The connection is currently being made
     * @property {connstatus} Status.CONNFAIL - The connection attempt failed
     * @property {connstatus} Status.AUTHENTICATING - The connection is authenticating
     * @property {connstatus} Status.AUTHFAIL - The authentication attempt failed
     * @property {connstatus} Status.CONNECTED - The connection has succeeded
     * @property {connstatus} Status.DISCONNECTED - The connection has been terminated
     * @property {connstatus} Status.DISCONNECTING - The connection is currently being terminated
     * @property {connstatus} Status.ATTACHED - The connection has been attached
     * @property {connstatus} Status.REDIRECT - The connection has been redirected
     * @property {connstatus} Status.CONNTIMEOUT - The connection has timed out
     * @property {connstatus} Status.BINDREQUIRED - The JID resource needs to be bound for this session
     * @property {connstatus} Status.ATTACHFAIL - Failed to attach to a pre-existing session
     * @property {connstatus} Status.RECONNECTING - Not used by Strophe, but added for integrators
     */
    const Status = {
      ERROR: 0,
      CONNECTING: 1,
      CONNFAIL: 2,
      AUTHENTICATING: 3,
      AUTHFAIL: 4,
      CONNECTED: 5,
      DISCONNECTED: 6,
      DISCONNECTING: 7,
      ATTACHED: 8,
      REDIRECT: 9,
      CONNTIMEOUT: 10,
      BINDREQUIRED: 11,
      ATTACHFAIL: 12,
      RECONNECTING: 13
    };
    const ErrorCondition = {
      BAD_FORMAT: 'bad-format',
      CONFLICT: 'conflict',
      MISSING_JID_NODE: 'x-strophe-bad-non-anon-jid',
      NO_AUTH_MECH: 'no-auth-mech',
      UNKNOWN_REASON: 'unknown'
    };

    /**
     * Logging level indicators.
     * @typedef {0|1|2|3|4} LogLevel
     * @typedef {'DEBUG'|'INFO'|'WARN'|'ERROR'|'FATAL'} LogLevelName
     * @typedef {Record<LogLevelName, LogLevel>} LogLevels
     */
    const LOG_LEVELS = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      FATAL: 4
    };

    /**
     * DOM element types.
     *
     * - ElementType.NORMAL - Normal element.
     * - ElementType.TEXT - Text data element.
     * - ElementType.FRAGMENT - XHTML fragment element.
     */
    const ElementType = {
      NORMAL: 1,
      TEXT: 3,
      CDATA: 4,
      FRAGMENT: 11
    };

    /**
     * @typedef {import('./constants').LogLevel} LogLevel
     */
    let logLevel = LOG_LEVELS.DEBUG;
    const log = {
      /**
       * Library consumers can use this function to set the log level of Strophe.
       * The default log level is Strophe.LogLevel.INFO.
       * @param {LogLevel} level
       * @example Strophe.setLogLevel(Strophe.LogLevel.DEBUG);
       */
      setLogLevel(level) {
        if (level < LOG_LEVELS.DEBUG || level > LOG_LEVELS.FATAL) {
          throw new Error("Invalid log level supplied to setLogLevel");
        }
        logLevel = level;
      },
      /**
       *
       * Please note that data sent and received over the wire is logged
       * via {@link Strophe.Connection#rawInput|Strophe.Connection.rawInput()}
       * and {@link Strophe.Connection#rawOutput|Strophe.Connection.rawOutput()}.
       *
       * The different levels and their meanings are
       *
       *   DEBUG - Messages useful for debugging purposes.
       *   INFO - Informational messages.  This is mostly information like
       *     'disconnect was called' or 'SASL auth succeeded'.
       *   WARN - Warnings about potential problems.  This is mostly used
       *     to report transient connection errors like request timeouts.
       *   ERROR - Some error occurred.
       *   FATAL - A non-recoverable fatal error occurred.
       *
       * @param {number} level - The log level of the log message.
       *     This will be one of the values in Strophe.LOG_LEVELS.
       * @param {string} msg - The log message.
       */
      log(level, msg) {
        if (level < logLevel) {
          return;
        }
        if (level >= LOG_LEVELS.ERROR) {
          var _console;
          (_console = console) === null || _console === void 0 ? void 0 : _console.error(msg);
        } else if (level === LOG_LEVELS.INFO) {
          var _console2;
          (_console2 = console) === null || _console2 === void 0 ? void 0 : _console2.info(msg);
        } else if (level === LOG_LEVELS.WARN) {
          var _console3;
          (_console3 = console) === null || _console3 === void 0 ? void 0 : _console3.warn(msg);
        } else if (level === LOG_LEVELS.DEBUG) {
          var _console4;
          (_console4 = console) === null || _console4 === void 0 ? void 0 : _console4.debug(msg);
        }
      },
      /**
       * Log a message at the Strophe.LOG_LEVELS.DEBUG level.
       * @param {string} msg - The log message.
       */
      debug(msg) {
        this.log(LOG_LEVELS.DEBUG, msg);
      },
      /**
       * Log a message at the Strophe.LOG_LEVELS.INFO level.
       * @param {string} msg - The log message.
       */
      info(msg) {
        this.log(LOG_LEVELS.INFO, msg);
      },
      /**
       * Log a message at the Strophe.LOG_LEVELS.WARN level.
       * @param {string} msg - The log message.
       */
      warn(msg) {
        this.log(LOG_LEVELS.WARN, msg);
      },
      /**
       * Log a message at the Strophe.LOG_LEVELS.ERROR level.
       * @param {string} msg - The log message.
       */
      error(msg) {
        this.log(LOG_LEVELS.ERROR, msg);
      },
      /**
       * Log a message at the Strophe.LOG_LEVELS.FATAL level.
       * @param {string} msg - The log message.
       */
      fatal(msg) {
        this.log(LOG_LEVELS.FATAL, msg);
      }
    };

    /* global btoa */

    /**
     * Takes a string and turns it into an XML Element.
     * @param {string} string
     * @param {boolean} [throwErrorIfInvalidNS]
     * @returns {Element}
     */
    function toElement(string, throwErrorIfInvalidNS) {
      const doc = xmlHtmlNode(string);
      const parserError = getParserError(doc);
      if (parserError) {
        throw new Error(`Parser Error: ${parserError}`);
      }
      const node = getFirstElementChild(doc);
      if (['message', 'iq', 'presence'].includes(node.nodeName.toLowerCase()) && node.namespaceURI !== 'jabber:client' && node.namespaceURI !== 'jabber:server') {
        const err_msg = `Invalid namespaceURI ${node.namespaceURI}`;
        if (throwErrorIfInvalidNS) {
          throw new Error(err_msg);
        } else {
          log.error(err_msg);
        }
      }
      return node;
    }

    /**
     * Properly logs an error to the console
     * @param {Error} e
     */
    function handleError(e) {
      if (typeof e.stack !== 'undefined') {
        log.fatal(e.stack);
      }
      log.fatal('error: ' + e.message);
    }

    /**
     * @param {string} str
     * @return {string}
     */
    function utf16to8(str) {
      let out = '';
      const len = str.length;
      for (let i = 0; i < len; i++) {
        const c = str.charCodeAt(i);
        if (c >= 0x0000 && c <= 0x007f) {
          out += str.charAt(i);
        } else if (c > 0x07ff) {
          out += String.fromCharCode(0xe0 | c >> 12 & 0x0f);
          out += String.fromCharCode(0x80 | c >> 6 & 0x3f);
          out += String.fromCharCode(0x80 | c >> 0 & 0x3f);
        } else {
          out += String.fromCharCode(0xc0 | c >> 6 & 0x1f);
          out += String.fromCharCode(0x80 | c >> 0 & 0x3f);
        }
      }
      return out;
    }

    /**
     * @param {ArrayBufferLike} x
     * @param {ArrayBufferLike} y
     */
    function xorArrayBuffers(x, y) {
      const xIntArray = new Uint8Array(x);
      const yIntArray = new Uint8Array(y);
      const zIntArray = new Uint8Array(x.byteLength);
      for (let i = 0; i < x.byteLength; i++) {
        zIntArray[i] = xIntArray[i] ^ yIntArray[i];
      }
      return zIntArray.buffer;
    }

    /**
     * @param {ArrayBufferLike} buffer
     * @return {string}
     */
    function arrayBufToBase64(buffer) {
      // This function is due to mobz (https://stackoverflow.com/users/1234628/mobz)
      // and Emmanuel (https://stackoverflow.com/users/288564/emmanuel)
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

    /**
     * @param {string} str
     * @return {ArrayBufferLike}
     */
    function base64ToArrayBuf(str) {
      var _Uint8Array$from;
      return (_Uint8Array$from = Uint8Array.from(atob(str), c => c.charCodeAt(0))) === null || _Uint8Array$from === void 0 ? void 0 : _Uint8Array$from.buffer;
    }

    /**
     * @param {string} str
     * @return {ArrayBufferLike}
     */
    function stringToArrayBuf(str) {
      const bytes = new TextEncoder().encode(str);
      return bytes.buffer;
    }

    /**
     * @param {Cookies} cookies
     */
    function addCookies(cookies) {
      if (typeof document === 'undefined') {
        log.error(`addCookies: not adding any cookies, since there's no document object`);
      }

      /**
       * @typedef {Object.<string, string>} Cookie
       *
       * A map of cookie names to string values or to maps of cookie values.
       * @typedef {Cookie|Object.<string, Cookie>} Cookies
       *
       * For example:
       * { "myCookie": "1234" }
       *
       * or:
       * { "myCookie": {
       *    "value": "1234",
       *    "domain": ".example.org",
       *    "path": "/",
       *    "expires": expirationDate
       *    }
       * }
       *
       * These values get passed to {@link Strophe.Connection} via options.cookies
       */
      cookies = cookies || {};
      for (const cookieName in cookies) {
        if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
          let expires = '';
          let domain = '';
          let path = '';
          const cookieObj = cookies[cookieName];
          const isObj = typeof cookieObj === 'object';
          const cookieValue = escape(unescape(isObj ? cookieObj.value : cookieObj));
          if (isObj) {
            expires = cookieObj.expires ? ';expires=' + cookieObj.expires : '';
            domain = cookieObj.domain ? ';domain=' + cookieObj.domain : '';
            path = cookieObj.path ? ';path=' + cookieObj.path : '';
          }
          document.cookie = cookieName + '=' + cookieValue + expires + domain + path;
        }
      }
    }

    /** @type {Document} */
    let _xmlGenerator = null;

    /**
     * Get the DOM document to generate elements.
     * @return {Document} - The currently used DOM document.
     */
    function xmlGenerator() {
      if (!_xmlGenerator) {
        _xmlGenerator = getDummyXMLDOMDocument();
      }
      return _xmlGenerator;
    }

    /**
     * Creates an XML DOM text node.
     * Provides a cross implementation version of document.createTextNode.
     * @param {string} text - The content of the text node.
     * @return {Text} - A new XML DOM text node.
     */
    function xmlTextNode(text) {
      return xmlGenerator().createTextNode(text);
    }

    /**
     * @param {Element} stanza
     * @return {Element}
     */
    function stripWhitespace(stanza) {
      const childNodes = Array.from(stanza.childNodes);
      if (childNodes.length === 1 && childNodes[0].nodeType === ElementType.TEXT) {
        // If the element has only one child and it's a text node, we assume
        // it's significant and don't remove it, even if it's only whitespace.
        return stanza;
      }
      childNodes.forEach(node => {
        if (node.nodeName.toLowerCase() === 'body') {
          // We don't remove anything inside <body> elements
          return;
        }
        if (node.nodeType === ElementType.TEXT && !/\S/.test(node.nodeValue)) {
          stanza.removeChild(node);
        } else if (node.nodeType === ElementType.NORMAL) {
          stripWhitespace(/** @type {Element} */node);
        }
      });
      return stanza;
    }

    /**
     * Creates an XML DOM node.
     * @param {string} text - The contents of the XML element.
     * @return {XMLDocument}
     */
    function xmlHtmlNode(text) {
      const parser = new DOMParser();
      return parser.parseFromString(text, 'text/xml');
    }

    /**
     * @param {XMLDocument} doc
     * @returns {string|null}
     */
    function getParserError(doc) {
      var _doc$firstElementChil;
      const el = ((_doc$firstElementChil = doc.firstElementChild) === null || _doc$firstElementChil === void 0 ? void 0 : _doc$firstElementChil.nodeName) === 'parsererror' ? doc.firstElementChild : doc.getElementsByTagNameNS(PARSE_ERROR_NS, 'parsererror')[0];
      return (el === null || el === void 0 ? void 0 : el.nodeName) === 'parsererror' ? el === null || el === void 0 ? void 0 : el.textContent : null;
    }

    /**
     * @param {XMLDocument} el
     * @returns {Element}
     */
    function getFirstElementChild(el) {
      if (el.firstElementChild) return el.firstElementChild;
      let node,
        i = 0;
      const nodes = el.childNodes;
      while (node = nodes[i++]) {
        if (node.nodeType === 1) return /** @type {Element} */node;
      }
      return null;
    }

    /**
     * Create an XML DOM element.
     *
     * This function creates an XML DOM element correctly across all
     * implementations. Note that these are not HTML DOM elements, which
     * aren't appropriate for XMPP stanzas.
     *
     * @param {string} name - The name for the element.
     * @param {Array<Array<string>>|Object.<string,string|number>|string|number} [attrs]
     *    An optional array or object containing
     *    key/value pairs to use as element attributes.
     *    The object should be in the format `{'key': 'value'}`.
     *    The array should have the format `[['key1', 'value1'], ['key2', 'value2']]`.
     * @param {string|number} [text] - The text child data for the element.
     *
     * @return {Element} A new XML DOM element.
     */
    function xmlElement(name, attrs, text) {
      if (!name) return null;
      const node = xmlGenerator().createElement(name);
      if (text && (typeof text === 'string' || typeof text === 'number')) {
        node.appendChild(xmlTextNode(text.toString()));
      } else if (typeof attrs === 'string' || typeof attrs === 'number') {
        node.appendChild(xmlTextNode(/** @type {number|string} */attrs.toString()));
        return node;
      }
      if (!attrs) {
        return node;
      } else if (Array.isArray(attrs)) {
        for (const attr of attrs) {
          if (Array.isArray(attr)) {
            // eslint-disable-next-line no-eq-null
            if (attr[0] != null && attr[1] != null) {
              node.setAttribute(attr[0], attr[1]);
            }
          }
        }
      } else if (typeof attrs === 'object') {
        for (const k of Object.keys(attrs)) {
          // eslint-disable-next-line no-eq-null
          if (k && attrs[k] != null) {
            node.setAttribute(k, attrs[k].toString());
          }
        }
      }
      return node;
    }

    /**
     * Utility method to determine whether a tag is allowed
     * in the XHTML_IM namespace.
     *
     * XHTML tag names are case sensitive and must be lower case.
     * @method Strophe.XHTML.validTag
     * @param {string} tag
     */
    function validTag(tag) {
      for (let i = 0; i < XHTML.tags.length; i++) {
        if (tag === XHTML.tags[i]) {
          return true;
        }
      }
      return false;
    }

    /**
     * @typedef {'a'|'blockquote'|'br'|'cite'|'em'|'img'|'li'|'ol'|'p'|'span'|'strong'|'ul'|'body'} XHTMLAttrs
     */

    /**
     * Utility method to determine whether an attribute is allowed
     * as recommended per XEP-0071
     *
     * XHTML attribute names are case sensitive and must be lower case.
     * @method Strophe.XHTML.validAttribute
     * @param {string} tag
     * @param {string} attribute
     */
    function validAttribute(tag, attribute) {
      const attrs = XHTML.attributes[(/** @type {XHTMLAttrs} */tag)];
      if ((attrs === null || attrs === void 0 ? void 0 : attrs.length) > 0) {
        for (let i = 0; i < attrs.length; i++) {
          if (attribute === attrs[i]) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * @method Strophe.XHTML.validCSS
     * @param {string} style
     */
    function validCSS(style) {
      for (let i = 0; i < XHTML.css.length; i++) {
        if (style === XHTML.css[i]) {
          return true;
        }
      }
      return false;
    }

    /**
     * Copy an HTML DOM Element into an XML DOM.
     * This function copies a DOM element and all its descendants and returns
     * the new copy.
     * @param {HTMLElement} elem - A DOM element.
     * @return {Node} - A new, copied DOM element tree.
     */
    function createFromHtmlElement(elem) {
      let el;
      const tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
      if (validTag(tag)) {
        try {
          el = xmlElement(tag);
          if (tag in XHTML.attributes) {
            const attrs = XHTML.attributes[(/** @type {XHTMLAttrs} */tag)];
            for (let i = 0; i < attrs.length; i++) {
              const attribute = attrs[i];
              let value = elem.getAttribute(attribute);
              if (typeof value === 'undefined' || value === null || value === '') {
                continue;
              }
              if (attribute === 'style' && typeof value === 'object') {
                var _value$cssText;
                value = /** @type {Object.<'csstext',string>} */(_value$cssText = value.cssText) !== null && _value$cssText !== void 0 ? _value$cssText : value; // we're dealing with IE, need to get CSS out
              }

              // filter out invalid css styles
              if (attribute === 'style') {
                const css = [];
                const cssAttrs = value.split(';');
                for (let j = 0; j < cssAttrs.length; j++) {
                  const attr = cssAttrs[j].split(':');
                  const cssName = attr[0].replace(/^\s*/, '').replace(/\s*$/, '').toLowerCase();
                  if (validCSS(cssName)) {
                    const cssValue = attr[1].replace(/^\s*/, '').replace(/\s*$/, '');
                    css.push(cssName + ': ' + cssValue);
                  }
                }
                if (css.length > 0) {
                  value = css.join('; ');
                  el.setAttribute(attribute, value);
                }
              } else {
                el.setAttribute(attribute, value);
              }
            }
            for (let i = 0; i < elem.childNodes.length; i++) {
              el.appendChild(createHtml(elem.childNodes[i]));
            }
          }
        } catch (e) {
          // eslint-disable-line no-unused-vars
          // invalid elements
          el = xmlTextNode('');
        }
      } else {
        el = xmlGenerator().createDocumentFragment();
        for (let i = 0; i < elem.childNodes.length; i++) {
          el.appendChild(createHtml(elem.childNodes[i]));
        }
      }
      return el;
    }

    /**
     * Copy an HTML DOM Node into an XML DOM.
     * This function copies a DOM element and all its descendants and returns
     * the new copy.
     * @method Strophe.createHtml
     * @param {Node} node - A DOM element.
     * @return {Node} - A new, copied DOM element tree.
     */
    function createHtml(node) {
      if (node.nodeType === ElementType.NORMAL) {
        return createFromHtmlElement(/** @type {HTMLElement} */node);
      } else if (node.nodeType === ElementType.FRAGMENT) {
        const el = xmlGenerator().createDocumentFragment();
        for (let i = 0; i < node.childNodes.length; i++) {
          el.appendChild(createHtml(node.childNodes[i]));
        }
        return el;
      } else if (node.nodeType === ElementType.TEXT) {
        return xmlTextNode(node.nodeValue);
      }
    }

    /**
     * Copy an XML DOM element.
     *
     * This function copies a DOM element and all its descendants and returns
     * the new copy.
     * @method Strophe.copyElement
     * @param {Node} node - A DOM element.
     * @return {Element|Text} - A new, copied DOM element tree.
     */
    function copyElement(node) {
      let out;
      if (node.nodeType === ElementType.NORMAL) {
        const el = /** @type {Element} */node;
        out = xmlElement(el.tagName);
        for (let i = 0; i < el.attributes.length; i++) {
          out.setAttribute(el.attributes[i].nodeName, el.attributes[i].value);
        }
        for (let i = 0; i < el.childNodes.length; i++) {
          out.appendChild(copyElement(el.childNodes[i]));
        }
      } else if (node.nodeType === ElementType.TEXT) {
        out = xmlGenerator().createTextNode(node.nodeValue);
      }
      return out;
    }

    /**
     * Excapes invalid xml characters.
     * @method Strophe.xmlescape
     * @param {string} text - text to escape.
     * @return {string} - Escaped text.
     */
    function xmlescape(text) {
      text = text.replace(/\&/g, '&amp;');
      text = text.replace(/</g, '&lt;');
      text = text.replace(/>/g, '&gt;');
      text = text.replace(/'/g, '&apos;');
      text = text.replace(/"/g, '&quot;');
      return text;
    }

    /**
     * Unexcapes invalid xml characters.
     * @method Strophe.xmlunescape
     * @param {string} text - text to unescape.
     * @return {string} - Unescaped text.
     */
    function xmlunescape(text) {
      text = text.replace(/\&amp;/g, '&');
      text = text.replace(/&lt;/g, '<');
      text = text.replace(/&gt;/g, '>');
      text = text.replace(/&apos;/g, "'");
      text = text.replace(/&quot;/g, '"');
      return text;
    }

    /**
     * Map a function over some or all child elements of a given element.
     *
     * This is a small convenience function for mapping a function over
     * some or all of the children of an element.  If elemName is null, all
     * children will be passed to the function, otherwise only children
     * whose tag names match elemName will be passed.
     *
     * @method Strophe.forEachChild
     * @param {Element} elem - The element to operate on.
     * @param {string} elemName - The child element tag name filter.
     * @param {Function} func - The function to apply to each child.  This
     *    function should take a single argument, a DOM element.
     */
    function forEachChild(elem, elemName, func) {
      for (let i = 0; i < elem.childNodes.length; i++) {
        const childNode = elem.childNodes[i];
        if (childNode.nodeType === ElementType.NORMAL && (!elemName || this.isTagEqual(childNode, elemName))) {
          func(childNode);
        }
      }
    }

    /**
     * Compare an element's tag name with a string.
     * This function is case sensitive.
     * @method Strophe.isTagEqual
     * @param {Element} el - A DOM element.
     * @param {string} name - The element name.
     * @return {boolean}
     *  true if the element's tag name matches _el_, and false
     *  otherwise.
     */
    function isTagEqual(el, name) {
      return el.tagName === name;
    }

    /**
     * Get the concatenation of all text children of an element.
     * @method Strophe.getText
     * @param {Element} elem - A DOM element.
     * @return {string} - A String with the concatenated text of all text element children.
     */
    function getText(elem) {
      if (!elem) return null;
      let str = '';
      if (!elem.childNodes.length && elem.nodeType === ElementType.TEXT) {
        str += elem.nodeValue;
      }
      for (const child of elem.childNodes) {
        if (child.nodeType === ElementType.TEXT) {
          str += child.nodeValue;
        }
      }
      return xmlescape(str);
    }

    /**
     * Escape the node part (also called local part) of a JID.
     * @method Strophe.escapeNode
     * @param {string} node - A node (or local part).
     * @return {string} An escaped node (or local part).
     */
    function escapeNode(node) {
      if (typeof node !== 'string') {
        return node;
      }
      return node.replace(/^\s+|\s+$/g, '').replace(/\\/g, '\\5c').replace(/ /g, '\\20').replace(/\"/g, '\\22').replace(/\&/g, '\\26').replace(/\'/g, '\\27').replace(/\//g, '\\2f').replace(/:/g, '\\3a').replace(/</g, '\\3c').replace(/>/g, '\\3e').replace(/@/g, '\\40');
    }

    /**
     * Unescape a node part (also called local part) of a JID.
     * @method Strophe.unescapeNode
     * @param {string} node - A node (or local part).
     * @return {string} An unescaped node (or local part).
     */
    function unescapeNode(node) {
      if (typeof node !== 'string') {
        return node;
      }
      return node.replace(/\\20/g, ' ').replace(/\\22/g, '"').replace(/\\26/g, '&').replace(/\\27/g, "'").replace(/\\2f/g, '/').replace(/\\3a/g, ':').replace(/\\3c/g, '<').replace(/\\3e/g, '>').replace(/\\40/g, '@').replace(/\\5c/g, '\\');
    }

    /**
     * Get the node portion of a JID String.
     * @method Strophe.getNodeFromJid
     * @param {string} jid - A JID.
     * @return {string} - A String containing the node.
     */
    function getNodeFromJid(jid) {
      if (jid.indexOf('@') < 0) {
        return null;
      }
      return jid.split('@')[0];
    }

    /**
     * Get the domain portion of a JID String.
     * @method Strophe.getDomainFromJid
     * @param {string} jid - A JID.
     * @return {string} - A String containing the domain.
     */
    function getDomainFromJid(jid) {
      const bare = getBareJidFromJid(jid);
      if (bare.indexOf('@') < 0) {
        return bare;
      } else {
        const parts = bare.split('@');
        parts.splice(0, 1);
        return parts.join('@');
      }
    }

    /**
     * Get the resource portion of a JID String.
     * @method Strophe.getResourceFromJid
     * @param {string} jid - A JID.
     * @return {string} - A String containing the resource.
     */
    function getResourceFromJid(jid) {
      if (!jid) {
        return null;
      }
      const s = jid.split('/');
      if (s.length < 2) {
        return null;
      }
      s.splice(0, 1);
      return s.join('/');
    }

    /**
     * Get the bare JID from a JID String.
     * @method Strophe.getBareJidFromJid
     * @param {string} jid - A JID.
     * @return {string} - A String containing the bare JID.
     */
    function getBareJidFromJid(jid) {
      return jid ? jid.split('/')[0] : null;
    }
    const utils = {
      utf16to8,
      xorArrayBuffers,
      arrayBufToBase64,
      base64ToArrayBuf,
      stringToArrayBuf,
      addCookies
    };

    var utils$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        toElement: toElement,
        handleError: handleError,
        utf16to8: utf16to8,
        xorArrayBuffers: xorArrayBuffers,
        arrayBufToBase64: arrayBufToBase64,
        base64ToArrayBuf: base64ToArrayBuf,
        stringToArrayBuf: stringToArrayBuf,
        addCookies: addCookies,
        xmlGenerator: xmlGenerator,
        xmlTextNode: xmlTextNode,
        stripWhitespace: stripWhitespace,
        xmlHtmlNode: xmlHtmlNode,
        getParserError: getParserError,
        getFirstElementChild: getFirstElementChild,
        xmlElement: xmlElement,
        validTag: validTag,
        validAttribute: validAttribute,
        validCSS: validCSS,
        createHtml: createHtml,
        copyElement: copyElement,
        xmlescape: xmlescape,
        xmlunescape: xmlunescape,
        forEachChild: forEachChild,
        isTagEqual: isTagEqual,
        getText: getText,
        escapeNode: escapeNode,
        unescapeNode: unescapeNode,
        getNodeFromJid: getNodeFromJid,
        getDomainFromJid: getDomainFromJid,
        getResourceFromJid: getResourceFromJid,
        getBareJidFromJid: getBareJidFromJid,
        'default': utils
    });

    /**
     * Create a {@link Strophe.Builder}
     * This is an alias for `new Strophe.Builder(name, attrs)`.
     * @param {string} name - The root element name.
     * @param {Object.<string,string|number>} [attrs] - The attributes for the root element in object notation.
     * @return {Builder} A new Strophe.Builder object.
     */
    function $build(name, attrs) {
      return new Builder(name, attrs);
    }

    /**
     * Create a {@link Strophe.Builder} with a `<message/>` element as the root.
     * @param {Object.<string,string>} [attrs] - The <message/> element attributes in object notation.
     * @return {Builder} A new Strophe.Builder object.
     */
    function $msg(attrs) {
      return new Builder('message', attrs);
    }

    /**
     * Create a {@link Strophe.Builder} with an `<iq/>` element as the root.
     * @param {Object.<string,string>} [attrs] - The <iq/> element attributes in object notation.
     * @return {Builder} A new Strophe.Builder object.
     */
    function $iq(attrs) {
      return new Builder('iq', attrs);
    }

    /**
     * Create a {@link Strophe.Builder} with a `<presence/>` element as the root.
     * @param {Object.<string,string>} [attrs] - The <presence/> element attributes in object notation.
     * @return {Builder} A new Strophe.Builder object.
     */
    function $pres(attrs) {
      return new Builder('presence', attrs);
    }

    /**
     * This class provides an interface similar to JQuery but for building
     * DOM elements easily and rapidly.  All the functions except for `toString()`
     * and tree() return the object, so calls can be chained.
     *
     * The corresponding DOM manipulations to get a similar fragment would be
     * a lot more tedious and probably involve several helper variables.
     *
     * Since adding children makes new operations operate on the child, up()
     * is provided to traverse up the tree.  To add two children, do
     * > builder.c('child1', ...).up().c('child2', ...)
     *
     * The next operation on the Builder will be relative to the second child.
     *
     * @example
     *  // Here's an example using the $iq() builder helper.
     *  $iq({to: 'you', from: 'me', type: 'get', id: '1'})
     *      .c('query', {xmlns: 'strophe:example'})
     *      .c('example')
     *      .toString()
     *
     *  // The above generates this XML fragment
     *  //  <iq to='you' from='me' type='get' id='1'>
     *  //    <query xmlns='strophe:example'>
     *  //      <example/>
     *  //    </query>
     *  //  </iq>
     */
    class Builder {
      /**
       * @typedef {Object.<string, string|number>} StanzaAttrs
       * @property {string} [StanzaAttrs.xmlns]
       */

      /** @type {Element} */
      #nodeTree;
      /** @type {Element} */
      #node;
      /** @type {string} */
      #name;
      /** @type {StanzaAttrs} */
      #attrs;

      /**
       * The attributes should be passed in object notation.
       * @param {string} name - The name of the root element.
       * @param {StanzaAttrs} [attrs] - The attributes for the root element in object notation.
       * @example const b = new Builder('message', {to: 'you', from: 'me'});
       * @example const b = new Builder('messsage', {'xml:lang': 'en'});
       */
      constructor(name, attrs) {
        // Set correct namespace for jabber:client elements
        if (name === 'presence' || name === 'message' || name === 'iq') {
          if (attrs && !attrs.xmlns) {
            attrs.xmlns = NS.CLIENT;
          } else if (!attrs) {
            attrs = {
              xmlns: NS.CLIENT
            };
          }
        }
        this.#name = name;
        this.#attrs = attrs;
      }

      /**
       * Creates a new Builder object from an XML string.
       * @param {string} str
       * @returns {Builder}
       * @example const stanza = Builder.fromString('<presence from="juliet@example.com/chamber"></presence>');
       */
      static fromString(str) {
        const el = toElement(str, true);
        const b = new Builder('');
        b.#nodeTree = el;
        return b;
      }
      buildTree() {
        return xmlElement(this.#name, this.#attrs);
      }

      /** @return {Element} */
      get nodeTree() {
        if (!this.#nodeTree) {
          // Holds the tree being built.
          this.#nodeTree = this.buildTree();
        }
        return this.#nodeTree;
      }

      /** @return {Element} */
      get node() {
        if (!this.#node) {
          this.#node = this.tree();
        }
        return this.#node;
      }

      /** @param {Element} el */
      set node(el) {
        this.#node = el;
      }

      /**
       * Render a DOM element and all descendants to a String.
       * @param {Element|Builder} elem - A DOM element.
       * @return {string} - The serialized element tree as a String.
       */
      static serialize(elem) {
        if (!elem) return null;
        const el = elem instanceof Builder ? elem.tree() : elem;
        const names = [...Array(el.attributes.length).keys()].map(i => el.attributes[i].nodeName);
        names.sort();
        let result = names.reduce((a, n) => `${a} ${n}="${xmlescape(el.attributes.getNamedItem(n).value)}"`, `<${el.nodeName}`);
        if (el.childNodes.length > 0) {
          result += '>';
          for (let i = 0; i < el.childNodes.length; i++) {
            const child = el.childNodes[i];
            switch (child.nodeType) {
              case ElementType.NORMAL:
                // normal element, so recurse
                result += Builder.serialize(/** @type {Element} */child);
                break;
              case ElementType.TEXT:
                // text element to escape values
                result += xmlescape(child.nodeValue);
                break;
              case ElementType.CDATA:
                // cdata section so don't escape values
                result += '<![CDATA[' + child.nodeValue + ']]>';
            }
          }
          result += '</' + el.nodeName + '>';
        } else {
          result += '/>';
        }
        return result;
      }

      /**
       * Return the DOM tree.
       *
       * This function returns the current DOM tree as an element object.  This
       * is suitable for passing to functions like Strophe.Connection.send().
       *
       * @return {Element} The DOM tree as a element object.
       */
      tree() {
        return this.nodeTree;
      }

      /**
       * Serialize the DOM tree to a String.
       *
       * This function returns a string serialization of the current DOM
       * tree.  It is often used internally to pass data to a
       * Strophe.Request object.
       *
       * @return {string} The serialized DOM tree in a String.
       */
      toString() {
        return Builder.serialize(this.tree());
      }

      /**
       * Make the current parent element the new current element.
       * This function is often used after c() to traverse back up the tree.
       *
       * @example
       *  // For example, to add two children to the same element
       *  builder.c('child1', {}).up().c('child2', {});
       *
       * @return {Builder} The Strophe.Builder object.
       */
      up() {
        // Depending on context, parentElement is not always available
        this.node = this.node.parentElement ? this.node.parentElement : (/** @type {Element} */this.node.parentNode);
        return this;
      }

      /**
       * Make the root element the new current element.
       *
       * When at a deeply nested element in the tree, this function can be used
       * to jump back to the root of the tree, instead of having to repeatedly
       * call up().
       *
       * @return {Builder} The Strophe.Builder object.
       */
      root() {
        this.node = this.tree();
        return this;
      }

      /**
       * Add or modify attributes of the current element.
       *
       * The attributes should be passed in object notation.
       * This function does not move the current element pointer.
       * @param {Object.<string, string|number|null>} moreattrs - The attributes to add/modify in object notation.
       *  If an attribute is set to `null` or `undefined`, it will be removed.
       * @return {Builder} The Strophe.Builder object.
       */
      attrs(moreattrs) {
        for (const k in moreattrs) {
          if (Object.prototype.hasOwnProperty.call(moreattrs, k)) {
            // eslint-disable-next-line no-eq-null
            if (moreattrs[k] != null) {
              this.node.setAttribute(k, moreattrs[k].toString());
            } else {
              this.node.removeAttribute(k);
            }
          }
        }
        return this;
      }

      /**
       * Add a child to the current element and make it the new current
       * element.
       *
       * This function moves the current element pointer to the child,
       * unless text is provided.  If you need to add another child, it
       * is necessary to use up() to go back to the parent in the tree.
       *
       * @param {string} name - The name of the child.
       * @param {Object.<string, string>|string} [attrs] - The attributes of the child in object notation.
       * @param {string} [text] - The text to add to the child.
       *
       * @return {Builder} The Strophe.Builder object.
       */
      c(name, attrs, text) {
        const child = xmlElement(name, attrs, text);
        this.node.appendChild(child);
        if (typeof text !== 'string' && typeof text !== 'number') {
          this.node = child;
        }
        return this;
      }

      /**
       * Add a child to the current element and make it the new current
       * element.
       *
       * This function is the same as c() except that instead of using a
       * name and an attributes object to create the child it uses an
       * existing DOM element object.
       *
       * @param {Element|Builder} elem - A DOM element.
       * @return {Builder} The Strophe.Builder object.
       */
      cnode(elem) {
        if (elem instanceof Builder) {
          elem = elem.tree();
        }
        let impNode;
        const xmlGen = xmlGenerator();
        try {
          impNode = xmlGen.importNode !== undefined;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          impNode = false;
        }
        const newElem = impNode ? xmlGen.importNode(elem, true) : copyElement(elem);
        this.node.appendChild(newElem);
        this.node = /** @type {Element} */newElem;
        return this;
      }

      /**
       * Add a child text element.
       *
       * This *does not* make the child the new current element since there
       * are no children of text elements.
       *
       * @param {string} text - The text data to append to the current element.
       * @return {Builder} The Strophe.Builder object.
       */
      t(text) {
        const child = xmlTextNode(text);
        this.node.appendChild(child);
        return this;
      }

      /**
       * Replace current element contents with the HTML passed in.
       *
       * This *does not* make the child the new current element
       *
       * @param {string} html - The html to insert as contents of current element.
       * @return {Builder} The Strophe.Builder object.
       */
      h(html) {
        const fragment = xmlGenerator().createElement('body');
        // force the browser to try and fix any invalid HTML tags
        fragment.innerHTML = html;
        // copy cleaned html into an xml dom
        const xhtml = createHtml(fragment);
        while (xhtml.childNodes.length > 0) {
          this.node.appendChild(xhtml.childNodes[0]);
        }
        return this;
      }
    }

    /**
     * _Private_ variable that keeps track of the request ids for connections.
     */
    let _requestId = 0;

    /**
     * Helper class that provides a cross implementation abstraction
     * for a BOSH related XMLHttpRequest.
     *
     * The Request class is used internally to encapsulate BOSH request
     * information.  It is not meant to be used from user's code.
     *
     * @property {number} id
     * @property {number} sends
     * @property {XMLHttpRequest} xhr
     */
    class Request {
      /**
       * Create and initialize a new Request object.
       *
       * @param {Element} elem - The XML data to be sent in the request.
       * @param {Function} func - The function that will be called when the
       *     XMLHttpRequest readyState changes.
       * @param {number} rid - The BOSH rid attribute associated with this request.
       * @param {number} [sends=0] - The number of times this same request has been sent.
       */
      constructor(elem, func, rid, sends = 0) {
        this.id = ++_requestId;
        this.xmlData = elem;
        this.data = Builder.serialize(elem);
        // save original function in case we need to make a new request
        // from this one.
        this.origFunc = func;
        this.func = func;
        this.rid = rid;
        this.date = NaN;
        this.sends = sends;
        this.abort = false;
        this.dead = null;
        this.age = () => this.date ? (new Date().valueOf() - this.date.valueOf()) / 1000 : 0;
        this.timeDead = () => this.dead ? (new Date().valueOf() - this.dead.valueOf()) / 1000 : 0;
        this.xhr = this._newXHR();
      }

      /**
       * Get a response from the underlying XMLHttpRequest.
       * This function attempts to get a response from the request and checks
       * for errors.
       * @throws "parsererror" - A parser error occured.
       * @throws "bad-format" - The entity has sent XML that cannot be processed.
       * @return {Element} - The DOM element tree of the response.
       */
      getResponse() {
        var _this$xhr$responseXML;
        const node = (_this$xhr$responseXML = this.xhr.responseXML) === null || _this$xhr$responseXML === void 0 ? void 0 : _this$xhr$responseXML.documentElement;
        if (node) {
          if (node.tagName === 'parsererror') {
            log.error('invalid response received');
            log.error('responseText: ' + this.xhr.responseText);
            log.error('responseXML: ' + Builder.serialize(node));
            throw new Error('parsererror');
          }
        } else if (this.xhr.responseText) {
          // In Node (with xhr2) or React Native, we may get responseText but no responseXML.
          // We can try to parse it manually.
          log.debug('Got responseText but no responseXML; attempting to parse it with DOMParser...');
          const doc = xmlHtmlNode(this.xhr.responseText);
          const parserError = getParserError(doc);
          if (!doc || parserError) {
            if (parserError) {
              log.error('invalid response received: ' + parserError);
              log.error('responseText: ' + this.xhr.responseText);
            }
            const error = new Error();
            error.name = ErrorCondition.BAD_FORMAT;
            throw error;
          }
        }
        return node;
      }

      /**
       * _Private_ helper function to create XMLHttpRequests.
       * This function creates XMLHttpRequests across all implementations.
       * @private
       * @return {XMLHttpRequest}
       */
      _newXHR() {
        const xhr = new XMLHttpRequest();
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType('text/xml; charset=utf-8');
        }
        // use Function.bind() to prepend ourselves as an argument
        xhr.onreadystatechange = this.func.bind(null, this);
        return xhr;
      }
    }

    /**
     * A JavaScript library to enable BOSH in Strophejs.
     *
     * this library uses Bidirectional-streams Over Synchronous HTTP (BOSH)
     * to emulate a persistent, stateful, two-way connection to an XMPP server.
     * More information on BOSH can be found in XEP 124.
     */
    let timeoutMultiplier = 1.1;
    let secondaryTimeoutMultiplier = 0.1;

    /**
     * _Private_ helper class that handles BOSH Connections
     * The Bosh class is used internally by Connection
     * to encapsulate BOSH sessions. It is not meant to be used from user's code.
     */
    class Bosh {
      /**
       * @param {Connection} connection - The Connection that will use BOSH.
       */
      constructor(connection) {
        var _Bosh$prototype$strip;
        this._conn = connection;
        /* request id for body tags */
        this.rid = Math.floor(Math.random() * 4294967295);
        /* The current session ID. */
        this.sid = null;

        // default BOSH values
        this.hold = 1;
        this.wait = 60;
        this.window = 5;
        this.errors = 0;
        this.inactivity = null;

        /**
         * BOSH-Connections will have all stanzas wrapped in a <body> tag when
         * passed to {@link Connection#xmlInput|xmlInput()} or {@link Connection#xmlOutput|xmlOutput()}.
         * To strip this tag, User code can set {@link Bosh#strip|strip} to `true`:
         *
         * > // You can set `strip` on the prototype
         * > Bosh.prototype.strip = true;
         *
         * > // Or you can set it on the Bosh instance (which is `._proto` on the connection instance.
         * > const conn = new Connection();
         * > conn._proto.strip = true;
         *
         * This will enable stripping of the body tag in both
         * {@link Connection#xmlInput|xmlInput} and {@link Connection#xmlOutput|xmlOutput}.
         *
         * @property {boolean} [strip=false]
         */
        this.strip = (_Bosh$prototype$strip = Bosh.prototype.strip) !== null && _Bosh$prototype$strip !== void 0 ? _Bosh$prototype$strip : false;
        this.lastResponseHeaders = null;
        /** @type {Request[]} */
        this._requests = [];
      }

      /**
       * @param {number} m
       */
      static setTimeoutMultiplier(m) {
        timeoutMultiplier = m;
      }

      /**
       * @returns {number}
       */
      static getTimeoutMultplier() {
        return timeoutMultiplier;
      }

      /**
       * @param {number} m
       */
      static setSecondaryTimeoutMultiplier(m) {
        secondaryTimeoutMultiplier = m;
      }

      /**
       * @returns {number}
       */
      static getSecondaryTimeoutMultplier() {
        return secondaryTimeoutMultiplier;
      }

      /**
       * _Private_ helper function to generate the <body/> wrapper for BOSH.
       * @private
       * @return {Builder} - A Builder with a <body/> element.
       */
      _buildBody() {
        const bodyWrap = $build('body', {
          'rid': this.rid++,
          'xmlns': NS.HTTPBIND
        });
        if (this.sid !== null) {
          bodyWrap.attrs({
            'sid': this.sid
          });
        }
        if (this._conn.options.keepalive && this._conn._sessionCachingSupported()) {
          this._cacheSession();
        }
        return bodyWrap;
      }

      /**
       * Reset the connection.
       * This function is called by the reset function of the Connection
       */
      _reset() {
        this.rid = Math.floor(Math.random() * 4294967295);
        this.sid = null;
        this.errors = 0;
        if (this._conn._sessionCachingSupported()) {
          sessionStorage.removeItem('strophe-bosh-session');
        }
        this._conn.nextValidRid(this.rid);
      }

      /**
       * _Private_ function that initializes the BOSH connection.
       * Creates and sends the Request that initializes the BOSH connection.
       * @param {number} wait - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       *     Other settings will require tweaks to the Strophe.TIMEOUT value.
       * @param {number} hold - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {string} route
       */
      _connect(wait, hold, route) {
        this.wait = wait || this.wait;
        this.hold = hold || this.hold;
        this.errors = 0;
        const body = this._buildBody().attrs({
          'to': this._conn.domain,
          'xml:lang': 'en',
          'wait': this.wait,
          'hold': this.hold,
          'content': 'text/xml; charset=utf-8',
          'ver': '1.6',
          'xmpp:version': '1.0',
          'xmlns:xmpp': NS.BOSH
        });
        if (route) {
          body.attrs({
            route
          });
        }
        const _connect_cb = this._conn._connect_cb;
        this._requests.push(new Request(body.tree(), this._onRequestStateChange.bind(this, _connect_cb.bind(this._conn)), Number(body.tree().getAttribute('rid'))));
        this._throttledRequestHandler();
      }

      /**
       * Attach to an already created and authenticated BOSH session.
       *
       * This function is provided to allow Strophe to attach to BOSH
       * sessions which have been created externally, perhaps by a Web
       * application.  This is often used to support auto-login type features
       * without putting user credentials into the page.
       *
       * @param {string} jid - The full JID that is bound by the session.
       * @param {string} sid - The SID of the BOSH session.
       * @param {number} rid - The current RID of the BOSH session.  This RID
       *     will be used by the next request.
       * @param {Function} callback The connect callback function.
       * @param {number} wait - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       *     Other settings will require tweaks to the Strophe.TIMEOUT value.
       * @param {number} hold - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {number} wind - The optional HTTBIND window value.  This is the
       *     allowed range of request ids that are valid.  The default is 5.
       */
      _attach(jid, sid, rid, callback, wait, hold, wind) {
        this._conn.jid = jid;
        this.sid = sid;
        this.rid = rid;
        this._conn.connect_callback = callback;
        this._conn.domain = getDomainFromJid(this._conn.jid);
        this._conn.authenticated = true;
        this._conn.connected = true;
        this.wait = wait || this.wait;
        this.hold = hold || this.hold;
        this.window = wind || this.window;
        this._conn._changeConnectStatus(Status.ATTACHED, null);
      }

      /**
       * Attempt to restore a cached BOSH session
       *
       * @param {string} jid - The full JID that is bound by the session.
       *     This parameter is optional but recommended, specifically in cases
       *     where prebinded BOSH sessions are used where it's important to know
       *     that the right session is being restored.
       * @param {Function} callback The connect callback function.
       * @param {number} wait - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       *     Other settings will require tweaks to the Strophe.TIMEOUT value.
       * @param {number} hold - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {number} wind - The optional HTTBIND window value.  This is the
       *     allowed range of request ids that are valid.  The default is 5.
       */
      _restore(jid, callback, wait, hold, wind) {
        const session = JSON.parse(sessionStorage.getItem('strophe-bosh-session'));
        if (typeof session !== 'undefined' && session !== null && session.rid && session.sid && session.jid && (typeof jid === 'undefined' || jid === null || getBareJidFromJid(session.jid) === getBareJidFromJid(jid) ||
        // If authcid is null, then it's an anonymous login, so
        // we compare only the domains:
        getNodeFromJid(jid) === null && getDomainFromJid(session.jid) === jid)) {
          this._conn.restored = true;
          this._attach(session.jid, session.sid, session.rid, callback, wait, hold, wind);
        } else {
          const error = new Error('_restore: no restoreable session.');
          error.name = 'StropheSessionError';
          throw error;
        }
      }

      /**
       * _Private_ handler for the beforeunload event.
       * This handler is used to process the Bosh-part of the initial request.
       * @private
       */
      _cacheSession() {
        if (this._conn.authenticated) {
          if (this._conn.jid && this.rid && this.sid) {
            sessionStorage.setItem('strophe-bosh-session', JSON.stringify({
              'jid': this._conn.jid,
              'rid': this.rid,
              'sid': this.sid
            }));
          }
        } else {
          sessionStorage.removeItem('strophe-bosh-session');
        }
      }

      /**
       * _Private_ handler for initial connection request.
       * This handler is used to process the Bosh-part of the initial request.
       * @param {Element} bodyWrap - The received stanza.
       */
      _connect_cb(bodyWrap) {
        const typ = bodyWrap.getAttribute('type');
        if (typ !== null && typ === 'terminate') {
          // an error occurred
          let cond = bodyWrap.getAttribute('condition');
          log.error('BOSH-Connection failed: ' + cond);
          const conflict = bodyWrap.getElementsByTagName('conflict');
          if (cond !== null) {
            if (cond === 'remote-stream-error' && conflict.length > 0) {
              cond = 'conflict';
            }
            this._conn._changeConnectStatus(Status.CONNFAIL, cond);
          } else {
            this._conn._changeConnectStatus(Status.CONNFAIL, 'unknown');
          }
          this._conn._doDisconnect(cond);
          return Status.CONNFAIL;
        }

        // check to make sure we don't overwrite these if _connect_cb is
        // called multiple times in the case of missing stream:features
        if (!this.sid) {
          this.sid = bodyWrap.getAttribute('sid');
        }
        const wind = bodyWrap.getAttribute('requests');
        if (wind) {
          this.window = parseInt(wind, 10);
        }
        const hold = bodyWrap.getAttribute('hold');
        if (hold) {
          this.hold = parseInt(hold, 10);
        }
        const wait = bodyWrap.getAttribute('wait');
        if (wait) {
          this.wait = parseInt(wait, 10);
        }
        const inactivity = bodyWrap.getAttribute('inactivity');
        if (inactivity) {
          this.inactivity = parseInt(inactivity, 10);
        }
      }

      /**
       * _Private_ part of Connection.disconnect for Bosh
       * @param {Element|Builder} pres - This stanza will be sent before disconnecting.
       */
      _disconnect(pres) {
        this._sendTerminate(pres);
      }

      /**
       * _Private_ function to disconnect.
       * Resets the SID and RID.
       */
      _doDisconnect() {
        this.sid = null;
        this.rid = Math.floor(Math.random() * 4294967295);
        if (this._conn._sessionCachingSupported()) {
          sessionStorage.removeItem('strophe-bosh-session');
        }
        this._conn.nextValidRid(this.rid);
      }

      /**
       * _Private_ function to check if the Request queue is empty.
       * @return {boolean} - True, if there are no Requests queued, False otherwise.
       */
      _emptyQueue() {
        return this._requests.length === 0;
      }

      /**
       * _Private_ function to call error handlers registered for HTTP errors.
       * @private
       * @param {Request} req - The request that is changing readyState.
       */
      _callProtocolErrorHandlers(req) {
        const reqStatus = Bosh._getRequestStatus(req);
        const err_callback = this._conn.protocolErrorHandlers.HTTP[reqStatus];
        if (err_callback) {
          err_callback.call(this, reqStatus);
        }
      }

      /**
       * _Private_ function to handle the error count.
       *
       * Requests are resent automatically until their error count reaches
       * 5.  Each time an error is encountered, this function is called to
       * increment the count and disconnect if the count is too high.
       * @private
       * @param {number} reqStatus - The request status.
       */
      _hitError(reqStatus) {
        this.errors++;
        log.warn('request errored, status: ' + reqStatus + ', number of errors: ' + this.errors);
        if (this.errors > 4) {
          this._conn._onDisconnectTimeout();
        }
      }

      /**
       * @callback connectionCallback
       * @param {Connection} connection
       */

      /**
       * Called on stream start/restart when no stream:features
       * has been received and sends a blank poll request.
       * @param {connectionCallback} callback
       */
      _no_auth_received(callback) {
        log.warn('Server did not yet offer a supported authentication ' + 'mechanism. Sending a blank poll request.');
        if (callback) {
          callback = callback.bind(this._conn);
        } else {
          callback = this._conn._connect_cb.bind(this._conn);
        }
        const body = this._buildBody();
        this._requests.push(new Request(body.tree(), this._onRequestStateChange.bind(this, callback), Number(body.tree().getAttribute('rid'))));
        this._throttledRequestHandler();
      }

      /**
       * _Private_ timeout handler for handling non-graceful disconnection.
       * Cancels all remaining Requests and clears the queue.
       */
      _onDisconnectTimeout() {
        this._abortAllRequests();
      }

      /**
       * _Private_ helper function that makes sure all pending requests are aborted.
       */
      _abortAllRequests() {
        while (this._requests.length > 0) {
          const req = this._requests.pop();
          req.abort = true;
          req.xhr.abort();
          req.xhr.onreadystatechange = function () {};
        }
      }

      /**
       * _Private_ handler called by {@link Connection#_onIdle|Connection._onIdle()}.
       * Sends all queued Requests or polls with empty Request if there are none.
       */
      _onIdle() {
        const data = this._conn._data;
        // if no requests are in progress, poll
        if (this._conn.authenticated && this._requests.length === 0 && data.length === 0 && !this._conn.disconnecting) {
          log.debug('no requests during idle cycle, sending blank request');
          data.push(null);
        }
        if (this._conn.paused) {
          return;
        }
        if (this._requests.length < 2 && data.length > 0) {
          const body = this._buildBody();
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== null) {
              if (data[i] === 'restart') {
                body.attrs({
                  'to': this._conn.domain,
                  'xml:lang': 'en',
                  'xmpp:restart': 'true',
                  'xmlns:xmpp': NS.BOSH
                });
              } else {
                body.cnode(/** @type {Element} */data[i]).up();
              }
            }
          }
          delete this._conn._data;
          this._conn._data = [];
          this._requests.push(new Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), Number(body.tree().getAttribute('rid'))));
          this._throttledRequestHandler();
        }
        if (this._requests.length > 0) {
          const time_elapsed = this._requests[0].age();
          if (this._requests[0].dead !== null) {
            if (this._requests[0].timeDead() > Math.floor(timeoutMultiplier * this.wait)) {
              this._throttledRequestHandler();
            }
          }
          if (time_elapsed > Math.floor(timeoutMultiplier * this.wait)) {
            log.warn('Request ' + this._requests[0].id + ' timed out, over ' + Math.floor(timeoutMultiplier * this.wait) + ' seconds since last activity');
            this._throttledRequestHandler();
          }
        }
      }

      /**
       * Returns the HTTP status code from a {@link Request}
       * @private
       * @param {Request} req - The {@link Request} instance.
       * @param {number} [def] - The default value that should be returned if no status value was found.
       */
      static _getRequestStatus(req, def) {
        let reqStatus;
        if (req.xhr.readyState === 4) {
          try {
            reqStatus = req.xhr.status;
          } catch (e) {
            // ignore errors from undefined status attribute. Works
            // around a browser bug
            log.error(`Caught an error while retrieving a request's status, reqStatus: ${reqStatus}, message: ${e.message}`);
          }
        }
        if (typeof reqStatus === 'undefined') {
          reqStatus = typeof def === 'number' ? def : 0;
        }
        return reqStatus;
      }

      /**
       * _Private_ handler for {@link Request} state changes.
       *
       * This function is called when the XMLHttpRequest readyState changes.
       * It contains a lot of error handling logic for the many ways that
       * requests can fail, and calls the request callback when requests
       * succeed.
       * @private
       *
       * @param {Function} func - The handler for the request.
       * @param {Request} req - The request that is changing readyState.
       */
      _onRequestStateChange(func, req) {
        log.debug('request id ' + req.id + '.' + req.sends + ' state changed to ' + req.xhr.readyState);
        if (req.abort) {
          req.abort = false;
          return;
        }
        if (req.xhr.readyState !== 4) {
          // The request is not yet complete
          return;
        }
        const reqStatus = Bosh._getRequestStatus(req);
        this.lastResponseHeaders = req.xhr.getAllResponseHeaders();
        if (this._conn.disconnecting && reqStatus >= 400) {
          this._hitError(reqStatus);
          this._callProtocolErrorHandlers(req);
          return;
        }
        const reqIs0 = this._requests[0] === req;
        const reqIs1 = this._requests[1] === req;
        const valid_request = reqStatus > 0 && reqStatus < 500;
        const too_many_retries = req.sends > this._conn.maxRetries;
        if (valid_request || too_many_retries) {
          // remove from internal queue
          this._removeRequest(req);
          log.debug('request id ' + req.id + ' should now be removed');
        }
        if (reqStatus === 200) {
          // request succeeded
          // if request 1 finished, or request 0 finished and request
          // 1 is over _TIMEOUT seconds old, we need to
          // restart the other - both will be in the first spot, as the
          // completed request has been removed from the queue already
          if (reqIs1 || reqIs0 && this._requests.length > 0 && this._requests[0].age() > Math.floor(timeoutMultiplier * this.wait)) {
            this._restartRequest(0);
          }
          this._conn.nextValidRid(req.rid + 1);
          log.debug('request id ' + req.id + '.' + req.sends + ' got 200');
          func(req); // call handler
          this.errors = 0;
        } else if (reqStatus === 0 || reqStatus >= 400 && reqStatus < 600 || reqStatus >= 12000) {
          // request failed
          log.error('request id ' + req.id + '.' + req.sends + ' error ' + reqStatus + ' happened');
          this._hitError(reqStatus);
          this._callProtocolErrorHandlers(req);
          if (reqStatus >= 400 && reqStatus < 500) {
            this._conn._changeConnectStatus(Status.DISCONNECTING, null);
            this._conn._doDisconnect();
          }
        } else {
          log.error('request id ' + req.id + '.' + req.sends + ' error ' + reqStatus + ' happened');
        }
        if (!valid_request && !too_many_retries) {
          this._throttledRequestHandler();
        } else if (too_many_retries && !this._conn.connected) {
          this._conn._changeConnectStatus(Status.CONNFAIL, 'giving-up');
        }
      }

      /**
       * _Private_ function to process a request in the queue.
       *
       * This function takes requests off the queue and sends them and
       * restarts dead requests.
       * @private
       *
       * @param {number} i - The index of the request in the queue.
       */
      _processRequest(i) {
        let req = this._requests[i];
        const reqStatus = Bosh._getRequestStatus(req, -1);

        // make sure we limit the number of retries
        if (req.sends > this._conn.maxRetries) {
          this._conn._onDisconnectTimeout();
          return;
        }
        const time_elapsed = req.age();
        const primary_timeout = !isNaN(time_elapsed) && time_elapsed > Math.floor(timeoutMultiplier * this.wait);
        const secondary_timeout = req.dead !== null && req.timeDead() > Math.floor(secondaryTimeoutMultiplier * this.wait);
        const server_error = req.xhr.readyState === 4 && (reqStatus < 1 || reqStatus >= 500);
        if (primary_timeout || secondary_timeout || server_error) {
          if (secondary_timeout) {
            log.error(`Request ${this._requests[i].id} timed out (secondary), restarting`);
          }
          req.abort = true;
          req.xhr.abort();
          // setting to null fails on IE6, so set to empty function
          req.xhr.onreadystatechange = function () {};
          this._requests[i] = new Request(req.xmlData, req.origFunc, req.rid, req.sends);
          req = this._requests[i];
        }
        if (req.xhr.readyState === 0) {
          var _this$_conn$rawOutput, _this$_conn3;
          log.debug('request id ' + req.id + '.' + req.sends + ' posting');
          try {
            const content_type = this._conn.options.contentType || 'text/xml; charset=utf-8';
            req.xhr.open('POST', this._conn.service, this._conn.options.sync ? false : true);
            if (typeof req.xhr.setRequestHeader !== 'undefined') {
              // IE9 doesn't have setRequestHeader
              req.xhr.setRequestHeader('Content-Type', content_type);
            }
            if (this._conn.options.withCredentials) {
              req.xhr.withCredentials = true;
            }
          } catch (e2) {
            log.error('XHR open failed: ' + e2.toString());
            if (!this._conn.connected) {
              this._conn._changeConnectStatus(Status.CONNFAIL, 'bad-service');
            }
            this._conn.disconnect();
            return;
          }

          // Fires the XHR request -- may be invoked immediately
          // or on a gradually expanding retry window for reconnects
          const sendFunc = () => {
            req.date = new Date().valueOf();
            if (this._conn.options.customHeaders) {
              const headers = this._conn.options.customHeaders;
              for (const header in headers) {
                if (Object.prototype.hasOwnProperty.call(headers, header)) {
                  req.xhr.setRequestHeader(header, headers[header]);
                }
              }
            }
            req.xhr.send(req.data);
          };

          // Implement progressive backoff for reconnects --
          // First retry (send === 1) should also be instantaneous
          if (req.sends > 1) {
            // Using a cube of the retry number creates a nicely
            // expanding retry window
            const backoff = Math.min(Math.floor(timeoutMultiplier * this.wait), Math.pow(req.sends, 3)) * 1000;
            setTimeout(function () {
              // XXX: setTimeout should be called only with function expressions (23974bc1)
              sendFunc();
            }, backoff);
          } else {
            sendFunc();
          }
          req.sends++;
          if (this.strip && req.xmlData.nodeName === 'body' && req.xmlData.childNodes.length) {
            var _this$_conn$xmlOutput, _this$_conn;
            (_this$_conn$xmlOutput = (_this$_conn = this._conn).xmlOutput) === null || _this$_conn$xmlOutput === void 0 ? void 0 : _this$_conn$xmlOutput.call(_this$_conn, req.xmlData.children[0]);
          } else {
            var _this$_conn$xmlOutput2, _this$_conn2;
            (_this$_conn$xmlOutput2 = (_this$_conn2 = this._conn).xmlOutput) === null || _this$_conn$xmlOutput2 === void 0 ? void 0 : _this$_conn$xmlOutput2.call(_this$_conn2, req.xmlData);
          }
          (_this$_conn$rawOutput = (_this$_conn3 = this._conn).rawOutput) === null || _this$_conn$rawOutput === void 0 ? void 0 : _this$_conn$rawOutput.call(_this$_conn3, req.data);
        } else {
          log.debug('_processRequest: ' + (i === 0 ? 'first' : 'second') + ' request has readyState of ' + req.xhr.readyState);
        }
      }

      /**
       * _Private_ function to remove a request from the queue.
       * @private
       * @param {Request} req - The request to remove.
       */
      _removeRequest(req) {
        log.debug('removing request');
        for (let i = this._requests.length - 1; i >= 0; i--) {
          if (req === this._requests[i]) {
            this._requests.splice(i, 1);
          }
        }
        // IE6 fails on setting to null, so set to empty function
        req.xhr.onreadystatechange = function () {};
        this._throttledRequestHandler();
      }

      /**
       * _Private_ function to restart a request that is presumed dead.
       * @private
       *
       * @param {number} i - The index of the request in the queue.
       */
      _restartRequest(i) {
        const req = this._requests[i];
        if (req.dead === null) {
          req.dead = new Date();
        }
        this._processRequest(i);
      }

      /**
       * _Private_ function to get a stanza out of a request.
       * Tries to extract a stanza out of a Request Object.
       * When this fails the current connection will be disconnected.
       *
       * @param {Request} req - The Request.
       * @return {Element} - The stanza that was passed.
       */
      _reqToData(req) {
        try {
          return req.getResponse();
        } catch (e) {
          if (e.message !== 'parsererror') {
            throw e;
          }
          this._conn.disconnect('strophe-parsererror');
        }
      }

      /**
       * _Private_ function to send initial disconnect sequence.
       *
       * This is the first step in a graceful disconnect.  It sends
       * the BOSH server a terminate body and includes an unavailable
       * presence if authentication has completed.
       * @private
       * @param {Element|Builder} [pres]
       */
      _sendTerminate(pres) {
        log.debug('_sendTerminate was called');
        const body = this._buildBody().attrs({
          type: 'terminate'
        });
        const el = pres instanceof Builder ? pres.tree() : pres;
        if (pres) {
          body.cnode(el);
        }
        const req = new Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), Number(body.tree().getAttribute('rid')));
        this._requests.push(req);
        this._throttledRequestHandler();
      }

      /**
       * _Private_ part of the Connection.send function for BOSH
       * Just triggers the RequestHandler to send the messages that are in the queue
       */
      _send() {
        clearTimeout(this._conn._idleTimeout);
        this._throttledRequestHandler();
        this._conn._idleTimeout = setTimeout(() => this._conn._onIdle(), 100);
      }

      /**
       * Send an xmpp:restart stanza.
       */
      _sendRestart() {
        this._throttledRequestHandler();
        clearTimeout(this._conn._idleTimeout);
      }

      /**
       * _Private_ function to throttle requests to the connection window.
       *
       * This function makes sure we don't send requests so fast that the
       * request ids overflow the connection window in the case that one
       * request died.
       * @private
       */
      _throttledRequestHandler() {
        if (!this._requests) {
          log.debug('_throttledRequestHandler called with ' + 'undefined requests');
        } else {
          log.debug('_throttledRequestHandler called with ' + this._requests.length + ' requests');
        }
        if (!this._requests || this._requests.length === 0) {
          return;
        }
        if (this._requests.length > 0) {
          this._processRequest(0);
        }
        if (this._requests.length > 1 && Math.abs(this._requests[0].rid - this._requests[1].rid) < this.window) {
          this._processRequest(1);
        }
      }
    }

    /**
     * _Private_ helper class for managing stanza handlers.
     *
     * A Handler encapsulates a user provided callback function to be
     * executed when matching stanzas are received by the connection.
     * Handlers can be either one-off or persistant depending on their
     * return value. Returning true will cause a Handler to remain active, and
     * returning false will remove the Handler.
     *
     * Users will not use Handler objects directly, but instead they
     * will use {@link Connection.addHandler} and
     * {@link Connection.deleteHandler}.
     */
    class Handler {
      /**
       * @typedef {Object} HandlerOptions
       * @property {boolean} [HandlerOptions.matchBareFromJid]
       * @property {boolean} [HandlerOptions.ignoreNamespaceFragment]
       */

      /**
       * Create and initialize a new Handler.
       *
       * @param {Function} handler - A function to be executed when the handler is run.
       * @param {string} ns - The namespace to match.
       * @param {string} name - The element name to match.
       * @param {string|string[]} type - The stanza type (or types if an array) to match.
       * @param {string} [id] - The element id attribute to match.
       * @param {string} [from] - The element from attribute to match.
       * @param {HandlerOptions} [options] - Handler options
       */
      constructor(handler, ns, name, type, id, from, options) {
        this.handler = handler;
        this.ns = ns;
        this.name = name;
        this.type = type;
        this.id = id;
        this.options = options || {
          'matchBareFromJid': false,
          'ignoreNamespaceFragment': false
        };
        if (this.options.matchBareFromJid) {
          this.from = from ? getBareJidFromJid(from) : null;
        } else {
          this.from = from;
        }
        // whether the handler is a user handler or a system handler
        this.user = true;
      }

      /**
       * Returns the XML namespace attribute on an element.
       * If `ignoreNamespaceFragment` was passed in for this handler, then the
       * URL fragment will be stripped.
       * @param {Element} elem - The XML element with the namespace.
       * @return {string} - The namespace, with optionally the fragment stripped.
       */
      getNamespace(elem) {
        let elNamespace = elem.getAttribute('xmlns');
        if (elNamespace && this.options.ignoreNamespaceFragment) {
          elNamespace = elNamespace.split('#')[0];
        }
        return elNamespace;
      }

      /**
       * Tests if a stanza element (or any of its children) matches the
       * namespace set for this Handler.
       * @param {Element} elem - The XML element to test.
       * @return {boolean} - true if the stanza matches and false otherwise.
       */
      namespaceMatch(elem) {
        if (!this.ns || this.getNamespace(elem) === this.ns) {
          return true;
        }
        for (const child of (_elem$children = elem.children) !== null && _elem$children !== void 0 ? _elem$children : []) {
          var _elem$children;
          if (this.getNamespace(child) === this.ns) {
            return true;
          } else if (this.namespaceMatch(child)) {
            return true;
          }
        }
        return false;
      }

      /**
       * Tests if a stanza matches the Handler.
       * @param {Element} elem - The XML element to test.
       * @return {boolean} - true if the stanza matches and false otherwise.
       */
      isMatch(elem) {
        let from = elem.getAttribute('from');
        if (this.options.matchBareFromJid) {
          from = getBareJidFromJid(from);
        }
        const elem_type = elem.getAttribute('type');
        if (this.namespaceMatch(elem) && (!this.name || isTagEqual(elem, this.name)) && (!this.type || (Array.isArray(this.type) ? this.type.indexOf(elem_type) !== -1 : elem_type === this.type)) && (!this.id || elem.getAttribute('id') === this.id) && (!this.from || from === this.from)) {
          return true;
        }
        return false;
      }

      /**
       * Run the callback on a matching stanza.
       * @param {Element} elem - The DOM element that triggered the Handler.
       * @return {boolean} - A boolean indicating if the handler should remain active.
       */
      run(elem) {
        let result = null;
        try {
          result = this.handler(elem);
        } catch (e) {
          handleError(e);
          throw e;
        }
        return result;
      }

      /**
       * Get a String representation of the Handler object.
       * @return {string}
       */
      toString() {
        return '{Handler: ' + this.handler + '(' + this.name + ',' + this.id + ',' + this.ns + ')}';
      }
    }

    /**
     * _Private_ helper class for managing timed handlers.
     *
     * A Strophe.TimedHandler encapsulates a user provided callback that
     * should be called after a certain period of time or at regular
     * intervals.  The return value of the callback determines whether the
     * Strophe.TimedHandler will continue to fire.
     *
     * Users will not use Strophe.TimedHandler objects directly, but instead
     * they will use {@link Strophe.Connection#addTimedHandler|addTimedHandler()} and
     * {@link Strophe.Connection#deleteTimedHandler|deleteTimedHandler()}.
     *
     * @memberof Strophe
     */
    class TimedHandler {
      /**
       * Create and initialize a new Strophe.TimedHandler object.
       * @param {number} period - The number of milliseconds to wait before the
       *     handler is called.
       * @param {Function} handler - The callback to run when the handler fires.  This
       *     function should take no arguments.
       */
      constructor(period, handler) {
        this.period = period;
        this.handler = handler;
        this.lastCalled = new Date().getTime();
        this.user = true;
      }

      /**
       * Run the callback for the Strophe.TimedHandler.
       *
       * @return {boolean} Returns the result of running the handler,
       *  which is `true` if the Strophe.TimedHandler should be called again,
       *  and `false` otherwise.
       */
      run() {
        this.lastCalled = new Date().getTime();
        return this.handler();
      }

      /**
       * Reset the last called time for the Strophe.TimedHandler.
       */
      reset() {
        this.lastCalled = new Date().getTime();
      }

      /**
       * Get a string representation of the Strophe.TimedHandler object.
       * @return {string}
       */
      toString() {
        return '{TimedHandler: ' + this.handler + '(' + this.period + ')}';
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */

    /**
     * Encapsulates an SASL authentication mechanism.
     *
     * User code may override the priority for each mechanism or disable it completely.
     * See <priority> for information about changing priority and <test> for informatian on
     * how to disable a mechanism.
     *
     * By default, all mechanisms are enabled and t_he priorities are
     *
     *     SCRAM-SHA-512 - 72
     *     SCRAM-SHA-384 - 71
     *     SCRAM-SHA-256 - 70
     *     SCRAM-SHA-1   - 60
     *     PLAIN         - 50
     *     OAUTHBEARER   - 40
     *     X-OAUTH2      - 30
     *     ANONYMOUS     - 20
     *     EXTERNAL      - 10
     *
     * See: {@link Strophe.Connection#registerSASLMechanisms}
     */
    class SASLMechanism {
      /**
       * PrivateConstructor: Strophe.SASLMechanism
       * SASL auth mechanism abstraction.
       * @param {String} [name] - SASL Mechanism name.
       * @param {Boolean} [isClientFirst] - If client should send response first without challenge.
       * @param {Number} [priority] - Priority.
       */
      constructor(name, isClientFirst, priority) {
        /** Mechanism name. */
        this.mechname = name;

        /**
         * If client sends response without initial server challenge.
         */
        this.isClientFirst = isClientFirst;

        /**
         * Determines which {@link SASLMechanism} is chosen for authentication (Higher is better).
         * Users may override this to prioritize mechanisms differently.
         *
         * Example: (This will cause Strophe to choose the mechanism that the server sent first)
         *
         * > Strophe.SASLPlain.priority = Strophe.SASLSHA1.priority;
         *
         * See <SASL mechanisms> for a list of available mechanisms.
         */
        this.priority = priority;
      }

      /**
       * Checks if mechanism able to run.
       * To disable a mechanism, make this return false;
       *
       * To disable plain authentication run
       * > Strophe.SASLPlain.test = function() {
       * >   return false;
       * > }
       *
       * See <SASL mechanisms> for a list of available mechanisms.
       * @param {Connection} connection - Target Connection.
       * @return {boolean} If mechanism was able to run.
       */
      // eslint-disable-next-line class-methods-use-this, no-unused-vars
      test(connection) {
        return true;
      }

      /**
       * Called before starting mechanism on some connection.
       * @param {Connection} connection - Target Connection.
       */
      onStart(connection) {
        this._connection = connection;
      }

      /**
       * Called by protocol implementation on incoming challenge.
       *
       * By deafult, if the client is expected to send data first (isClientFirst === true),
       * this method is called with `challenge` as null on the first call,
       * unless `clientChallenge` is overridden in the relevant subclass.
       * @param {Connection} connection - Target Connection.
       * @param {string} [challenge] - current challenge to handle.
       * @return {string|Promise<string|false>} Mechanism response.
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      onChallenge(connection, challenge) {
        throw new Error('You should implement challenge handling!');
      }

      /**
       * Called by the protocol implementation if the client is expected to send
       * data first in the authentication exchange (i.e. isClientFirst === true).
       * @param {Connection} connection - Target Connection.
       * @return {string|Promise<string|false>} Mechanism response.
       */
      clientChallenge(connection) {
        if (!this.isClientFirst) {
          throw new Error('clientChallenge should not be called if isClientFirst is false!');
        }
        return this.onChallenge(connection);
      }

      /**
       * Protocol informs mechanism implementation about SASL failure.
       */
      onFailure() {
        this._connection = null;
      }

      /**
       * Protocol informs mechanism implementation about SASL success.
       */
      onSuccess() {
        this._connection = null;
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLAnonymous extends SASLMechanism {
      /**
       * SASL ANONYMOUS authentication.
       */
      constructor(mechname = 'ANONYMOUS', isClientFirst = false, priority = 20) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid === null;
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLExternal extends SASLMechanism {
      /**
       * SASL EXTERNAL authentication.
       *
       * The EXTERNAL mechanism allows a client to request the server to use
       * credentials established by means external to the mechanism to
       * authenticate the client. The external means may be, for instance,
       * TLS services.
       */
      constructor(mechname = 'EXTERNAL', isClientFirst = true, priority = 10) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      onChallenge(connection) {
        /* According to XEP-178, an authzid SHOULD NOT be presented when the
         * authcid contained or implied in the client certificate is the JID (i.e.
         * authzid) with which the user wants to log in as.
         *
         * To NOT send the authzid, the user should therefore set the authcid equal
         * to the JID when instantiating a new Strophe.Connection object.
         */
        return connection.authcid === connection.authzid ? '' : connection.authzid;
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLOAuthBearer extends SASLMechanism {
      /**
       * SASL OAuth Bearer authentication.
       */
      constructor(mechname = 'OAUTHBEARER', isClientFirst = true, priority = 40) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.pass !== null;
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      onChallenge(connection) {
        let auth_str = 'n,';
        if (connection.authcid !== null) {
          auth_str = auth_str + 'a=' + connection.authzid;
        }
        auth_str = auth_str + ',';
        auth_str = auth_str + '\u0001';
        auth_str = auth_str + 'auth=Bearer ';
        auth_str = auth_str + connection.pass;
        auth_str = auth_str + '\u0001';
        auth_str = auth_str + '\u0001';
        return utils.utf16to8(auth_str);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLPlain extends SASLMechanism {
      /**
       * SASL PLAIN authentication.
       */
      constructor(mechname = 'PLAIN', isClientFirst = true, priority = 50) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid !== null;
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      onChallenge(connection) {
        const {
          authcid,
          authzid,
          domain,
          pass
        } = connection;
        if (!domain) {
          throw new Error('SASLPlain onChallenge: domain is not defined!');
        }
        // Only include authzid if it differs from authcid.
        // See: https://tools.ietf.org/html/rfc6120#section-6.3.8
        let auth_str = authzid !== `${authcid}@${domain}` ? authzid : '';
        auth_str = auth_str + '\u0000';
        auth_str = auth_str + authcid;
        auth_str = auth_str + '\u0000';
        auth_str = auth_str + pass;
        return utils.utf16to8(auth_str);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */

    /**
     * @param {string} authMessage
     * @param {ArrayBufferLike} clientKey
     * @param {string} hashName
     */
    async function scramClientProof(authMessage, clientKey, hashName) {
      const storedKey = await crypto.subtle.importKey('raw', await crypto.subtle.digest(hashName, clientKey), {
        'name': 'HMAC',
        'hash': hashName
      }, false, ['sign']);
      const clientSignature = await crypto.subtle.sign('HMAC', storedKey, utils.stringToArrayBuf(authMessage));
      return utils.xorArrayBuffers(clientKey, clientSignature);
    }

    /**
     * This function parses the information in a SASL SCRAM challenge response,
     * into an object of the form
     * { nonce: String,
     *   salt:  ArrayBuffer,
     *   iter:  Int
     * }
     * Returns undefined on failure.
     * @param {string} challenge
     */
    function scramParseChallenge(challenge) {
      let nonce, salt, iter;
      const attribMatch = /([a-z]+)=([^,]+)(,|$)/;
      while (challenge.match(attribMatch)) {
        const matches = challenge.match(attribMatch);
        challenge = challenge.replace(matches[0], '');
        switch (matches[1]) {
          case 'r':
            nonce = matches[2];
            break;
          case 's':
            salt = utils.base64ToArrayBuf(matches[2]);
            break;
          case 'i':
            iter = parseInt(matches[2], 10);
            break;
          case 'm':
            // Mandatory but unknown extension, per RFC 5802 we should abort
            return undefined;
        }
      }

      // Consider iteration counts less than 4096 insecure, as reccommended by
      // RFC 5802
      if (isNaN(iter) || iter < 4096) {
        log.warn('Failing SCRAM authentication because server supplied iteration count < 4096.');
        return undefined;
      }
      if (!salt) {
        log.warn('Failing SCRAM authentication because server supplied incorrect salt.');
        return undefined;
      }
      return {
        'nonce': nonce,
        'salt': salt,
        'iter': iter
      };
    }

    /**
     * Derive the client and server keys given a string password,
     * a hash name, and a bit length.
     * Returns an object of the following form:
     * { ck: ArrayBuffer, the client key
     *   sk: ArrayBuffer, the server key
     * }
     * @param {string} password
     * @param {BufferSource} salt
     * @param {number} iter
     * @param {string} hashName
     * @param {number} hashBits
     */
    async function scramDeriveKeys(password, salt, iter, hashName, hashBits) {
      const saltedPasswordBits = await crypto.subtle.deriveBits({
        'name': 'PBKDF2',
        'salt': salt,
        'iterations': iter,
        'hash': {
          'name': hashName
        }
      }, await crypto.subtle.importKey('raw', utils.stringToArrayBuf(password), 'PBKDF2', false, ['deriveBits']), hashBits);
      const saltedPassword = await crypto.subtle.importKey('raw', saltedPasswordBits, {
        'name': 'HMAC',
        'hash': hashName
      }, false, ['sign']);
      return {
        'ck': await crypto.subtle.sign('HMAC', saltedPassword, utils.stringToArrayBuf('Client Key')),
        'sk': await crypto.subtle.sign('HMAC', saltedPassword, utils.stringToArrayBuf('Server Key'))
      };
    }

    /**
     * @param {string} authMessage
     * @param {BufferSource} sk
     * @param {string} hashName
     */
    async function scramServerSign(authMessage, sk, hashName) {
      const serverKey = await crypto.subtle.importKey('raw', sk, {
        'name': 'HMAC',
        'hash': hashName
      }, false, ['sign']);
      return crypto.subtle.sign('HMAC', serverKey, utils.stringToArrayBuf(authMessage));
    }

    /**
     * Generate an ASCII nonce (not containing the ',' character)
     * @return {string}
     */
    function generate_cnonce() {
      // generate 16 random bytes of nonce, base64 encoded
      const bytes = new Uint8Array(16);
      return utils.arrayBufToBase64(crypto.getRandomValues(bytes).buffer);
    }

    /**
     * @typedef {Object} Password
     * @property {string} Password.name
     * @property {string} Password.ck
     * @property {string} Password.sk
     * @property {number} Password.iter
     * @property {string} salt
     */

    const scram = {
      /**
       * On success, sets
       * connection_sasl_data["server-signature"]
       * and
       * connection._sasl_data.keys
       *
       * The server signature should be verified after this function completes..
       *
       * On failure, returns connection._sasl_failure_cb();
       * @param {Connection} connection
       * @param {string} challenge
       * @param {string} hashName
       * @param {number} hashBits
       */
      async scramResponse(connection, challenge, hashName, hashBits) {
        const cnonce = connection._sasl_data.cnonce;
        const challengeData = scramParseChallenge(challenge);

        // The RFC requires that we verify the (server) nonce has the client
        // nonce as an initial substring.
        if (!challengeData && (challengeData === null || challengeData === void 0 ? void 0 : challengeData.nonce.slice(0, cnonce.length)) !== cnonce) {
          log.warn('Failing SCRAM authentication because server supplied incorrect nonce.');
          connection._sasl_data = {};
          return connection._sasl_failure_cb();
        }
        let clientKey, serverKey;
        const {
          pass
        } = connection;
        if (typeof connection.pass === 'string' || connection.pass instanceof String) {
          const keys = await scramDeriveKeys(/** @type {string} */pass, challengeData.salt, challengeData.iter, hashName, hashBits);
          clientKey = keys.ck;
          serverKey = keys.sk;
        } else if (
        // Either restore the client key and server key passed in, or derive new ones
        /** @type {Password} */
        (pass === null || pass === void 0 ? void 0 : pass.name) === hashName && /** @type {Password} */(pass === null || pass === void 0 ? void 0 : pass.salt) === utils.arrayBufToBase64(challengeData.salt) && /** @type {Password} */(pass === null || pass === void 0 ? void 0 : pass.iter) === challengeData.iter) {
          const {
            ck,
            sk
          } = /** @type {Password} */pass;
          clientKey = utils.base64ToArrayBuf(ck);
          serverKey = utils.base64ToArrayBuf(sk);
        } else {
          return connection._sasl_failure_cb();
        }
        const clientFirstMessageBare = connection._sasl_data['client-first-message-bare'];
        const serverFirstMessage = challenge;
        const clientFinalMessageBare = `c=biws,r=${challengeData.nonce}`;
        const authMessage = `${clientFirstMessageBare},${serverFirstMessage},${clientFinalMessageBare}`;
        const clientProof = await scramClientProof(authMessage, clientKey, hashName);
        const serverSignature = await scramServerSign(authMessage, serverKey, hashName);
        connection._sasl_data['server-signature'] = utils.arrayBufToBase64(serverSignature);
        connection._sasl_data.keys = {
          'name': hashName,
          'iter': challengeData.iter,
          'salt': utils.arrayBufToBase64(challengeData.salt),
          'ck': utils.arrayBufToBase64(clientKey),
          'sk': utils.arrayBufToBase64(serverKey)
        };
        return `${clientFinalMessageBare},p=${utils.arrayBufToBase64(clientProof)}`;
      },
      /**
       * Returns a string containing the client first message
       * @param {Connection} connection
       * @param {string} test_cnonce
       */
      clientChallenge(connection, test_cnonce) {
        const cnonce = test_cnonce || generate_cnonce();
        const client_first_message_bare = `n=${connection.authcid},r=${cnonce}`;
        connection._sasl_data.cnonce = cnonce;
        connection._sasl_data['client-first-message-bare'] = client_first_message_bare;
        return `n,,${client_first_message_bare}`;
      }
    };

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLSHA1 extends SASLMechanism {
      /**
       * SASL SCRAM SHA 1 authentication.
       */
      constructor(mechname = 'SCRAM-SHA-1', isClientFirst = true, priority = 60) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid !== null;
      }

      /**
       * @param {Connection} connection
       * @param {string} [challenge]
       * @return {Promise<string|false>} Mechanism response.
       */
      // eslint-disable-next-line class-methods-use-this
      async onChallenge(connection, challenge) {
        return await scram.scramResponse(connection, challenge, 'SHA-1', 160);
      }

      /**
       * @param {Connection} connection
       * @param {string} [test_cnonce]
       */
      // eslint-disable-next-line class-methods-use-this
      clientChallenge(connection, test_cnonce) {
        return scram.clientChallenge(connection, test_cnonce);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLSHA256 extends SASLMechanism {
      /**
       * SASL SCRAM SHA 256 authentication.
       */
      constructor(mechname = 'SCRAM-SHA-256', isClientFirst = true, priority = 70) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid !== null;
      }

      /**
       * @param {Connection} connection
       * @param {string} [challenge]
       */
      // eslint-disable-next-line class-methods-use-this
      async onChallenge(connection, challenge) {
        return await scram.scramResponse(connection, challenge, 'SHA-256', 256);
      }

      /**
       * @param {Connection} connection
       * @param {string} [test_cnonce]
       */
      // eslint-disable-next-line class-methods-use-this
      clientChallenge(connection, test_cnonce) {
        return scram.clientChallenge(connection, test_cnonce);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLSHA384 extends SASLMechanism {
      /**
       * SASL SCRAM SHA 384 authentication.
       */
      constructor(mechname = 'SCRAM-SHA-384', isClientFirst = true, priority = 71) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid !== null;
      }

      /**
       * @param {Connection} connection
       * @param {string} [challenge]
       */
      // eslint-disable-next-line class-methods-use-this
      async onChallenge(connection, challenge) {
        return await scram.scramResponse(connection, challenge, 'SHA-384', 384);
      }

      /**
       * @param {Connection} connection
       * @param {string} [test_cnonce]
       */
      // eslint-disable-next-line class-methods-use-this
      clientChallenge(connection, test_cnonce) {
        return scram.clientChallenge(connection, test_cnonce);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */
    class SASLSHA512 extends SASLMechanism {
      /**
       * SASL SCRAM SHA 512 authentication.
       */
      constructor(mechname = 'SCRAM-SHA-512', isClientFirst = true, priority = 72) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.authcid !== null;
      }

      /**
       * @param {Connection} connection
       * @param {string} [challenge]
       */
      // eslint-disable-next-line class-methods-use-this
      async onChallenge(connection, challenge) {
        return await scram.scramResponse(connection, challenge, 'SHA-512', 512);
      }

      /**
       * @param {Connection} connection
       * @param {string} [test_cnonce]
       */
      // eslint-disable-next-line class-methods-use-this
      clientChallenge(connection, test_cnonce) {
        return scram.clientChallenge(connection, test_cnonce);
      }
    }

    /**
     * @typedef {import("./connection.js").default} Connection
     */

    class SASLXOAuth2 extends SASLMechanism {
      /**
       * SASL X-OAuth2 authentication.
       */
      constructor(mechname = 'X-OAUTH2', isClientFirst = true, priority = 30) {
        super(mechname, isClientFirst, priority);
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      test(connection) {
        return connection.pass !== null;
      }

      /**
       * @param {Connection} connection
       */
      // eslint-disable-next-line class-methods-use-this
      onChallenge(connection) {
        let auth_str = '\u0000';
        if (connection.authcid !== null) {
          auth_str = auth_str + connection.authzid;
        }
        auth_str = auth_str + '\u0000';
        auth_str = auth_str + connection.pass;
        return utils.utf16to8(auth_str);
      }
    }

    class SessionError extends Error {
      /**
       * @param {string} message
       */
      constructor(message) {
        super(message);
        this.name = 'StropheSessionError';
      }
    }

    /**
     * A JavaScript library to enable XMPP over Websocket in Strophejs.
     *
     * This file implements XMPP over WebSockets for Strophejs.
     * If a Connection is established with a Websocket url (ws://...)
     * Strophe will use WebSockets.
     * For more information on XMPP-over-WebSocket see RFC 7395:
     * http://tools.ietf.org/html/rfc7395
     *
     * WebSocket support implemented by Andreas Guth (andreas.guth@rwth-aachen.de)
     */

    /**
     * Helper class that handles WebSocket Connections
     *
     * The WebSocket class is used internally by Connection
     * to encapsulate WebSocket sessions. It is not meant to be used from user's code.
     */
    class Websocket {
      /**
       * Create and initialize a WebSocket object.
       * Currently only sets the connection Object.
       * @param {Connection} connection - The Connection that will use WebSockets.
       */
      constructor(connection) {
        this._conn = connection;
        this.strip = 'wrapper';
        const service = connection.service;
        if (service.indexOf('ws:') !== 0 && service.indexOf('wss:') !== 0) {
          // If the service is not an absolute URL, assume it is a path and put the absolute
          // URL together from options, current URL and the path.
          let new_service = '';
          if (connection.options.protocol === 'ws' && location.protocol !== 'https:') {
            new_service += 'ws';
          } else {
            new_service += 'wss';
          }
          new_service += '://' + location.host;
          if (service.indexOf('/') !== 0) {
            new_service += location.pathname + service;
          } else {
            new_service += service;
          }
          connection.service = new_service;
        }
      }

      /**
       * _Private_ helper function to generate the <stream> start tag for WebSockets
       * @private
       * @return {Builder} - A Builder with a <stream> element.
       */
      _buildStream() {
        return $build('open', {
          'xmlns': NS.FRAMING,
          'to': this._conn.domain,
          'version': '1.0'
        });
      }

      /**
       * _Private_ checks a message for stream:error
       * @private
       * @param {Element} bodyWrap - The received stanza.
       * @param {number} connectstatus - The ConnectStatus that will be set on error.
       * @return {boolean} - true if there was a streamerror, false otherwise.
       */
      _checkStreamError(bodyWrap, connectstatus) {
        let errors;
        if (bodyWrap.getElementsByTagNameNS) {
          errors = bodyWrap.getElementsByTagNameNS(NS.STREAM, 'error');
        } else {
          errors = bodyWrap.getElementsByTagName('stream:error');
        }
        if (errors.length === 0) {
          return false;
        }
        const error = errors[0];
        let condition = '';
        let text = '';
        const ns = 'urn:ietf:params:xml:ns:xmpp-streams';
        for (let i = 0; i < error.childNodes.length; i++) {
          const e = error.childNodes[i];
          if (e.nodeType === e.ELEMENT_NODE) {
            /** @type {Element} */
            const el = /** @type {any} */e;
            if (el.getAttribute('xmlns') !== ns) {
              break;
            }
          }
          if (e.nodeName === 'text') {
            text = e.textContent;
          } else {
            condition = e.nodeName;
          }
        }
        let errorString = 'WebSocket stream error: ';
        if (condition) {
          errorString += condition;
        } else {
          errorString += 'unknown';
        }
        if (text) {
          errorString += ' - ' + text;
        }
        log.error(errorString);

        // close the connection on stream_error
        this._conn._changeConnectStatus(connectstatus, condition);
        this._conn._doDisconnect();
        return true;
      }

      /**
       * Reset the connection.
       *
       * This function is called by the reset function of the Strophe Connection.
       * Is not needed by WebSockets.
       */
      // eslint-disable-next-line class-methods-use-this
      _reset() {
        return;
      }

      /**
       * _Private_ function called by Connection.connect
       *
       * Creates a WebSocket for a connection and assigns Callbacks to it.
       * Does nothing if there already is a WebSocket.
       */
      _connect() {
        // Ensure that there is no open WebSocket from a previous Connection.
        this._closeSocket();

        /**
         * @typedef {Object} WebsocketLike
         * @property {(str: string) => void} WebsocketLike.send
         * @property {function(): void} WebsocketLike.close
         * @property {function(): void} WebsocketLike.onopen
         * @property {(e: ErrorEvent) => void} WebsocketLike.onerror
         * @property {(e: CloseEvent) => void} WebsocketLike.onclose
         * @property {(message: MessageEvent) => void} WebsocketLike.onmessage
         * @property {string} WebsocketLike.readyState
         */

        /** @type {import('ws')|WebSocket|WebsocketLike} */
        this.socket = new WebSocket(this._conn.service, 'xmpp');
        this.socket.onopen = () => this._onOpen();
        /** @param {ErrorEvent} e */
        this.socket.onerror = e => this._onError(e);
        /** @param {CloseEvent} e */
        this.socket.onclose = e => this._onClose(e);
        /**
         * Gets replaced with this._onMessage once _onInitialMessage is called
         * @param {MessageEvent} message
         */
        this.socket.onmessage = message => this._onInitialMessage(message);
      }

      /**
       * _Private_ function called by Connection._connect_cb
       * checks for stream:error
       * @param {Element} bodyWrap - The received stanza.
       */
      _connect_cb(bodyWrap) {
        const error = this._checkStreamError(bodyWrap, Status.CONNFAIL);
        if (error) {
          return Status.CONNFAIL;
        }
      }

      /**
       * _Private_ function that checks the opening <open /> tag for errors.
       *
       * Disconnects if there is an error and returns false, true otherwise.
       * @private
       * @param {Element} message - Stanza containing the <open /> tag.
       */
      _handleStreamStart(message) {
        let error = null;

        // Check for errors in the <open /> tag
        const ns = message.getAttribute('xmlns');
        if (typeof ns !== 'string') {
          error = 'Missing xmlns in <open />';
        } else if (ns !== NS.FRAMING) {
          error = 'Wrong xmlns in <open />: ' + ns;
        }
        const ver = message.getAttribute('version');
        if (typeof ver !== 'string') {
          error = 'Missing version in <open />';
        } else if (ver !== '1.0') {
          error = 'Wrong version in <open />: ' + ver;
        }
        if (error) {
          this._conn._changeConnectStatus(Status.CONNFAIL, error);
          this._conn._doDisconnect();
          return false;
        }
        return true;
      }

      /**
       * _Private_ function that handles the first connection messages.
       *
       * On receiving an opening stream tag this callback replaces itself with the real
       * message handler. On receiving a stream error the connection is terminated.
       * @param {MessageEvent} message
       */
      _onInitialMessage(message) {
        if (message.data.indexOf('<open ') === 0 || message.data.indexOf('<?xml') === 0) {
          // Strip the XML Declaration, if there is one
          const data = message.data.replace(/^(<\?.*?\?>\s*)*/, '');
          if (data === '') return;
          const streamStart = new DOMParser().parseFromString(data, 'text/xml').documentElement;
          this._conn.xmlInput(streamStart);
          this._conn.rawInput(message.data);

          //_handleStreamSteart will check for XML errors and disconnect on error
          if (this._handleStreamStart(streamStart)) {
            //_connect_cb will check for stream:error and disconnect on error
            this._connect_cb(streamStart);
          }
        } else if (message.data.indexOf('<close ') === 0) {
          // <close xmlns="urn:ietf:params:xml:ns:xmpp-framing />
          // Parse the raw string to an XML element
          const parsedMessage = new DOMParser().parseFromString(message.data, 'text/xml').documentElement;
          // Report this input to the raw and xml handlers
          this._conn.xmlInput(parsedMessage);
          this._conn.rawInput(message.data);
          const see_uri = parsedMessage.getAttribute('see-other-uri');
          if (see_uri) {
            const service = this._conn.service;
            // Valid scenarios: WSS->WSS, WS->ANY
            const isSecureRedirect = service.indexOf('wss:') >= 0 && see_uri.indexOf('wss:') >= 0 || service.indexOf('ws:') >= 0;
            if (isSecureRedirect) {
              this._conn._changeConnectStatus(Status.REDIRECT, 'Received see-other-uri, resetting connection');
              this._conn.reset();
              this._conn.service = see_uri;
              this._connect();
            }
          } else {
            this._conn._changeConnectStatus(Status.CONNFAIL, 'Received closing stream');
            this._conn._doDisconnect();
          }
        } else {
          this._replaceMessageHandler();
          const string = this._streamWrap(message.data);
          const elem = new DOMParser().parseFromString(string, 'text/xml').documentElement;
          this._conn._connect_cb(elem, null, message.data);
        }
      }

      /**
       * Called by _onInitialMessage in order to replace itself with the general message handler.
       * This method is overridden by WorkerWebsocket, which manages a
       * websocket connection via a service worker and doesn't have direct access
       * to the socket.
       */
      _replaceMessageHandler() {
        /** @param {MessageEvent} m */
        this.socket.onmessage = m => this._onMessage(m);
      }

      /**
       * _Private_ function called by Connection.disconnect
       * Disconnects and sends a last stanza if one is given
       * @param {Element|Builder} [pres] - This stanza will be sent before disconnecting.
       */
      _disconnect(pres) {
        if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
          if (pres) {
            this._conn.send(pres);
          }
          const close = $build('close', {
            'xmlns': NS.FRAMING
          });
          this._conn.xmlOutput(close.tree());
          const closeString = Builder.serialize(close);
          this._conn.rawOutput(closeString);
          try {
            this.socket.send(closeString);
          } catch (e) {
            log.warn(`Couldn't send <close /> tag. "${e.message}"`);
          }
        }
        setTimeout(() => this._conn._doDisconnect(), 0);
      }

      /**
       * _Private_ function to disconnect.
       * Just closes the Socket for WebSockets
       */
      _doDisconnect() {
        log.debug('WebSockets _doDisconnect was called');
        this._closeSocket();
      }

      /**
       * PrivateFunction _streamWrap
       * _Private_ helper function to wrap a stanza in a <stream> tag.
       * This is used so Strophe can process stanzas from WebSockets like BOSH
       * @param {string} stanza
       */
      // eslint-disable-next-line class-methods-use-this
      _streamWrap(stanza) {
        return '<wrapper>' + stanza + '</wrapper>';
      }

      /**
       * _Private_ function to close the WebSocket.
       *
       * Closes the socket if it is still open and deletes it
       */
      _closeSocket() {
        if (this.socket) {
          try {
            this.socket.onclose = null;
            this.socket.onerror = null;
            this.socket.onmessage = null;
            this.socket.close();
          } catch (e) {
            log.debug(e.message);
          }
        }
        this.socket = null;
      }

      /**
       * _Private_ function to check if the message queue is empty.
       * @return {true} - True, because WebSocket messages are send immediately after queueing.
       */
      // eslint-disable-next-line class-methods-use-this
      _emptyQueue() {
        return true;
      }

      /**
       * _Private_ function to handle websockets closing.
       * @param {CloseEvent} [e]
       */
      _onClose(e) {
        if (this._conn.connected && !this._conn.disconnecting) {
          log.error('Websocket closed unexpectedly');
          this._conn._doDisconnect();
        } else if (e && e.code === 1006 && !this._conn.connected && this.socket) {
          // in case the onError callback was not called (Safari 10 does not
          // call onerror when the initial connection fails) we need to
          // dispatch a CONNFAIL status update to be consistent with the
          // behavior on other browsers.
          log.error('Websocket closed unexcectedly');
          this._conn._changeConnectStatus(Status.CONNFAIL, 'The WebSocket connection could not be established or was disconnected.');
          this._conn._doDisconnect();
        } else {
          log.debug('Websocket closed');
        }
      }

      /**
       * @callback connectionCallback
       * @param {Connection} connection
       */

      /**
       * Called on stream start/restart when no stream:features
       * has been received.
       * @param {connectionCallback} callback
       */
      _no_auth_received(callback) {
        log.error('Server did not offer a supported authentication mechanism');
        this._conn._changeConnectStatus(Status.CONNFAIL, ErrorCondition.NO_AUTH_MECH);
        callback === null || callback === void 0 ? void 0 : callback.call(this._conn);
        this._conn._doDisconnect();
      }

      /**
       * _Private_ timeout handler for handling non-graceful disconnection.
       *
       * This does nothing for WebSockets
       */
      _onDisconnectTimeout() {} // eslint-disable-line class-methods-use-this

      /**
       * _Private_ helper function that makes sure all pending requests are aborted.
       */
      _abortAllRequests() {} // eslint-disable-line class-methods-use-this

      /**
       * _Private_ function to handle websockets errors.
       * @param {Object} error - The websocket error.
       */
      _onError(error) {
        log.error('Websocket error ' + JSON.stringify(error));
        this._conn._changeConnectStatus(Status.CONNFAIL, 'The WebSocket connection could not be established or was disconnected.');
        this._disconnect();
      }

      /**
       * _Private_ function called by Connection._onIdle
       * sends all queued stanzas
       */
      _onIdle() {
        const data = this._conn._data;
        if (data.length > 0 && !this._conn.paused) {
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== null) {
              const stanza = data[i] === 'restart' ? this._buildStream().tree() : data[i];
              if (stanza === 'restart') throw new Error('Wrong type for stanza'); // Shut up tsc
              const rawStanza = Builder.serialize(stanza);
              this._conn.xmlOutput(stanza);
              this._conn.rawOutput(rawStanza);
              this.socket.send(rawStanza);
            }
          }
          this._conn._data = [];
        }
      }

      /**
       * _Private_ function to handle websockets messages.
       *
       * This function parses each of the messages as if they are full documents.
       * [TODO : We may actually want to use a SAX Push parser].
       *
       * Since all XMPP traffic starts with
       * <stream:stream version='1.0'
       *                xml:lang='en'
       *                xmlns='jabber:client'
       *                xmlns:stream='http://etherx.jabber.org/streams'
       *                id='3697395463'
       *                from='SERVER'>
       *
       * The first stanza will always fail to be parsed.
       *
       * Additionally, the seconds stanza will always be <stream:features> with
       * the stream NS defined in the previous stanza, so we need to 'force'
       * the inclusion of the NS in this stanza.
       *
       * @param {MessageEvent} message - The websocket message event
       */
      _onMessage(message) {
        let elem;
        // check for closing stream
        const close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
        if (message.data === close) {
          this._conn.rawInput(close);
          this._conn.xmlInput(message);
          if (!this._conn.disconnecting) {
            this._conn._doDisconnect();
          }
          return;
        } else if (message.data.search('<open ') === 0) {
          // This handles stream restarts
          elem = new DOMParser().parseFromString(message.data, 'text/xml').documentElement;
          if (!this._handleStreamStart(elem)) {
            return;
          }
        } else {
          const data = this._streamWrap(message.data);
          elem = new DOMParser().parseFromString(data, 'text/xml').documentElement;
        }
        if (this._checkStreamError(elem, Status.ERROR)) {
          return;
        }

        //handle unavailable presence stanza before disconnecting
        if (this._conn.disconnecting && elem.firstElementChild.nodeName === 'presence' && elem.firstElementChild.getAttribute('type') === 'unavailable') {
          this._conn.xmlInput(elem);
          this._conn.rawInput(Builder.serialize(elem));
          // if we are already disconnecting we will ignore the unavailable stanza and
          // wait for the </stream:stream> tag before we close the connection
          return;
        }
        this._conn._dataRecv(elem, message.data);
      }

      /**
       * _Private_ function to handle websockets connection setup.
       * The opening stream tag is sent here.
       * @private
       */
      _onOpen() {
        log.debug('Websocket open');
        const start = this._buildStream();
        this._conn.xmlOutput(start.tree());
        const startString = Builder.serialize(start);
        this._conn.rawOutput(startString);
        this.socket.send(startString);
      }

      /**
       * _Private_ part of the Connection.send function for WebSocket
       * Just flushes the messages that are in the queue
       */
      _send() {
        this._conn.flush();
      }

      /**
       * Send an xmpp:restart stanza.
       */
      _sendRestart() {
        clearTimeout(this._conn._idleTimeout);
        this._conn._onIdle.bind(this._conn)();
      }
    }

    /**
     * @license MIT
     * @copyright JC Brand
     */

    /**
     * Helper class that handles a websocket connection inside a shared worker.
     */
    class WorkerWebsocket extends Websocket {
      /**
       * @typedef {import("./connection.js").default} Connection
       */

      /**
       * Create and initialize a WorkerWebsocket object.
       * @param {Connection} connection - The Connection
       */
      constructor(connection) {
        super(connection);
        this._conn = connection;
        this.worker = new SharedWorker(this._conn.options.worker, 'Strophe XMPP Connection');
        this.worker.onerror = e => {
          var _console;
          (_console = console) === null || _console === void 0 ? void 0 : _console.error(e);
          log.error(`Shared Worker Error: ${e}`);
        };
      }

      /**
       * @private
       */
      _setSocket() {
        this.socket = {
          /** @param {string} str */
          send: str => this.worker.port.postMessage(['send', str]),
          close: () => this.worker.port.postMessage(['_closeSocket']),
          onopen: () => {},
          /** @param {ErrorEvent} e */
          onerror: e => this._onError(e),
          /** @param {CloseEvent} e */
          onclose: e => this._onClose(e),
          onmessage: () => {},
          readyState: null
        };
      }
      _connect() {
        this._setSocket();
        /** @param {MessageEvent} m */
        this._messageHandler = m => this._onInitialMessage(m);
        this.worker.port.start();
        this.worker.port.onmessage = ev => this._onWorkerMessage(ev);
        this.worker.port.postMessage(['_connect', this._conn.service, this._conn.jid]);
      }

      /**
       * @param {Function} callback
       */
      _attach(callback) {
        this._setSocket();
        /** @param {MessageEvent} m */
        this._messageHandler = m => this._onMessage(m);
        this._conn.connect_callback = callback;
        this.worker.port.start();
        this.worker.port.onmessage = ev => this._onWorkerMessage(ev);
        this.worker.port.postMessage(['_attach', this._conn.service]);
      }

      /**
       * @param {number} status
       * @param {string} jid
       */
      _attachCallback(status, jid) {
        if (status === Status.ATTACHED) {
          this._conn.jid = jid;
          this._conn.authenticated = true;
          this._conn.connected = true;
          this._conn.restored = true;
          this._conn._changeConnectStatus(Status.ATTACHED);
        } else if (status === Status.ATTACHFAIL) {
          this._conn.authenticated = false;
          this._conn.connected = false;
          this._conn.restored = false;
          this._conn._changeConnectStatus(Status.ATTACHFAIL);
        }
      }

      /**
       * @param {Element|Builder} pres - This stanza will be sent before disconnecting.
       */
      _disconnect(pres) {
        pres && this._conn.send(pres);
        const close = $build('close', {
          'xmlns': NS.FRAMING
        });
        this._conn.xmlOutput(close.tree());
        const closeString = Builder.serialize(close);
        this._conn.rawOutput(closeString);
        this.worker.port.postMessage(['send', closeString]);
        this._conn._doDisconnect();
      }
      _closeSocket() {
        this.socket.close();
      }

      /**
       * Called by _onInitialMessage in order to replace itself with the general message handler.
       * This method is overridden by WorkerWebsocket, which manages a
       * websocket connection via a service worker and doesn't have direct access
       * to the socket.
       */
      _replaceMessageHandler() {
        /** @param {MessageEvent} m */
        this._messageHandler = m => this._onMessage(m);
      }

      /**
       * function that handles messages received from the service worker
       * @private
       * @param {MessageEvent} ev
       */
      _onWorkerMessage(ev) {
        const {
          data
        } = ev;
        const method_name = data[0];
        if (method_name === '_onMessage') {
          this._messageHandler(data[1]);
        } else if (method_name in this) {
          try {
            this[(/** @type {'_attachCallback'|'_onOpen'|'_onClose'|'_onError'} */
            method_name)].apply(this, ev.data.slice(1));
          } catch (e) {
            log.error(e);
          }
        } else if (method_name === 'log') {
          /** @type {Object.<string, number>} */
          const lmap = {
            debug: LOG_LEVELS.DEBUG,
            info: LOG_LEVELS.INFO,
            warn: LOG_LEVELS.WARN,
            error: LOG_LEVELS.ERROR,
            fatal: LOG_LEVELS.FATAL
          };
          const level = data[1];
          const msg = data[2];
          log.log(lmap[level], msg);
        } else {
          log.error(`Found unhandled service worker message: ${data}`);
        }
      }
    }

    /**
     * @typedef {import("./sasl.js").default} SASLMechanism
     * @typedef {import("./request.js").default} Request
     *
     * @typedef {Object} ConnectionOptions
     * @property {Cookies} [cookies]
     *  Allows you to pass in cookies that will be included in HTTP requests.
     *  Relevant to both the BOSH and Websocket transports.
     *
     *  The passed in value must be a map of cookie names and string values.
     *
     *  > { "myCookie": {
     *  >     "value": "1234",
     *  >     "domain": ".example.org",
     *  >     "path": "/",
     *  >     "expires": expirationDate
     *  >     }
     *  > }
     *
     *  Note that cookies can't be set in this way for domains other than the one
     *  that's hosting Strophe (i.e. cross-domain).
     *  Those cookies need to be set under those domains, for example they can be
     *  set server-side by making a XHR call to that domain to ask it to set any
     *  necessary cookies.
     * @property {SASLMechanism[]} [mechanisms]
     *  Allows you to specify the SASL authentication mechanisms that this
     *  instance of Connection (and therefore your XMPP client) will support.
     *
     *  The value must be an array of objects with {@link SASLMechanism}
     *  prototypes.
     *
     *  If nothing is specified, then the following mechanisms (and their
     *  priorities) are registered:
     *
     *      Mechanism       Priority
     *      ------------------------
     *      SCRAM-SHA-512   72
     *      SCRAM-SHA-384   71
     *      SCRAM-SHA-256   70
     *      SCRAM-SHA-1     60
     *      PLAIN           50
     *      OAUTHBEARER     40
     *      X-OAUTH2        30
     *      ANONYMOUS       20
     *      EXTERNAL        10
     *
     * @property {boolean} [explicitResourceBinding]
     *  If `explicitResourceBinding` is set to `true`, then the XMPP client
     *  needs to explicitly call {@link Connection.bind} once the XMPP
     *  server has advertised the `urn:ietf:propertys:xml:ns:xmpp-bind` feature.
     *
     *  Making this step explicit allows client authors to first finish other
     *  stream related tasks, such as setting up an XEP-0198 Stream Management
     *  session, before binding the JID resource for this session.
     *
     * @property {'ws'|'wss'} [protocol]
     *  _Note: This option is only relevant to Websocket connections, and not BOSH_
     *
     *  If you want to connect to the current host with a WebSocket connection you
     *  can tell Strophe to use WebSockets through the "protocol" option.
     *  Valid values are `ws` for WebSocket and `wss` for Secure WebSocket.
     *  So to connect to "wss://CURRENT_HOSTNAME/xmpp-websocket" you would call
     *
     *      const conn = new Strophe.Connection(
     *          "/xmpp-websocket/",
     *          {protocol: "wss"}
     *      );
     *
     *  Note that relative URLs _NOT_ starting with a "/" will also include the path
     *  of the current site.
     *
     *  Also because downgrading security is not permitted by browsers, when using
     *  relative URLs both BOSH and WebSocket connections will use their secure
     *  variants if the current connection to the site is also secure (https).
     *
     * @property {string} [worker]
     *  _Note: This option is only relevant to Websocket connections, and not BOSH_
     *
     *  Set this option to URL from where the shared worker script should be loaded.
     *
     *  To run the websocket connection inside a shared worker.
     *  This allows you to share a single websocket-based connection between
     *  multiple Connection instances, for example one per browser tab.
     *
     *  The script to use is the one in `src/shared-connection-worker.js`.
     *
     * @property {boolean} [sync]
     *  Used to control whether BOSH HTTP requests will be made synchronously or not.
     *  The default behaviour is asynchronous. If you want to make requests
     *  synchronous, make "sync" evaluate to true.
     *
     *  > const conn = new Strophe.Connection("/http-bind/", {sync: true});
     *
     *  You can also toggle this on an already established connection.
     *
     *  > conn.options.sync = true;
     *
     * @property {string[]} [customHeaders]
     *  Used to provide custom HTTP headers to be included in the BOSH HTTP requests.
     *
     * @property {boolean} [keepalive]
     *  Used to instruct Strophe to maintain the current BOSH session across
     *  interruptions such as webpage reloads.
     *
     *  It will do this by caching the sessions tokens in sessionStorage, and when
     *  "restore" is called it will check whether there are cached tokens with
     *  which it can resume an existing session.
     *
     * @property {boolean} [withCredentials]
     *  Used to indicate wether cookies should be included in HTTP requests (by default
     *  they're not).
     *  Set this value to `true` if you are connecting to a BOSH service
     *  and for some reason need to send cookies to it.
     *  In order for this to work cross-domain, the server must also enable
     *  credentials by setting the `Access-Control-Allow-Credentials` response header
     *  to "true". For most usecases however this setting should be false (which
     *  is the default).
     *  Additionally, when using `Access-Control-Allow-Credentials`, the
     *  `Access-Control-Allow-Origin` header can't be set to the wildcard "*", but
     *  instead must be restricted to actual domains.
     *
     * @property {string} [contentType]
     *  Used to change the default Content-Type, which is "text/xml; charset=utf-8".
     *  Can be useful to reduce the amount of CORS preflight requests that are sent
     *  to the server.
     */

    /**
     * _Private_ variable Used to store plugin names that need
     * initialization during Connection construction.
     * @type {Object.<string, Object>}
     */
    const connectionPlugins = {};

    /**
     * **XMPP Connection manager**
     *
     * This class is the main part of Strophe.  It manages a BOSH or websocket
     * connection to an XMPP server and dispatches events to the user callbacks
     * as data arrives.
     *
     * It supports various authentication mechanisms (e.g. SASL PLAIN, SASL SCRAM),
     * and more can be added via
     * {@link Connection#registerSASLMechanisms|registerSASLMechanisms()}.
     *
     * After creating a Connection object, the user will typically
     * call {@link Connection#connect|connect()} with a user supplied callback
     * to handle connection level events like authentication failure,
     * disconnection, or connection complete.
     *
     * The user will also have several event handlers defined by using
     * {@link Connection#addHandler|addHandler()} and
     * {@link Connection#addTimedHandler|addTimedHandler()}.
     * These will allow the user code to respond to interesting stanzas or do
     * something periodically with the connection. These handlers will be active
     * once authentication is finished.
     *
     * To send data to the connection, use {@link Connection#send|send()}.
     *
     * @memberof Strophe
     */
    class Connection {
      /**
       * @typedef {Object.<string, string>} Cookie
       * @typedef {Cookie|Object.<string, Cookie>} Cookies
       */

      /**
       * Create and initialize a {@link Connection} object.
       *
       * The transport-protocol for this connection will be chosen automatically
       * based on the given service parameter. URLs starting with "ws://" or
       * "wss://" will use WebSockets, URLs starting with "http://", "https://"
       * or without a protocol will use [BOSH](https://xmpp.org/extensions/xep-0124.html).
       *
       * To make Strophe connect to the current host you can leave out the protocol
       * and host part and just pass the path:
       *
       *  const conn = new Strophe.Connection("/http-bind/");
       *
       * @param {string} service - The BOSH or WebSocket service URL.
       * @param {ConnectionOptions} options - A object containing configuration options
       */
      constructor(service, options = {}) {
        // The service URL
        this.service = service;
        // Configuration options
        this.options = options;
        this.setProtocol();

        /* The connected JID. */
        this.jid = '';
        /* the JIDs domain */
        this.domain = null;
        /* stream:features */
        this.features = null;

        // SASL
        /**
         * @typedef {Object.<string, any>} SASLData
         * @property {Object} [SASLData.keys]
         */

        /** @type {SASLData} */
        this._sasl_data = {};
        this.do_bind = false;
        this.do_session = false;

        /** @type {Object.<string, SASLMechanism>} */
        this.mechanisms = {};

        /** @type {TimedHandler[]} */
        this.timedHandlers = [];

        /** @type {Handler[]} */
        this.handlers = [];

        /** @type {TimedHandler[]} */
        this.removeTimeds = [];

        /** @type {Handler[]} */
        this.removeHandlers = [];

        /** @type {TimedHandler[]} */
        this.addTimeds = [];

        /** @type {Handler[]} */
        this.addHandlers = [];
        this.protocolErrorHandlers = {
          /** @type {Object.<number, Function>} */
          'HTTP': {},
          /** @type {Object.<number, Function>} */
          'websocket': {}
        };
        this._idleTimeout = null;
        this._disconnectTimeout = null;
        this.authenticated = false;
        this.connected = false;
        this.disconnecting = false;
        this.do_authentication = true;
        this.paused = false;
        this.restored = false;

        /** @type {(Element|'restart')[]} */
        this._data = [];
        this._uniqueId = 0;
        this._sasl_success_handler = null;
        this._sasl_failure_handler = null;
        this._sasl_challenge_handler = null;

        // Max retries before disconnecting
        this.maxRetries = 5;

        // Call onIdle callback every 1/10th of a second
        this._idleTimeout = setTimeout(() => this._onIdle(), 100);
        addCookies(this.options.cookies);
        this.registerSASLMechanisms(this.options.mechanisms);

        // A client must always respond to incoming IQ "set" and "get" stanzas.
        // See https://datatracker.ietf.org/doc/html/rfc6120#section-8.2.3
        //
        // This is a fallback handler which gets called when no other handler
        // was called for a received IQ "set" or "get".
        this.iqFallbackHandler = new Handler(
        /**
         * @param {Element} iq
         */
        iq => this.send($iq({
          type: 'error',
          id: iq.getAttribute('id')
        }).c('error', {
          'type': 'cancel'
        }).c('service-unavailable', {
          'xmlns': NS.STANZAS
        })), null, 'iq', ['get', 'set']);

        // initialize plugins
        for (const k in connectionPlugins) {
          if (Object.prototype.hasOwnProperty.call(connectionPlugins, k)) {
            const F = function () {};
            F.prototype = connectionPlugins[k];
            // @ts-ignore
            this[k] = new F();
            // @ts-ignore
            this[k].init(this);
          }
        }
      }

      /**
       * Extends the Connection object with the given plugin.
       * @param {string} name - The name of the extension.
       * @param {Object} ptype - The plugin's prototype.
       */
      static addConnectionPlugin(name, ptype) {
        connectionPlugins[name] = ptype;
      }

      /**
       * Select protocal based on this.options or this.service
       */
      setProtocol() {
        const proto = this.options.protocol || '';
        if (this.options.worker) {
          this._proto = new WorkerWebsocket(this);
        } else if (this.service.indexOf('ws:') === 0 || this.service.indexOf('wss:') === 0 || proto.indexOf('ws') === 0) {
          this._proto = new Websocket(this);
        } else {
          this._proto = new Bosh(this);
        }
      }

      /**
       * Reset the connection.
       *
       * This function should be called after a connection is disconnected
       * before that connection is reused.
       */
      reset() {
        this._proto._reset();

        // SASL
        this.do_session = false;
        this.do_bind = false;

        // handler lists
        this.timedHandlers = [];
        this.handlers = [];
        this.removeTimeds = [];
        this.removeHandlers = [];
        this.addTimeds = [];
        this.addHandlers = [];
        this.authenticated = false;
        this.connected = false;
        this.disconnecting = false;
        this.restored = false;
        this._data = [];
        /** @type {Request[]} */
        this._requests = [];
        this._uniqueId = 0;
      }

      /**
       * Pause the request manager.
       *
       * This will prevent Strophe from sending any more requests to the
       * server.  This is very useful for temporarily pausing
       * BOSH-Connections while a lot of send() calls are happening quickly.
       * This causes Strophe to send the data in a single request, saving
       * many request trips.
       */
      pause() {
        this.paused = true;
      }

      /**
       * Resume the request manager.
       *
       * This resumes after pause() has been called.
       */
      resume() {
        this.paused = false;
      }

      /**
       * Generate a unique ID for use in <iq/> elements.
       *
       * All <iq/> stanzas are required to have unique id attributes.  This
       * function makes creating these easy.  Each connection instance has
       * a counter which starts from zero, and the value of this counter
       * plus a colon followed by the suffix becomes the unique id. If no
       * suffix is supplied, the counter is used as the unique id.
       *
       * Suffixes are used to make debugging easier when reading the stream
       * data, and their use is recommended.  The counter resets to 0 for
       * every new connection for the same reason.  For connections to the
       * same server that authenticate the same way, all the ids should be
       * the same, which makes it easy to see changes.  This is useful for
       * automated testing as well.
       *
       * @param {string} suffix - A optional suffix to append to the id.
       * @returns {string} A unique string to be used for the id attribute.
       */
      // eslint-disable-next-line class-methods-use-this
      getUniqueId(suffix) {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
          return v.toString(16);
        });
        if (typeof suffix === 'string' || typeof suffix === 'number') {
          return uuid + ':' + suffix;
        } else {
          return uuid + '';
        }
      }

      /**
       * Register a handler function for when a protocol (websocker or HTTP)
       * error occurs.
       *
       * NOTE: Currently only HTTP errors for BOSH requests are handled.
       * Patches that handle websocket errors would be very welcome.
       *
       * @example
       *  function onError(err_code){
       *    //do stuff
       *  }
       *
       *  const conn = Strophe.connect('http://example.com/http-bind');
       *  conn.addProtocolErrorHandler('HTTP', 500, onError);
       *  // Triggers HTTP 500 error and onError handler will be called
       *  conn.connect('user_jid@incorrect_jabber_host', 'secret', onConnect);
       *
       * @param {'HTTP'|'websocket'} protocol - 'HTTP' or 'websocket'
       * @param {number} status_code - Error status code (e.g 500, 400 or 404)
       * @param {Function} callback - Function that will fire on Http error
       */
      addProtocolErrorHandler(protocol, status_code, callback) {
        this.protocolErrorHandlers[protocol][status_code] = callback;
      }

      /**
       * @typedef {Object} Password
       * @property {string} Password.name
       * @property {string} Password.ck
       * @property {string} Password.sk
       * @property {number} Password.iter
       * @property {string} Password.salt
       */

      /**
       * Starts the connection process.
       *
       * As the connection process proceeds, the user supplied callback will
       * be triggered multiple times with status updates.  The callback
       * should take two arguments - the status code and the error condition.
       *
       * The status code will be one of the values in the Strophe.Status
       * constants.  The error condition will be one of the conditions
       * defined in RFC 3920 or the condition 'strophe-parsererror'.
       *
       * The Parameters _wait_, _hold_ and _route_ are optional and only relevant
       * for BOSH connections. Please see XEP 124 for a more detailed explanation
       * of the optional parameters.
       *
       * @param {string} jid - The user's JID.  This may be a bare JID,
       *     or a full JID.  If a node is not supplied, SASL OAUTHBEARER or
       *     SASL ANONYMOUS authentication will be attempted (OAUTHBEARER will
       *     process the provided password value as an access token).
       *   (String or Object) pass - The user's password, or an object containing
       *     the users SCRAM client and server keys, in a fashion described as follows:
       *
       *     { name: String, representing the hash used (eg. SHA-1),
       *       salt: String, base64 encoded salt used to derive the client key,
       *       iter: Int,    the iteration count used to derive the client key,
       *       ck:   String, the base64 encoding of the SCRAM client key
       *       sk:   String, the base64 encoding of the SCRAM server key
       *     }
       * @param {string|Password} pass - The user password
       * @param {Function} callback - The connect callback function.
       * @param {number} [wait] - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       * @param {number} [hold] - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {string} [route] - The optional route value.
       * @param {string} [authcid] - The optional alternative authentication identity
       *     (username) if intending to impersonate another user.
       *     When using the SASL-EXTERNAL authentication mechanism, for example
       *     with client certificates, then the authcid value is used to
       *     determine whether an authorization JID (authzid) should be sent to
       *     the server. The authzid should NOT be sent to the server if the
       *     authzid and authcid are the same. So to prevent it from being sent
       *     (for example when the JID is already contained in the client
       *     certificate), set authcid to that same JID. See XEP-178 for more
       *     details.
       *  @param {number} [disconnection_timeout=3000] - The optional disconnection timeout
       *     in milliseconds before _doDisconnect will be called.
       */
      connect(jid, pass, callback, wait, hold, route, authcid, disconnection_timeout = 3000) {
        this.jid = jid;
        /** Authorization identity */
        this.authzid = getBareJidFromJid(this.jid);
        /** Authentication identity (User name) */
        this.authcid = authcid || getNodeFromJid(this.jid);
        /** Authentication identity (User password) */
        this.pass = pass;

        /**
         * The SASL SCRAM client and server keys. This variable will be populated with a non-null
         * object of the above described form after a successful SCRAM connection
         */
        this.scram_keys = null;
        this.connect_callback = callback;
        this.disconnecting = false;
        this.connected = false;
        this.authenticated = false;
        this.restored = false;
        this.disconnection_timeout = disconnection_timeout;

        // parse jid for domain
        this.domain = getDomainFromJid(this.jid);
        this._changeConnectStatus(Status.CONNECTING, null);
        this._proto._connect(wait, hold, route);
      }

      /**
       * Attach to an already created and authenticated BOSH session.
       *
       * This function is provided to allow Strophe to attach to BOSH
       * sessions which have been created externally, perhaps by a Web
       * application.  This is often used to support auto-login type features
       * without putting user credentials into the page.
       *
       * @param {string|Function} jid - The full JID that is bound by the session.
       * @param {string} [sid] - The SID of the BOSH session.
       * @param {number} [rid] - The current RID of the BOSH session.  This RID
       *     will be used by the next request.
       * @param {Function} [callback] - The connect callback function.
       * @param {number} [wait] - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       *     Other settings will require tweaks to the Strophe.TIMEOUT value.
       * @param {number} [hold] - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {number} [wind] - The optional HTTBIND window value.  This is the
       *     allowed range of request ids that are valid.  The default is 5.
       */
      attach(jid, sid, rid, callback, wait, hold, wind) {
        if (this._proto instanceof Bosh && typeof jid === 'string') {
          return this._proto._attach(jid, sid, rid, callback, wait, hold, wind);
        } else if (this._proto instanceof WorkerWebsocket && typeof jid === 'function') {
          const callback = jid;
          return this._proto._attach(callback);
        } else {
          throw new SessionError('The "attach" method is not available for your connection protocol');
        }
      }

      /**
       * Attempt to restore a cached BOSH session.
       *
       * This function is only useful in conjunction with providing the
       * "keepalive":true option when instantiating a new {@link Connection}.
       *
       * When "keepalive" is set to true, Strophe will cache the BOSH tokens
       * RID (Request ID) and SID (Session ID) and then when this function is
       * called, it will attempt to restore the session from those cached
       * tokens.
       *
       * This function must therefore be called instead of connect or attach.
       *
       * For an example on how to use it, please see examples/restore.js
       *
       * @param {string} jid - The user's JID.  This may be a bare JID or a full JID.
       * @param {Function} callback - The connect callback function.
       * @param {number} [wait] - The optional HTTPBIND wait value.  This is the
       *     time the server will wait before returning an empty result for
       *     a request.  The default setting of 60 seconds is recommended.
       * @param {number} [hold] - The optional HTTPBIND hold value.  This is the
       *     number of connections the server will hold at one time.  This
       *     should almost always be set to 1 (the default).
       * @param {number} [wind] - The optional HTTBIND window value.  This is the
       *     allowed range of request ids that are valid.  The default is 5.
       */
      restore(jid, callback, wait, hold, wind) {
        if (!(this._proto instanceof Bosh) || !this._sessionCachingSupported()) {
          throw new SessionError('The "restore" method can only be used with a BOSH connection.');
        }
        if (this._sessionCachingSupported()) {
          this._proto._restore(jid, callback, wait, hold, wind);
        }
      }

      /**
       * Checks whether sessionStorage and JSON are supported and whether we're
       * using BOSH.
       */
      _sessionCachingSupported() {
        if (this._proto instanceof Bosh) {
          if (!JSON) {
            return false;
          }
          try {
            sessionStorage.setItem('_strophe_', '_strophe_');
            sessionStorage.removeItem('_strophe_');
          } catch (e) {
            // eslint-disable-line no-unused-vars
            return false;
          }
          return true;
        }
        return false;
      }

      /**
       * User overrideable function that receives XML data coming into the
       * connection.
       *
       * The default function does nothing.  User code can override this with
       * > Connection.xmlInput = function (elem) {
       * >   (user code)
       * > };
       *
       * Due to limitations of current Browsers' XML-Parsers the opening and closing
       * <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
       *
       * BOSH-Connections will have all stanzas wrapped in a <body> tag. See
       * <Bosh.strip> if you want to strip this tag.
       *
       * @param {Node|MessageEvent} elem - The XML data received by the connection.
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      xmlInput(elem) {
        return;
      }

      /**
       * User overrideable function that receives XML data sent to the
       * connection.
       *
       * The default function does nothing.  User code can override this with
       * > Connection.xmlOutput = function (elem) {
       * >   (user code)
       * > };
       *
       * Due to limitations of current Browsers' XML-Parsers the opening and closing
       * <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
       *
       * BOSH-Connections will have all stanzas wrapped in a <body> tag. See
       * <Bosh.strip> if you want to strip this tag.
       *
       * @param {Element} elem - The XMLdata sent by the connection.
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      xmlOutput(elem) {
        return;
      }

      /**
       * User overrideable function that receives raw data coming into the
       * connection.
       *
       * The default function does nothing.  User code can override this with
       * > Connection.rawInput = function (data) {
       * >   (user code)
       * > };
       *
       * @param {string} data - The data received by the connection.
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      rawInput(data) {
        return;
      }

      /**
       * User overrideable function that receives raw data sent to the
       * connection.
       *
       * The default function does nothing.  User code can override this with
       * > Connection.rawOutput = function (data) {
       * >   (user code)
       * > };
       *
       * @param {string} data - The data sent by the connection.
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      rawOutput(data) {
        return;
      }

      /**
       * User overrideable function that receives the new valid rid.
       *
       * The default function does nothing. User code can override this with
       * > Connection.nextValidRid = function (rid) {
       * >    (user code)
       * > };
       *
       * @param {number} rid - The next valid rid
       */
      // eslint-disable-next-line no-unused-vars, class-methods-use-this
      nextValidRid(rid) {
        return;
      }

      /**
       * Send a stanza.
       *
       * This function is called to push data onto the send queue to
       * go out over the wire.  Whenever a request is sent to the BOSH
       * server, all pending data is sent and the queue is flushed.
       *
       * @param {Element|Builder|Element[]|Builder[]} stanza - The stanza to send
       */
      send(stanza) {
        if (stanza === null) return;
        if (Array.isArray(stanza)) {
          stanza.forEach(s => this._queueData(s instanceof Builder ? s.tree() : s));
        } else {
          const el = stanza instanceof Builder ? stanza.tree() : stanza;
          this._queueData(el);
        }
        this._proto._send();
      }

      /**
       * Immediately send any pending outgoing data.
       *
       * Normally send() queues outgoing data until the next idle period
       * (100ms), which optimizes network use in the common cases when
       * several send()s are called in succession. flush() can be used to
       * immediately send all pending data.
       */
      flush() {
        // cancel the pending idle period and run the idle function
        // immediately
        clearTimeout(this._idleTimeout);
        this._onIdle();
      }

      /**
       * Helper function to send presence stanzas. The main benefit is for
       * sending presence stanzas for which you expect a responding presence
       * stanza with the same id (for example when leaving a chat room).
       *
       * @param {Element} stanza - The stanza to send.
       * @param {Function} [callback] - The callback function for a successful request.
       * @param {Function} [errback] - The callback function for a failed or timed
       *    out request.  On timeout, the stanza will be null.
       * @param {number} [timeout] - The time specified in milliseconds for a
       *    timeout to occur.
       * @return {string} The id used to send the presence.
       */
      sendPresence(stanza, callback, errback, timeout) {
        /** @type {TimedHandler} */
        let timeoutHandler = null;
        const el = stanza instanceof Builder ? stanza.tree() : stanza;
        let id = el.getAttribute('id');
        if (!id) {
          // inject id if not found
          id = this.getUniqueId('sendPresence');
          el.setAttribute('id', id);
        }
        if (typeof callback === 'function' || typeof errback === 'function') {
          const handler = this.addHandler(/** @param {Element} stanza */
          stanza => {
            // remove timeout handler if there is one
            if (timeoutHandler) this.deleteTimedHandler(timeoutHandler);
            if (stanza.getAttribute('type') === 'error') {
              errback === null || errback === void 0 ? void 0 : errback(stanza);
            } else if (callback) {
              callback(stanza);
            }
          }, null, 'presence', null, id);

          // if timeout specified, set up a timeout handler.
          if (timeout) {
            timeoutHandler = this.addTimedHandler(timeout, () => {
              // get rid of normal handler
              this.deleteHandler(handler);
              // call errback on timeout with null stanza
              errback === null || errback === void 0 ? void 0 : errback(null);
              return false;
            });
          }
        }
        this.send(el);
        return id;
      }

      /**
       * Helper function to send IQ stanzas.
       *
       * @param {Element|Builder} stanza - The stanza to send.
       * @param {Function} [callback] - The callback function for a successful request.
       * @param {Function} [errback] - The callback function for a failed or timed
       *     out request.  On timeout, the stanza will be null.
       * @param {number} [timeout] - The time specified in milliseconds for a
       *     timeout to occur.
       * @return {string} The id used to send the IQ.
       */
      sendIQ(stanza, callback, errback, timeout) {
        /** @type {TimedHandler} */
        let timeoutHandler = null;
        const el = stanza instanceof Builder ? stanza.tree() : stanza;
        let id = el.getAttribute('id');
        if (!id) {
          // inject id if not found
          id = this.getUniqueId('sendIQ');
          el.setAttribute('id', id);
        }
        if (typeof callback === 'function' || typeof errback === 'function') {
          const handler = this.addHandler(/** @param {Element} stanza */
          stanza => {
            // remove timeout handler if there is one
            if (timeoutHandler) this.deleteTimedHandler(timeoutHandler);
            const iqtype = stanza.getAttribute('type');
            if (iqtype === 'result') {
              callback === null || callback === void 0 ? void 0 : callback(stanza);
            } else if (iqtype === 'error') {
              errback === null || errback === void 0 ? void 0 : errback(stanza);
            } else {
              const error = new Error(`Got bad IQ type of ${iqtype}`);
              error.name = 'StropheError';
              throw error;
            }
          }, null, 'iq', ['error', 'result'], id);

          // if timeout specified, set up a timeout handler.
          if (timeout) {
            timeoutHandler = this.addTimedHandler(timeout, () => {
              // get rid of normal handler
              this.deleteHandler(handler);
              // call errback on timeout with null stanza
              errback === null || errback === void 0 ? void 0 : errback(null);
              return false;
            });
          }
        }
        this.send(el);
        return id;
      }

      /**
       * Queue outgoing data for later sending.  Also ensures that the data
       * is a DOMElement.
       * @private
       * @param {Element} element
       */
      _queueData(element) {
        if (element === null || !element.tagName || !element.childNodes) {
          const error = new Error('Cannot queue non-DOMElement.');
          error.name = 'StropheError';
          throw error;
        }
        this._data.push(element);
      }

      /**
       * Send an xmpp:restart stanza.
       * @private
       */
      _sendRestart() {
        this._data.push('restart');
        this._proto._sendRestart();
        this._idleTimeout = setTimeout(() => this._onIdle(), 100);
      }

      /**
       * Add a timed handler to the connection.
       *
       * This function adds a timed handler.  The provided handler will
       * be called every period milliseconds until it returns false,
       * the connection is terminated, or the handler is removed.  Handlers
       * that wish to continue being invoked should return true.
       *
       * Because of method binding it is necessary to save the result of
       * this function if you wish to remove a handler with
       * deleteTimedHandler().
       *
       * Note that user handlers are not active until authentication is
       * successful.
       *
       * @param {number} period - The period of the handler.
       * @param {Function} handler - The callback function.
       * @return {TimedHandler} A reference to the handler that can be used to remove it.
       */
      addTimedHandler(period, handler) {
        const thand = new TimedHandler(period, handler);
        this.addTimeds.push(thand);
        return thand;
      }

      /**
       * Delete a timed handler for a connection.
       *
       * This function removes a timed handler from the connection.  The
       * handRef parameter is *not* the function passed to addTimedHandler(),
       * but is the reference returned from addTimedHandler().
       * @param {TimedHandler} handRef - The handler reference.
       */
      deleteTimedHandler(handRef) {
        // this must be done in the Idle loop so that we don't change
        // the handlers during iteration
        this.removeTimeds.push(handRef);
      }

      /**
       * @typedef {Object} HandlerOptions
       * @property {boolean} [HandlerOptions.matchBareFromJid]
       * @property {boolean} [HandlerOptions.ignoreNamespaceFragment]
       */

      /**
       * Add a stanza handler for the connection.
       *
       * This function adds a stanza handler to the connection.  The
       * handler callback will be called for any stanza that matches
       * the parameters.  Note that if multiple parameters are supplied,
       * they must all match for the handler to be invoked.
       *
       * The handler will receive the stanza that triggered it as its argument.
       * *The handler should return true if it is to be invoked again;
       * returning false will remove the handler after it returns.*
       *
       * As a convenience, the ns parameters applies to the top level element
       * and also any of its immediate children.  This is primarily to make
       * matching /iq/query elements easy.
       *
       * ### Options
       *
       * With the options argument, you can specify boolean flags that affect how
       * matches are being done.
       *
       * Currently two flags exist:
       *
       * * *matchBareFromJid*:
       *     When set to true, the from parameter and the
       *     from attribute on the stanza will be matched as bare JIDs instead
       *     of full JIDs. To use this, pass {matchBareFromJid: true} as the
       *     value of options. The default value for matchBareFromJid is false.
       *
       * * *ignoreNamespaceFragment*:
       *     When set to true, a fragment specified on the stanza's namespace
       *     URL will be ignored when it's matched with the one configured for
       *     the handler.
       *
       *     This means that if you register like this:
       *
       *     >   connection.addHandler(
       *     >       handler,
       *     >       'http://jabber.org/protocol/muc',
       *     >       null, null, null, null,
       *     >       {'ignoreNamespaceFragment': true}
       *     >   );
       *
       *     Then a stanza with XML namespace of
       *     'http://jabber.org/protocol/muc#user' will also be matched. If
       *     'ignoreNamespaceFragment' is false, then only stanzas with
       *     'http://jabber.org/protocol/muc' will be matched.
       *
       * ### Deleting the handler
       *
       * The return value should be saved if you wish to remove the handler
       * with `deleteHandler()`.
       *
       * @param {Function} handler - The user callback.
       * @param {string} ns - The namespace to match.
       * @param {string} name - The stanza name to match.
       * @param {string|string[]} type - The stanza type (or types if an array) to match.
       * @param {string} [id] - The stanza id attribute to match.
       * @param {string} [from] - The stanza from attribute to match.
       * @param {HandlerOptions} [options] - The handler options
       * @return {Handler} A reference to the handler that can be used to remove it.
       */
      addHandler(handler, ns, name, type, id, from, options) {
        const hand = new Handler(handler, ns, name, type, id, from, options);
        this.addHandlers.push(hand);
        return hand;
      }

      /**
       * Delete a stanza handler for a connection.
       *
       * This function removes a stanza handler from the connection.  The
       * handRef parameter is *not* the function passed to addHandler(),
       * but is the reference returned from addHandler().
       *
       * @param {Handler} handRef - The handler reference.
       */
      deleteHandler(handRef) {
        // this must be done in the Idle loop so that we don't change
        // the handlers during iteration
        this.removeHandlers.push(handRef);
        // If a handler is being deleted while it is being added,
        // prevent it from getting added
        const i = this.addHandlers.indexOf(handRef);
        if (i >= 0) {
          this.addHandlers.splice(i, 1);
        }
      }

      /**
       * Register the SASL mechanisms which will be supported by this instance of
       * Connection (i.e. which this XMPP client will support).
       * @param {SASLMechanism[]} mechanisms - Array of objects with SASLMechanism prototypes
       */
      registerSASLMechanisms(mechanisms) {
        this.mechanisms = {};
        (mechanisms || [SASLAnonymous, SASLExternal, SASLOAuthBearer, SASLXOAuth2, SASLPlain, SASLSHA1, SASLSHA256, SASLSHA384, SASLSHA512]).forEach(m => this.registerSASLMechanism(m));
      }

      /**
       * Register a single SASL mechanism, to be supported by this client.
       * @param {any} Mechanism - Object with a Strophe.SASLMechanism prototype
       */
      registerSASLMechanism(Mechanism) {
        const mechanism = new Mechanism();
        this.mechanisms[mechanism.mechname] = mechanism;
      }

      /**
       * Start the graceful disconnection process.
       *
       * This function starts the disconnection process.  This process starts
       * by sending unavailable presence and sending BOSH body of type
       * terminate.  A timeout handler makes sure that disconnection happens
       * even if the BOSH server does not respond.
       * If the Connection object isn't connected, at least tries to abort all pending requests
       * so the connection object won't generate successful requests (which were already opened).
       *
       * The user supplied connection callback will be notified of the
       * progress as this process happens.
       *
       * @param {string} [reason] - The reason the disconnect is occuring.
       */
      disconnect(reason) {
        this._changeConnectStatus(Status.DISCONNECTING, reason);
        if (reason) {
          log.info('Disconnect was called because: ' + reason);
        } else {
          log.debug('Disconnect was called');
        }
        if (this.connected) {
          let pres = null;
          this.disconnecting = true;
          if (this.authenticated) {
            pres = $pres({
              'xmlns': NS.CLIENT,
              'type': 'unavailable'
            });
          }
          // setup timeout handler
          this._disconnectTimeout = this._addSysTimedHandler(this.disconnection_timeout, this._onDisconnectTimeout.bind(this));
          this._proto._disconnect(pres);
        } else {
          log.debug('Disconnect was called before Strophe connected to the server');
          this._proto._abortAllRequests();
          this._doDisconnect();
        }
      }

      /**
       * _Private_ helper function that makes sure plugins and the user's
       * callback are notified of connection status changes.
       * @param {number} status - the new connection status, one of the values
       *     in Strophe.Status
       * @param {string|null} [condition] - the error condition
       * @param {Element} [elem] - The triggering stanza.
       */
      _changeConnectStatus(status, condition, elem) {
        // notify all plugins listening for status changes
        for (const k in connectionPlugins) {
          if (Object.prototype.hasOwnProperty.call(connectionPlugins, k)) {
            // @ts-ignore
            const plugin = this[k];
            if (plugin.statusChanged) {
              try {
                plugin.statusChanged(status, condition);
              } catch (err) {
                log.error(`${k} plugin caused an exception changing status: ${err}`);
              }
            }
          }
        }
        // notify the user's callback
        if (this.connect_callback) {
          try {
            this.connect_callback(status, condition, elem);
          } catch (e) {
            handleError(e);
            log.error(`User connection callback caused an exception: ${e}`);
          }
        }
      }

      /**
       * _Private_ function to disconnect.
       *
       * This is the last piece of the disconnection logic.  This resets the
       * connection and alerts the user's connection callback.
       * @param {string|null} [condition] - the error condition
       */
      _doDisconnect(condition) {
        if (typeof this._idleTimeout === 'number') {
          clearTimeout(this._idleTimeout);
        }

        // Cancel Disconnect Timeout
        if (this._disconnectTimeout !== null) {
          this.deleteTimedHandler(this._disconnectTimeout);
          this._disconnectTimeout = null;
        }
        log.debug('_doDisconnect was called');
        this._proto._doDisconnect();
        this.authenticated = false;
        this.disconnecting = false;
        this.restored = false;

        // delete handlers
        this.handlers = [];
        this.timedHandlers = [];
        this.removeTimeds = [];
        this.removeHandlers = [];
        this.addTimeds = [];
        this.addHandlers = [];

        // tell the parent we disconnected
        this._changeConnectStatus(Status.DISCONNECTED, condition);
        this.connected = false;
      }

      /**
       * _Private_ handler to processes incoming data from the the connection.
       *
       * Except for _connect_cb handling the initial connection request,
       * this function handles the incoming data for all requests.  This
       * function also fires stanza handlers that match each incoming
       * stanza.
       * @param {Element | Request} req - The request that has data ready.
       * @param {string} [raw] - The stanza as raw string.
       */
      _dataRecv(req, raw) {
        const elem = /** @type {Element} */
        '_reqToData' in this._proto ? this._proto._reqToData(/** @type {Request} */req) : req;
        if (elem === null) {
          return;
        }
        if (this.xmlInput !== Connection.prototype.xmlInput) {
          if (elem.nodeName === this._proto.strip && elem.childNodes.length) {
            this.xmlInput(elem.childNodes[0]);
          } else {
            this.xmlInput(elem);
          }
        }
        if (this.rawInput !== Connection.prototype.rawInput) {
          if (raw) {
            this.rawInput(raw);
          } else {
            this.rawInput(Builder.serialize(elem));
          }
        }

        // remove handlers scheduled for deletion
        while (this.removeHandlers.length > 0) {
          const hand = this.removeHandlers.pop();
          const i = this.handlers.indexOf(hand);
          if (i >= 0) {
            this.handlers.splice(i, 1);
          }
        }

        // add handlers scheduled for addition
        while (this.addHandlers.length > 0) {
          this.handlers.push(this.addHandlers.pop());
        }

        // handle graceful disconnect
        if (this.disconnecting && this._proto._emptyQueue()) {
          this._doDisconnect();
          return;
        }
        const type = elem.getAttribute('type');
        if (type !== null && type === 'terminate') {
          // Don't process stanzas that come in after disconnect
          if (this.disconnecting) {
            return;
          }
          // an error occurred
          let cond = elem.getAttribute('condition');
          const conflict = elem.getElementsByTagName('conflict');
          if (cond !== null) {
            if (cond === 'remote-stream-error' && conflict.length > 0) {
              cond = 'conflict';
            }
            this._changeConnectStatus(Status.CONNFAIL, cond);
          } else {
            this._changeConnectStatus(Status.CONNFAIL, ErrorCondition.UNKNOWN_REASON);
          }
          this._doDisconnect(cond);
          return;
        }

        // send each incoming stanza through the handler chain
        forEachChild(elem, null, /** @param {Element} child */
        child => {
          const matches = [];
          this.handlers = this.handlers.reduce((handlers, handler) => {
            try {
              if (handler.isMatch(child) && (this.authenticated || !handler.user)) {
                if (handler.run(child)) {
                  handlers.push(handler);
                }
                matches.push(handler);
              } else {
                handlers.push(handler);
              }
            } catch (e) {
              // if the handler throws an exception, we consider it as false
              log.warn('Removing Strophe handlers due to uncaught exception: ' + e.message);
            }
            return handlers;
          }, []);

          // If no handler was fired for an incoming IQ with type="set",
          // then we return an IQ error stanza with service-unavailable.
          if (!matches.length && this.iqFallbackHandler.isMatch(child)) {
            this.iqFallbackHandler.run(child);
          }
        });
      }

      /**
       * @callback connectionCallback
       * @param {Connection} connection
       */

      /**
       * _Private_ handler for initial connection request.
       *
       * This handler is used to process the initial connection request
       * response from the BOSH server. It is used to set up authentication
       * handlers and start the authentication process.
       *
       * SASL authentication will be attempted if available, otherwise
       * the code will fall back to legacy authentication.
       *
       * @param {Element | Request} req - The current request.
       * @param {connectionCallback} _callback - low level (xmpp) connect callback function.
       *     Useful for plugins with their own xmpp connect callback (when they
       *     want to do something special).
       * @param {string} [raw] - The stanza as raw string.
       */
      _connect_cb(req, _callback, raw) {
        log.debug('_connect_cb was called');
        this.connected = true;
        let bodyWrap;
        try {
          bodyWrap = /** @type {Element} */
          '_reqToData' in this._proto ? this._proto._reqToData(/** @type {Request} */req) : req;
        } catch (e) {
          if (e.name !== ErrorCondition.BAD_FORMAT) {
            throw e;
          }
          this._changeConnectStatus(Status.CONNFAIL, ErrorCondition.BAD_FORMAT);
          this._doDisconnect(ErrorCondition.BAD_FORMAT);
        }
        if (!bodyWrap) {
          return;
        }
        if (this.xmlInput !== Connection.prototype.xmlInput) {
          if (bodyWrap.nodeName === this._proto.strip && bodyWrap.childNodes.length) {
            this.xmlInput(bodyWrap.childNodes[0]);
          } else {
            this.xmlInput(bodyWrap);
          }
        }
        if (this.rawInput !== Connection.prototype.rawInput) {
          if (raw) {
            this.rawInput(raw);
          } else {
            this.rawInput(Builder.serialize(bodyWrap));
          }
        }
        const conncheck = this._proto._connect_cb(bodyWrap);
        if (conncheck === Status.CONNFAIL) {
          return;
        }

        // Check for the stream:features tag
        let hasFeatures;
        if (bodyWrap.getElementsByTagNameNS) {
          hasFeatures = bodyWrap.getElementsByTagNameNS(NS.STREAM, 'features').length > 0;
        } else {
          hasFeatures = bodyWrap.getElementsByTagName('stream:features').length > 0 || bodyWrap.getElementsByTagName('features').length > 0;
        }
        if (!hasFeatures) {
          this._proto._no_auth_received(_callback);
          return;
        }
        const matched = Array.from(bodyWrap.getElementsByTagName('mechanism')).map(m => this.mechanisms[m.textContent]).filter(m => m);
        if (matched.length === 0) {
          if (bodyWrap.getElementsByTagName('auth').length === 0) {
            // There are no matching SASL mechanisms and also no legacy
            // auth available.
            this._proto._no_auth_received(_callback);
            return;
          }
        }
        if (this.do_authentication !== false) {
          this.authenticate(matched);
        }
      }

      /**
       * Sorts an array of objects with prototype SASLMechanism according to
       * their priorities.
       * @param {SASLMechanism[]} mechanisms - Array of SASL mechanisms.
       */
      // eslint-disable-next-line  class-methods-use-this
      sortMechanismsByPriority(mechanisms) {
        // Sorting mechanisms according to priority.
        for (let i = 0; i < mechanisms.length - 1; ++i) {
          let higher = i;
          for (let j = i + 1; j < mechanisms.length; ++j) {
            if (mechanisms[j].priority > mechanisms[higher].priority) {
              higher = j;
            }
          }
          if (higher !== i) {
            const swap = mechanisms[i];
            mechanisms[i] = mechanisms[higher];
            mechanisms[higher] = swap;
          }
        }
        return mechanisms;
      }

      /**
       * Set up authentication
       *
       * Continues the initial connection request by setting up authentication
       * handlers and starting the authentication process.
       *
       * SASL authentication will be attempted if available, otherwise
       * the code will fall back to legacy authentication.
       *
       * @param {SASLMechanism[]} matched - Array of SASL mechanisms supported.
       */
      authenticate(matched) {
        if (!this._attemptSASLAuth(matched)) {
          this._attemptLegacyAuth();
        }
      }

      /**
       * Iterate through an array of SASL mechanisms and attempt authentication
       * with the highest priority (enabled) mechanism.
       *
       * @private
       * @param {SASLMechanism[]} mechanisms - Array of SASL mechanisms.
       * @return {Boolean} mechanism_found - true or false, depending on whether a
       *  valid SASL mechanism was found with which authentication could be started.
       */
      _attemptSASLAuth(mechanisms) {
        mechanisms = this.sortMechanismsByPriority(mechanisms || []);
        let mechanism_found = false;
        for (let i = 0; i < mechanisms.length; ++i) {
          if (!mechanisms[i].test(this)) {
            continue;
          }
          this._sasl_success_handler = this._addSysHandler(this._sasl_success_cb.bind(this), null, 'success', null, null);
          this._sasl_failure_handler = this._addSysHandler(this._sasl_failure_cb.bind(this), null, 'failure', null, null);
          this._sasl_challenge_handler = this._addSysHandler(this._sasl_challenge_cb.bind(this), null, 'challenge', null, null);
          this._sasl_mechanism = mechanisms[i];
          this._sasl_mechanism.onStart(this);
          const request_auth_exchange = $build('auth', {
            'xmlns': NS.SASL,
            'mechanism': this._sasl_mechanism.mechname
          });
          if (this._sasl_mechanism.isClientFirst) {
            const response = this._sasl_mechanism.clientChallenge(this);
            request_auth_exchange.t(btoa(/** @type {string} */response));
          }
          this.send(request_auth_exchange.tree());
          mechanism_found = true;
          break;
        }
        return mechanism_found;
      }

      /**
       * _Private_ handler for the SASL challenge
       * @private
       * @param {Element} elem
       */
      async _sasl_challenge_cb(elem) {
        const challenge = atob(getText(elem));
        const response = await this._sasl_mechanism.onChallenge(this, challenge);
        const stanza = $build('response', {
          'xmlns': NS.SASL
        });
        if (response) stanza.t(btoa(response));
        this.send(stanza.tree());
        return true;
      }

      /**
       * Attempt legacy (i.e. non-SASL) authentication.
       * @private
       */
      _attemptLegacyAuth() {
        if (getNodeFromJid(this.jid) === null) {
          // we don't have a node, which is required for non-anonymous
          // client connections
          this._changeConnectStatus(Status.CONNFAIL, ErrorCondition.MISSING_JID_NODE);
          this.disconnect(ErrorCondition.MISSING_JID_NODE);
        } else {
          // Fall back to legacy authentication
          this._changeConnectStatus(Status.AUTHENTICATING, null);
          this._addSysHandler(this._onLegacyAuthIQResult.bind(this), null, null, null, '_auth_1');
          this.send($iq({
            'type': 'get',
            'to': this.domain,
            'id': '_auth_1'
          }).c('query', {
            xmlns: NS.AUTH
          }).c('username', {}).t(getNodeFromJid(this.jid)).tree());
        }
      }

      /**
       * _Private_ handler for legacy authentication.
       *
       * This handler is called in response to the initial <iq type='get'/>
       * for legacy authentication.  It builds an authentication <iq/> and
       * sends it, creating a handler (calling back to _auth2_cb()) to
       * handle the result
       * @private
       * @return {false} `false` to remove the handler.
       */
      _onLegacyAuthIQResult() {
        const pass = typeof this.pass === 'string' ? this.pass : '';

        // build plaintext auth iq
        const iq = $iq({
          type: 'set',
          id: '_auth_2'
        }).c('query', {
          xmlns: NS.AUTH
        }).c('username', {}).t(getNodeFromJid(this.jid)).up().c('password').t(pass);
        if (!getResourceFromJid(this.jid)) {
          // since the user has not supplied a resource, we pick
          // a default one here.  unlike other auth methods, the server
          // cannot do this for us.
          this.jid = getBareJidFromJid(this.jid) + '/strophe';
        }
        iq.up().c('resource', {}).t(getResourceFromJid(this.jid));
        this._addSysHandler(this._auth2_cb.bind(this), null, null, null, '_auth_2');
        this.send(iq.tree());
        return false;
      }

      /**
       * _Private_ handler for succesful SASL authentication.
       * @private
       * @param {Element} elem - The matching stanza.
       * @return {false} `false` to remove the handler.
       */
      _sasl_success_cb(elem) {
        if (this._sasl_data['server-signature']) {
          let serverSignature;
          const success = atob(getText(elem));
          const attribMatch = /([a-z]+)=([^,]+)(,|$)/;
          const matches = success.match(attribMatch);
          if (matches[1] === 'v') {
            serverSignature = matches[2];
          }
          if (serverSignature !== this._sasl_data['server-signature']) {
            // remove old handlers
            this.deleteHandler(this._sasl_failure_handler);
            this._sasl_failure_handler = null;
            if (this._sasl_challenge_handler) {
              this.deleteHandler(this._sasl_challenge_handler);
              this._sasl_challenge_handler = null;
            }
            this._sasl_data = {};
            return this._sasl_failure_cb(null);
          }
        }
        log.info('SASL authentication succeeded.');
        if (this._sasl_data.keys) {
          this.scram_keys = this._sasl_data.keys;
        }
        if (this._sasl_mechanism) {
          this._sasl_mechanism.onSuccess();
        }
        // remove old handlers
        this.deleteHandler(this._sasl_failure_handler);
        this._sasl_failure_handler = null;
        if (this._sasl_challenge_handler) {
          this.deleteHandler(this._sasl_challenge_handler);
          this._sasl_challenge_handler = null;
        }
        /** @type {Handler[]} */
        const streamfeature_handlers = [];

        /**
         * @param {Handler[]} handlers
         * @param {Element} elem
         */
        const wrapper = (handlers, elem) => {
          while (handlers.length) {
            this.deleteHandler(handlers.pop());
          }
          this._onStreamFeaturesAfterSASL(elem);
          return false;
        };
        streamfeature_handlers.push(this._addSysHandler(/** @param {Element} elem */
        elem => wrapper(streamfeature_handlers, elem), null, 'stream:features', null, null));
        streamfeature_handlers.push(this._addSysHandler(/** @param {Element} elem */
        elem => wrapper(streamfeature_handlers, elem), NS.STREAM, 'features', null, null));

        // we must send an xmpp:restart now
        this._sendRestart();
        return false;
      }

      /**
       * @private
       * @param {Element} elem - The matching stanza.
       * @return {false} `false` to remove the handler.
       */
      _onStreamFeaturesAfterSASL(elem) {
        // save stream:features for future usage
        this.features = elem;
        for (let i = 0; i < elem.childNodes.length; i++) {
          const child = elem.childNodes[i];
          if (child.nodeName === 'bind') {
            this.do_bind = true;
          }
          if (child.nodeName === 'session') {
            this.do_session = true;
          }
        }
        if (!this.do_bind) {
          this._changeConnectStatus(Status.AUTHFAIL, null);
          return false;
        } else if (!this.options.explicitResourceBinding) {
          this.bind();
        } else {
          this._changeConnectStatus(Status.BINDREQUIRED, null);
        }
        return false;
      }

      /**
       * Sends an IQ to the XMPP server to bind a JID resource for this session.
       *
       * https://tools.ietf.org/html/rfc6120#section-7.5
       *
       * If `explicitResourceBinding` was set to a truthy value in the options
       * passed to the Connection constructor, then this function needs
       * to be called explicitly by the client author.
       *
       * Otherwise it'll be called automatically as soon as the XMPP server
       * advertises the "urn:ietf:params:xml:ns:xmpp-bind" stream feature.
       */
      bind() {
        if (!this.do_bind) {
          log.info(`Connection.prototype.bind called but "do_bind" is false`);
          return;
        }
        this._addSysHandler(this._onResourceBindResultIQ.bind(this), null, null, null, '_bind_auth_2');
        const resource = getResourceFromJid(this.jid);
        if (resource) {
          this.send($iq({
            type: 'set',
            id: '_bind_auth_2'
          }).c('bind', {
            xmlns: NS.BIND
          }).c('resource', {}).t(resource).tree());
        } else {
          this.send($iq({
            type: 'set',
            id: '_bind_auth_2'
          }).c('bind', {
            xmlns: NS.BIND
          }).tree());
        }
      }

      /**
       * _Private_ handler for binding result and session start.
       * @private
       * @param {Element} elem - The matching stanza.
       * @return {false} `false` to remove the handler.
       */
      _onResourceBindResultIQ(elem) {
        if (elem.getAttribute('type') === 'error') {
          log.warn('Resource binding failed.');
          const conflict = elem.getElementsByTagName('conflict');
          let condition;
          if (conflict.length > 0) {
            condition = ErrorCondition.CONFLICT;
          }
          this._changeConnectStatus(Status.AUTHFAIL, condition, elem);
          return false;
        }
        // TODO - need to grab errors
        const bind = elem.getElementsByTagName('bind');
        if (bind.length > 0) {
          const jidNode = bind[0].getElementsByTagName('jid');
          if (jidNode.length > 0) {
            this.authenticated = true;
            this.jid = getText(jidNode[0]);
            if (this.do_session) {
              this._establishSession();
            } else {
              this._changeConnectStatus(Status.CONNECTED, null);
            }
          }
        } else {
          log.warn('Resource binding failed.');
          this._changeConnectStatus(Status.AUTHFAIL, null, elem);
          return false;
        }
      }

      /**
       * Send IQ request to establish a session with the XMPP server.
       *
       * See https://xmpp.org/rfcs/rfc3921.html#session
       *
       * Note: The protocol for session establishment has been determined as
       * unnecessary and removed in RFC-6121.
       * @private
       */
      _establishSession() {
        if (!this.do_session) {
          throw new Error(`Connection.prototype._establishSession ` + `called but apparently ${NS.SESSION} wasn't advertised by the server`);
        }
        this._addSysHandler(this._onSessionResultIQ.bind(this), null, null, null, '_session_auth_2');
        this.send($iq({
          type: 'set',
          id: '_session_auth_2'
        }).c('session', {
          xmlns: NS.SESSION
        }).tree());
      }

      /**
       * _Private_ handler for the server's IQ response to a client's session
       * request.
       *
       * This sets Connection.authenticated to true on success, which
       * starts the processing of user handlers.
       *
       * See https://xmpp.org/rfcs/rfc3921.html#session
       *
       * Note: The protocol for session establishment has been determined as
       * unnecessary and removed in RFC-6121.
       * @private
       * @param {Element} elem - The matching stanza.
       * @return {false} `false` to remove the handler.
       */
      _onSessionResultIQ(elem) {
        if (elem.getAttribute('type') === 'result') {
          this.authenticated = true;
          this._changeConnectStatus(Status.CONNECTED, null);
        } else if (elem.getAttribute('type') === 'error') {
          this.authenticated = false;
          log.warn('Session creation failed.');
          this._changeConnectStatus(Status.AUTHFAIL, null, elem);
          return false;
        }
        return false;
      }

      /**
       * _Private_ handler for SASL authentication failure.
       * @param {Element} [elem] - The matching stanza.
       * @return {false} `false` to remove the handler.
       */
      _sasl_failure_cb(elem) {
        // delete unneeded handlers
        if (this._sasl_success_handler) {
          this.deleteHandler(this._sasl_success_handler);
          this._sasl_success_handler = null;
        }
        if (this._sasl_challenge_handler) {
          this.deleteHandler(this._sasl_challenge_handler);
          this._sasl_challenge_handler = null;
        }
        if (this._sasl_mechanism) this._sasl_mechanism.onFailure();
        this._changeConnectStatus(Status.AUTHFAIL, null, elem);
        return false;
      }

      /**
       * _Private_ handler to finish legacy authentication.
       *
       * This handler is called when the result from the jabber:iq:auth
       * <iq/> stanza is returned.
       * @private
       * @param {Element} elem - The stanza that triggered the callback.
       * @return {false} `false` to remove the handler.
       */
      _auth2_cb(elem) {
        if (elem.getAttribute('type') === 'result') {
          this.authenticated = true;
          this._changeConnectStatus(Status.CONNECTED, null);
        } else if (elem.getAttribute('type') === 'error') {
          this._changeConnectStatus(Status.AUTHFAIL, null, elem);
          this.disconnect('authentication failed');
        }
        return false;
      }

      /**
       * _Private_ function to add a system level timed handler.
       *
       * This function is used to add a TimedHandler for the
       * library code.  System timed handlers are allowed to run before
       * authentication is complete.
       * @param {number} period - The period of the handler.
       * @param {Function} handler - The callback function.
       */
      _addSysTimedHandler(period, handler) {
        const thand = new TimedHandler(period, handler);
        thand.user = false;
        this.addTimeds.push(thand);
        return thand;
      }

      /**
       * _Private_ function to add a system level stanza handler.
       *
       * This function is used to add a Handler for the
       * library code.  System stanza handlers are allowed to run before
       * authentication is complete.
       * @param {Function} handler - The callback function.
       * @param {string} ns - The namespace to match.
       * @param {string} name - The stanza name to match.
       * @param {string} type - The stanza type attribute to match.
       * @param {string} id - The stanza id attribute to match.
       */
      _addSysHandler(handler, ns, name, type, id) {
        const hand = new Handler(handler, ns, name, type, id);
        hand.user = false;
        this.addHandlers.push(hand);
        return hand;
      }

      /**
       * _Private_ timeout handler for handling non-graceful disconnection.
       *
       * If the graceful disconnect process does not complete within the
       * time allotted, this handler finishes the disconnect anyway.
       * @return {false} `false` to remove the handler.
       */
      _onDisconnectTimeout() {
        log.debug('_onDisconnectTimeout was called');
        this._changeConnectStatus(Status.CONNTIMEOUT, null);
        this._proto._onDisconnectTimeout();
        // actually disconnect
        this._doDisconnect();
        return false;
      }

      /**
       * _Private_ handler to process events during idle cycle.
       *
       * This handler is called every 100ms to fire timed handlers that
       * are ready and keep poll requests going.
       */
      _onIdle() {
        // add timed handlers scheduled for addition
        // NOTE: we add before remove in the case a timed handler is
        // added and then deleted before the next _onIdle() call.
        while (this.addTimeds.length > 0) {
          this.timedHandlers.push(this.addTimeds.pop());
        }

        // remove timed handlers that have been scheduled for deletion
        while (this.removeTimeds.length > 0) {
          const thand = this.removeTimeds.pop();
          const i = this.timedHandlers.indexOf(thand);
          if (i >= 0) {
            this.timedHandlers.splice(i, 1);
          }
        }

        // call ready timed handlers
        const now = new Date().getTime();
        const newList = [];
        for (let i = 0; i < this.timedHandlers.length; i++) {
          const thand = this.timedHandlers[i];
          if (this.authenticated || !thand.user) {
            const since = thand.lastCalled + thand.period;
            if (since - now <= 0) {
              if (thand.run()) {
                newList.push(thand);
              }
            } else {
              newList.push(thand);
            }
          }
        }
        this.timedHandlers = newList;
        clearTimeout(this._idleTimeout);
        this._proto._onIdle();

        // reactivate the timer only if connected
        if (this.connected) {
          this._idleTimeout = setTimeout(() => this._onIdle(), 100);
        }
      }
    }

    class UnsafeXML extends String {}

    /**
     * A Stanza represents a XML element used in XMPP (commonly referred to as stanzas).
     */
    class Stanza extends Builder {
      /** @type {string} */
      #string;
      /** @type {Array<string>} */
      #strings;
      /**
       * @typedef {Array<string|Stanza|Builder>} StanzaValue
       * @type {StanzaValue|Array<StanzaValue>}
       */
      #values;

      /**
       * @param {string[]} strings
       * @param {any[]} values
       */
      constructor(strings, values) {
        super('stanza');
        this.#strings = strings;
        this.#values = values;
      }

      /**
       * A directive which can be used to pass a string of XML as a value to the
       * stx tagged template literal.
       *
       * It's considered "unsafe" because it can pose a security risk if used with
       * untrusted input.
       *
       * @param {string} string
       * @returns {UnsafeXML}
       * @example
       *    const status = '<status>I am busy!</status>';
       *    const pres = stx`
       *       <presence from='juliet@example.com/chamber' id='pres1'>
       *           <show>dnd</show>
       *           ${unsafeXML(status)}
       *       </presence>`;
       *    connection.send(pres);
       */
      static unsafeXML(string) {
        return new UnsafeXML(string);
      }

      /**
       * Turns the passed-in string into an XML Element.
       * @param {string} string
       * @param {boolean} [throwErrorIfInvalidNS]
       * @returns {Element}
       */
      static toElement(string, throwErrorIfInvalidNS) {
        const doc = xmlHtmlNode(string);
        const parserError = getParserError(doc);
        if (parserError) {
          throw new Error(`Parser Error: ${parserError}`);
        }
        const node = stripWhitespace(getFirstElementChild(doc));
        if (['message', 'iq', 'presence'].includes(node.nodeName.toLowerCase()) && node.namespaceURI !== 'jabber:client' && node.namespaceURI !== 'jabber:server') {
          const err_msg = `Invalid namespaceURI ${node.namespaceURI}`;
          if (throwErrorIfInvalidNS) {
            throw new Error(err_msg);
          } else {
            log.error(err_msg);
          }
        }
        return node;
      }
      buildTree() {
        return Stanza.toElement(this.toString(), true);
      }

      /**
       * @return {string}
       */
      toString() {
        this.#string = this.#string || this.#strings.reduce((acc, str, idx) => {
          const value = this.#values.length > idx ? this.#values[idx] : '';
          return acc + str + (Array.isArray(value) ? value.map(v => v instanceof UnsafeXML || v instanceof Builder ? v : xmlescape(v.toString())).join('') : value instanceof UnsafeXML || value instanceof Builder ? value : xmlescape((value !== null && value !== void 0 ? value : '').toString()));
        }, '').trim();
        return this.#string;
      }
    }

    /**
     * Tagged template literal function which generates {@link Stanza} objects
     *
     * @example
     *      const pres = stx`<presence type="${type}" xmlns="jabber:client"><show>${show}</show></presence>`
     *
     *      connection.send(msg);
     *
     * @example
     *      const msg = stx`<message
     *          from='sender@example.org'
     *          id='hgn27af1'
     *          to='recipient@example.org'
     *          type='chat'>
     *          <body>Hello world</body>
     *      </message>`;
     *
     *      connection.send(msg);
     *
     * @param {string[]} strings
     * @param {...any} values
     * @returns {Stanza}
     */
    function stx(strings, ...values) {
      return new Stanza(strings, values);
    }

    /*global globalThis*/

    /**
     * A container for all Strophe library functions.
     *
     * This object is a container for all the objects and constants
     * used in the library.  It is not meant to be instantiated, but to
     * provide a namespace for library objects, constants, and functions.
     *
     * @namespace Strophe
     * @property {Handler} Handler
     * @property {Builder} Builder
     * @property {Request} Request Represents HTTP Requests made for a BOSH connection
     * @property {Bosh} Bosh Support for XMPP-over-HTTP via XEP-0124 (BOSH)
     * @property {Websocket} Websocket Support for XMPP over websocket
     * @property {WorkerWebsocket} WorkerWebsocket Support for XMPP over websocket in a shared worker
     * @property {number} TIMEOUT=1.1 Timeout multiplier. A waiting BOSH HTTP request
     *  will be considered failed after Math.floor(TIMEOUT * wait) seconds have elapsed.
     *  This defaults to 1.1, and with default wait, 66 seconds.
     * @property {number} SECONDARY_TIMEOUT=0.1 Secondary timeout multiplier.
     *  In cases where Strophe can detect early failure, it will consider the request
     *  failed if it doesn't return after `Math.floor(SECONDARY_TIMEOUT * wait)`
     *  seconds have elapsed. This defaults to 0.1, and with default wait, 6 seconds.
     * @property {SASLAnonymous} SASLAnonymous SASL ANONYMOUS authentication.
     * @property {SASLPlain} SASLPlain SASL PLAIN authentication
     * @property {SASLSHA1} SASLSHA1 SASL SCRAM-SHA-1 authentication
     * @property {SASLSHA256} SASLSHA256 SASL SCRAM-SHA-256 authentication
     * @property {SASLSHA384} SASLSHA384 SASL SCRAM-SHA-384 authentication
     * @property {SASLSHA512} SASLSHA512 SASL SCRAM-SHA-512 authentication
     * @property {SASLOAuthBearer} SASLOAuthBearer SASL OAuth Bearer authentication
     * @property {SASLExternal} SASLExternal SASL EXTERNAL authentication
     * @property {SASLXOAuth2} SASLXOAuth2 SASL X-OAuth2 authentication
     * @property {Status} Status
     * @property {Object.<string, string>} NS
     * @property {XHTML} XHTML
     */
    const Strophe = {
      /** @constant: VERSION */
      VERSION: '3.0.0',
      /**
       * @returns {number}
       */
      get TIMEOUT() {
        return Bosh.getTimeoutMultplier();
      },
      /**
       * @param {number} n
       */
      set TIMEOUT(n) {
        Bosh.setTimeoutMultiplier(n);
      },
      /**
       * @returns {number}
       */
      get SECONDARY_TIMEOUT() {
        return Bosh.getSecondaryTimeoutMultplier();
      },
      /**
       * @param {number} n
       */
      set SECONDARY_TIMEOUT(n) {
        Bosh.setSecondaryTimeoutMultiplier(n);
      },
      ...utils$1,
      ...log,
      shims,
      Request,
      // Transports
      Bosh,
      Websocket,
      WorkerWebsocket,
      Connection,
      Handler,
      // Available authentication mechanisms
      SASLAnonymous,
      SASLPlain,
      SASLSHA1,
      SASLSHA256,
      SASLSHA384,
      SASLSHA512,
      SASLOAuthBearer,
      SASLExternal,
      SASLXOAuth2,
      Stanza,
      Builder,
      ElementType,
      ErrorCondition,
      LogLevel: LOG_LEVELS,
      /** @type {Object.<string, string>} */
      NS,
      SASLMechanism,
      /** @type {Status} */
      Status,
      TimedHandler,
      XHTML: {
        ...XHTML,
        validTag: validTag,
        validCSS: validCSS,
        validAttribute: validAttribute
      },
      /**
       * Render a DOM element and all descendants to a String.
       * @method Strophe.serialize
       * @param {Element|Builder} elem - A DOM element.
       * @return {string} - The serialized element tree as a String.
       */
      serialize(elem) {
        return Builder.serialize(elem);
      },
      /**
       * @typedef {import('./constants').LogLevel} LogLevel
       *
       * Library consumers can use this function to set the log level of Strophe.
       * The default log level is Strophe.LogLevel.INFO.
       * @param {LogLevel} level
       * @example Strophe.setLogLevel(Strophe.LogLevel.DEBUG);
       */
      setLogLevel(level) {
        log.setLogLevel(level);
      },
      /**
       * This function is used to extend the current namespaces in
       * Strophe.NS. It takes a key and a value with the key being the
       * name of the new namespace, with its actual value.
       * @example: Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
       *
       * @param {string} name - The name under which the namespace will be
       *     referenced under Strophe.NS
       * @param {string} value - The actual namespace.
       */
      addNamespace(name, value) {
        Strophe.NS[name] = value;
      },
      /**
       * Extends the Strophe.Connection object with the given plugin.
       * @param {string} name - The name of the extension.
       * @param {Object} ptype - The plugin's prototype.
       */
      addConnectionPlugin(name, ptype) {
        Connection.addConnectionPlugin(name, ptype);
      }
    };
    globalThis.$build = $build;
    globalThis.$iq = $iq;
    globalThis.$msg = $msg;
    globalThis.$pres = $pres;
    globalThis.Strophe = Strophe;
    globalThis.stx = stx;
    const toStanza = Stanza.toElement;
    globalThis.toStanza = Stanza.toElement; // Deprecated

    exports.$build = $build;
    exports.$iq = $iq;
    exports.$msg = $msg;
    exports.$pres = $pres;
    exports.Builder = Builder;
    exports.Request = Request;
    exports.Stanza = Stanza;
    exports.Strophe = Strophe;
    exports.stx = stx;
    exports.toStanza = toStanza;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
