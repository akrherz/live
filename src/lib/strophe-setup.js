/**
 * Strophe.js Setup and Plugins
 * 
 * This file imports Strophe from npm and sets up any necessary plugins
 * and configurations.
 */

import { Strophe, $build, $msg, $iq, $pres } from 'strophe.js';

// Make Strophe available globally for compatibility with legacy code
if (typeof window !== 'undefined') {
  window.Strophe = Strophe;
  window.$build = $build;
  window.$msg = $msg;
  window.$iq = $iq;
  window.$pres = $pres;
}

export { Strophe, $build, $msg, $iq, $pres };
export default Strophe;
