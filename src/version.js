// Auto-generated version module
// This file is generated at build time by Vite define plugin

function getEnvVar(name, fallback) {
    // Vite
    if (
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        name in import.meta.env
    ) {
        return import.meta.env[name];
    }
    // Node.js/process.env
    if (typeof process !== "undefined" && process.env && name in process.env) {
        return process.env[name];
    }
    // Test override (globalThis)
    if (typeof globalThis !== "undefined" && name in globalThis) {
        return globalThis[name];
    }
    return fallback;
}

export const APP_VERSION = getEnvVar("APP_VERSION", "0.0.0");
export const APP_BUILD = getEnvVar("APP_BUILD", "");
export const APP_GIT_HASH = getEnvVar("APP_GIT_HASH", "");

/**
 * Returns the full version string.
 * @param {string} [version] - override version (for testing)
 * @param {string} [gitHash] - override git hash (for testing)
 * @param {string} [build] - override build time (for testing)
 */
export function getFullVersionString(version, gitHash, build) {
    let str = version ?? APP_VERSION;
    const hash = gitHash ?? APP_GIT_HASH;
    const bld = build ?? APP_BUILD;
    if (hash) {
        str += ` (${hash})`;
    }
    if (bld) {
        str += ` built ${bld}`;
    }
    return str;
}
