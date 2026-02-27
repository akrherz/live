// src/events/MsgBus.js
// Simple vanilla JS message bus

class MsgBus {
  constructor() {
    this.listeners = {};
  }

  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off(event, handler) {
    if (!this.listeners[event]) {
        return;
    }
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  fire(event, ...args) {
    if (!this.listeners[event]) {
        return;
    }
    // Copy to avoid mutation during iteration
    for (const handler of [...this.listeners[event]]) {
      try {
        handler(...args);
      } catch (e) {
        console.error('MsgBus handler error in event "' + event + '":', e);
      }
    }
  }
}

// Singleton instance
export const msgBus = new MsgBus();
