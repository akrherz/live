/**
 * Application Configuration
 * Central configuration for Weather.IM Live application
 */

import { Application } from "./app-state.js";

// User identity and connection settings
export const LiveConfig = {
  NAME: "Weather.IM Live",

  // XMPP transport settings
  // transport: "bosh" | "websocket"
  XMPP_TRANSPORT: "bosh",
  BOSH: "https://weather.im/http-bind/",
  WEBSOCKET: "wss://weather.im/ws",

  RECONNECT: true,
  ATTEMPTS: 0,
  XMPPHOST: "weather.im",
  XMPPMUCHOST: "conference.weather.im",
  XMPPRESOURCE: "weatherim",

  // Login options
  LOGIN_OPT_USER: "true",
  LOGIN_OPT_ANONYMOUS: "true",
  LOGIN_OPT_REGISTER: "true"

};

// Apply config to shared app state
Object.assign(Application, LiveConfig);
