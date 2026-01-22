/**
 * Weather.IM Live - Main Entry Point
 */

// ExtJS 6 loaded via script tag in HTML (UMD module, not ES module compatible)

// Import OpenLayers 8
import 'ol/ol.css';

// Import configuration
import './config.js';

// Import Strophe.js from npm package and set up plugins
import { Strophe } from 'strophe.js';
import './lib/strophe-disco-plugin.js';


// Import chat components
import './chat/ChatComponents.js';

import './map/MapPanel.js';

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

  // OpenLayers 8 is loaded via ES modules, no window check needed
  // GeoExt has been removed - we're using pure OpenLayers 8 + ExtJS 6

  console.log('All dependencies loaded, initializing app...');

  // Configure Strophe logging
  Strophe.log = function(level, msg) {
    if (Application.log) {
      Application.log(msg);
    }
  };

  // Initialize audio mute state
  Application.audioMuted = false;

  // ExtJS configuration
  Ext.BLANK_IMAGE_URL = '/vendor/ext/3.4.1/resources/images/default/s.gif';

  Ext.onReady(function() {
    console.log('Ext.onReady fired');

    try {
      // Cleanup on window close (modern ExtJS: use Ext.get(window).on)
      Ext.get(window).on('beforeunload', () => {
        if (typeof Application.XMPPConn !== 'undefined') {
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

      // Start ServiceGuard task
      if (Application.ServiceGuard) {
        Ext.TaskManager.start(Application.ServiceGuard);
      }
      // MapTask is started in doStuff() after map is ready

      console.log('Application initialization complete');
    } catch (e) {
      console.error('Error during initialization:', e);
    }
  });
}

// Start initialization when module loads
initializeApp();
