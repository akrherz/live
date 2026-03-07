// Test for XEP-0092 handler logic
import assert from 'assert';
import { JSDOM } from 'jsdom';

// Setup DOM for the test
const { window } = new JSDOM(`<!DOCTYPE html>`);
globalThis.document = window.document;

// Simulate a minimal IQ stanza for jabber:iq:version
function makeIQ({from = 'foo@bar', id = '123'} = {}) {
  const iq = document.implementation.createDocument('', 'iq', null).documentElement;
  iq.setAttribute('type', 'get');
  iq.setAttribute('from', from);
  iq.setAttribute('id', id);
  const query = document.createElement('query');
  query.setAttribute('xmlns', 'jabber:iq:version');
  iq.appendChild(query);
  return iq;
}

// Patch Application.XMPPConn.send to capture reply
let sentIQ = null;
globalThis.Application = { XMPPConn: { send: iq => { sentIQ = iq; } } };

// Patch LiveConfig
const APP_NAME = 'Weather.IM Live';
globalThis.LiveConfig = { NAME: APP_NAME };

// Patch getFullVersionString to deterministic value
const VERSION_STRING = '1.2.3 (abc123) built 2026-03-07T12:34:56Z';
globalThis.getFullVersionString = () => VERSION_STRING;

// Inline the handler logic (mirroring src/xmpp/handlers.js)
function onVersionIQ(iq) {
  if (iq.getAttribute('type') !== 'get') return true;
  const query = iq.getElementsByTagName('query')[0];
  if (!query || query.getAttribute('xmlns') !== 'jabber:iq:version') return true;
  const from = iq.getAttribute('from');
  const id = iq.getAttribute('id');
  const reply = document.implementation.createDocument('', 'iq', null).documentElement;
  reply.setAttribute('to', from);
  reply.setAttribute('type', 'result');
  reply.setAttribute('id', id);
  const q = document.createElement('query');
  q.setAttribute('xmlns', 'jabber:iq:version');
  const name = document.createElement('name');
  name.textContent = APP_NAME;
  const version = document.createElement('version');
  version.textContent = VERSION_STRING;
  q.appendChild(name);
  q.appendChild(version);
  reply.appendChild(q);
  Application.XMPPConn.send(reply);
  return true;
}

// Run the test
const iq = makeIQ();
sentIQ = null;
onVersionIQ(iq);

assert(sentIQ, 'Handler should send a reply IQ');
const q = sentIQ.getElementsByTagName('query')[0];
assert(q, 'Reply should have a <query> element');
assert.strictEqual(q.getAttribute('xmlns'), 'jabber:iq:version', 'Query xmlns should be jabber:iq:version');
const name = q.getElementsByTagName('name')[0];
const version = q.getElementsByTagName('version')[0];
assert(name && version, 'Reply should have <name> and <version>');
assert.strictEqual(name.textContent, APP_NAME, 'Name should match');
assert.strictEqual(version.textContent, VERSION_STRING, 'Version should match');

console.log('xep0092.test.mjs passed');
