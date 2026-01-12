module.exports = [
    {
        files: ["eslint.config.js"],
        languageOptions: {
            globals: {
                "module": "readonly",
                "require": "readonly"
            }
        }
    },
    {
        files: ["**/*.js"],
        ignores: ["eslint.config.js"],
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "module",
            globals: {
                // jQuery and dependencies
                "$": "readonly",
                "jQuery": "readonly",
                
                // ExtJS
                "Ext": "readonly",
                
                // XMPP/Strophe
                "Strophe": "readonly",
                "$msg": "readonly",
                "$pres": "readonly",
                "$iq": "readonly",
                
                // OpenLayers
                "ol": "readonly",
                "OpenLayers": "readonly",
                "GeoExt": "readonly",
                
                // Application namespace
                "Application": "writable",
                
                // Other globals
                "iemdata": "readonly",
                "moment": "readonly",
                "google": "readonly",
                "soundManager": "readonly",
                "iembotFilter": "readonly",
                "UTCStringToDate": "readonly",
                "onBuddyPresence": "readonly",
                "showHtmlVersion": "readonly",
                "saveBookmarks": "readonly",
                "encode64": "readonly",
                
                // Browser globals
                "window": "readonly",
                "document": "readonly",
                "console": "readonly",
                "navigator": "readonly",
                "alert": "readonly",
                "setTimeout": "readonly",
                "setInterval": "readonly",
                "clearTimeout": "readonly",
                "clearInterval": "readonly"
            }
        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": "warn"
        }
    }
];
