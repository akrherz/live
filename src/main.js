/**
 * Weather.IM Live - Main Entry Point (Refactored)
 * 
 * This file now serves as the minimal bootstrap for the application.
 * Most functionality has been extracted into separate modules for better organization.
 */

// Import configuration
import './config.js';

// Import map components
import './map/MapPanel.js';

// Import all legacy components (to be further refactored)
import './legacy-components.js';

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

  // Configure SoundManager
  if (window.soundManager) {
    soundManager.url = "swf/";
    soundManager.onready = function() {
      if (Application.log) {
        Application.log("SoundManager2 Loaded...");
      }
    };
  }

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
