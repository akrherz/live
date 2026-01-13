/**
 * Weather.IM Live - Main Entry Point
 * 
 * This file now serves as the minimal bootstrap for the application.
 * All functionality has been extracted into separate modules.
 */

// Import configuration
import './config.js';

// Import Strophe.js from npm package and set up plugins
import './lib/strophe-setup.js';
import './lib/strophe-disco-plugin.js';

// Import ExtJS utilities and extensions
import './lib/extjs-utilities.js';

// Import login components
import './auth/LoginPanel.js';

// Import map layers and components
import './map/layers.js';
import './map/MapPanel.js';

// Import chat components
import './chat/ChatComponents.js';

// Import XMPP handlers
import './xmpp/handlers.js';

// Import dialog windows
import './dialogs/Dialogs.js';

// Import UI components
import './ui/core-components.js';
import './ui/additional-windows.js';

// Import utilities
import './utils/grid-utilities.js';

// Import core application control
import './core/app-control.js';

// Import event handlers
import './events/event-handlers.js';

console.log('Weather.IM Live ES module loaded');

// Wait for all global dependencies to be available before initializing
function initializeApp() {
  if (!window.Ext) {
    console.warn('ExtJS not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  if (!window.OpenLayers) {
    console.warn('OpenLayers not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  if (!window.GeoExt) {
    console.warn('GeoExt not loaded yet, retrying...');
    setTimeout(initializeApp, 50);
    return;
  }
  
  console.log('All dependencies loaded, initializing app...');
  
  // Configure Strophe logging if available
  if (window.Strophe) {
    Strophe.log = function(level, msg) {
      if (Application.log) {
        Application.log(msg);
      }
    };
  }

  // Initialize audio mute state
  Application.audioMuted = false;

  // ExtJS configuration
  Ext.BLANK_IMAGE_URL = '/vendor/ext/3.4.1/resources/images/default/s.gif';
  Ext.ns("Application");
  
  Ext.onReady(function() {
    console.log('Ext.onReady fired');
    
    try {
      // Cleanup on window close
      Ext.EventManager.on(window, 'beforeunload', function() {
        if (typeof Application.XMPPConn != 'undefined') {
          Application.XMPPConn.flush();
          Application.XMPPConn.disconnect();
        }
      });
      
      Ext.QuickTips.init();
      
      console.log('Creating LiveViewport...');
      (new Application.LiveViewport({
        renderTo: Ext.getBody(),
        enableMap: true
      })).show();
      console.log('LiveViewport created and shown');
      
      Ext.TaskMgr.start(Application.ServiceGuard);
      Ext.TaskMgr.start(Application.MapTask);
      
      // Activate map feature selection controls
      if (window.OpenLayers && window.lsrs && window.sbws) {
        const lsrs = window.lsrs;
        const sbws = window.sbws;
        const ctrl = new OpenLayers.Control.SelectFeature([lsrs, sbws]);
        Ext.getCmp('map').map.addControl(ctrl);
        ctrl.activate();
        console.log('Map controls activated');
      }
    } catch (e) {
      console.error('Error during initialization:', e);
    }
  });
}

// Start initialization when module loads
initializeApp();
