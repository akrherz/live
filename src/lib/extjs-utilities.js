/**
 * ExtJS 6 utilities and extensions
 *
 * Note: ExtJS 6 has built-in check column support via xtype: 'checkcolumn'
 * Most ExtJS 3 plugins are no longer needed or have been replaced with built-in functionality
 */

// ExtJS 6 already includes check column functionality
// No need for custom CheckColumn implementation

// Compatibility shim for ExtJS 3 code
// Ext.reg was removed in ExtJS 4+, replaced with Ext.define + alias
if (!Ext.reg) {
    // Create a registry to store xtype mappings
    if (!Ext._legacyXTypes) {
        Ext._legacyXTypes = {};
    }

    Ext.reg = function(xtype, cls) {
        if (cls && xtype) {
            // Store the xtype mapping for component creation
            Ext._legacyXTypes[xtype] = cls;

            // Set xtype on the prototype
            if (cls.prototype) {
                cls.prototype.xtype = xtype;
            }
        }
    };

    // Override ComponentMgr.create to check our legacy registry
    const originalCreate = Ext.ComponentMgr.create;
    Ext.ComponentMgr.create = function(config) {
        if (config && config.xtype && Ext._legacyXTypes[config.xtype]) {
            // Use our registered class
            const cls = Ext._legacyXTypes[config.xtype];
            return new cls(config);
        }
        return originalCreate.apply(this, arguments);
    };
}

// Add any ExtJS 6 specific utilities here if needed
