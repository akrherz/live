/**
 * Pure layer configuration helpers — no OpenLayers dependencies,
 * so these can be unit-tested in Node without a browser environment.
 */

/**
 * Build the XYZ tile URL for an IEM cache tile layer.
 *
 * @param {string} layername - IEM layer identifier
 * @returns {string}
 */
export function iemTileUrl(layername) {
    return `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${layername}/{z}/{x}/{y}.png`;
}

/**
 * Build the XYZ tile URL for an IEM political boundary layer (c.py).
 *
 * @param {string} layername - IEM boundary layer identifier
 * @returns {string}
 */
export function iemBoundaryUrl(layername) {
    return `https://mesonet.agron.iastate.edu/c/tile.py/1.0.0/${layername}/{z}/{x}/{y}.png`;
}

/**
 * Return the static property bag for an IEM cache tile layer.
 *
 * @param {string} name        - Human-readable layer name
 * @param {string} layername   - IEM layer identifier
 * @param {string} checkedGroup - Layer tree group name
 * @returns {{ name: string, checkedGroup: string, refreshable: boolean, visible: boolean, opacity: number, url: string }}
 */
export function iemTileLayerConfig(name, layername, checkedGroup) {
    return {
        name,
        checkedGroup,
        refreshable: true,
        visible: false,
        opacity: 0.8,
        url: iemTileUrl(layername),
    };
}

/**
 * Return the static property bag for an IEM boundary tile layer.
 *
 * @param {string} name      - Human-readable layer name
 * @param {string} layername - IEM boundary layer identifier
 * @returns {{ name: string, checkedGroup: string, refreshable: boolean, visible: boolean, opacity: number, url: string }}
 */
export function iemBoundaryLayerConfig(name, layername) {
    return {
        name,
        checkedGroup: 'Political Boundaries',
        refreshable: false,
        visible: false,
        opacity: 0.8,
        url: iemBoundaryUrl(layername),
    };
}
