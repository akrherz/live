/**
 * Feature Stores - ExtJS stores that sync with OpenLayers vector sources
 * Replacement for GeoExt.data.FeatureStore
 */

/**
 * Create an ExtJS store that syncs with an OpenLayers VectorSource
 */
export function createFeatureStore(layer, config = {}) {
    const source = layer.getSource();

    const store = new Ext.data.JsonStore({
        fields: config.fields || [],
        data: [],
        sortInfo: config.sortInfo,
    });

    // Sync store when features change
    const syncStore = () => {
        const features = source.getFeatures();
        const records = features.map(feature => {
            const props = feature.getProperties();
            delete props.geometry; // Don't include geometry in store
            return props;
        });
        store.loadData(records);
    };

    // Listen for feature changes
    source.on('addfeature', syncStore);
    source.on('removefeature', syncStore);
    source.on('changefeature', syncStore);

    // Initial sync
    syncStore();

    // Add reference to layer
    store.layer = layer;

    return store;
}

/**
 * Create LSR (Local Storm Reports) store
 */
export function createLSRStore(lsrsLayer) {
    return createFeatureStore(lsrsLayer, {
        sortInfo: {
            field: 'valid',
            direction: 'DESC',
        },
        fields: [
            { name: 'valid', type: 'string' },
            { name: 'event', type: 'string' },
            { name: 'magnitude', type: 'string' },
            { name: 'city', type: 'string' },
            { name: 'county', type: 'string' },
            { name: 'state', type: 'string' },
            { name: 'remark', type: 'string' },
            { name: 'ptype', type: 'string' },
        ],
    });
}

/**
 * Create SBW (Storm Based Warnings) store
 */
export function createSBWStore(sbwsLayer) {
    return createFeatureStore(sbwsLayer, {
        sortInfo: {
            field: 'issue',
            direction: 'DESC',
        },
        fields: [
            { name: 'issue', type: 'string' },
            { name: 'expire', type: 'string' },
            { name: 'phenomena', type: 'string' },
            { name: 'significance', type: 'string' },
            { name: 'wfo', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'ptype', type: 'string' },
        ],
    });
}
