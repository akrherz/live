/**
 * Application Configuration
 * Central configuration for Weather.IM Live application
 */

// Initialize Application namespace
if (typeof window !== 'undefined') {
  window.Application = window.Application || {};
}

// User identity and connection settings
export const config = {
  NAME: "Weather.IM Live",
  BOSH: "https://weather.im/http-bind/",
  RECONNECT: true,
  ATTEMPTS: 0,
  XMPPHOST: "weather.im",
  XMPPMUCHOST: "conference.weather.im",
  XMPPRESOURCE: "weatherim",
  
  // Login options
  LOGIN_OPT_USER: "true",
  LOGIN_OPT_ANONYMOUS: "true", 
  LOGIN_OPT_REGISTER: "true",
  
  // Debug mode
  DEBUGMODE: false
};

// Apply config to global Application object for compatibility
if (typeof window !== 'undefined' && window.Application) {
  Object.assign(window.Application, config);
}

export default config;
