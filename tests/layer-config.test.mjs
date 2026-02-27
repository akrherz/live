import test from "node:test";
import assert from "node:assert/strict";
import {
    iemBoundaryUrl,
    iemTileUrl,
    iemBoundaryLayerConfig,
    iemTileLayerConfig,
} from "../src/map/layer-config.js";

// ── URL helpers ──────────────────────────────────────────────────────────────

test("iemBoundaryUrl embeds layername in path", () => {
    const url = iemBoundaryUrl("wfo-900913");
    assert.ok(url.includes("/wfo-900913/"), "layername in path");
});


test("iemBoundaryUrl contains xyz tile placeholders", () => {
    const url = iemBoundaryUrl("usstates");
    assert.ok(url.includes("{z}"), "{z} placeholder");
    assert.ok(url.includes("{x}"), "{x} placeholder");
    assert.ok(url.includes("{y}"), "{y} placeholder");
});

test("iemTileUrl embeds layername in path", () => {
    const url = iemTileUrl("nexrad-n0q-900913");
    assert.ok(url.includes("/nexrad-n0q-900913/"), "layername in path");
});


test("iemTileUrl contains xyz tile placeholders", () => {
    const url = iemTileUrl("nexrad-n0q-900913");
    assert.ok(url.includes("{z}"), "{z} placeholder");
    assert.ok(url.includes("{x}"), "{x} placeholder");
    assert.ok(url.includes("{y}"), "{y} placeholder");
});

// ── iemBoundaryLayerConfig ───────────────────────────────────────────────────

test("iemBoundaryLayerConfig passes name through", () => {
    const cfg = iemBoundaryLayerConfig("NWS WFO CWA", "wfo-900913");
    assert.equal(cfg.name, "NWS WFO CWA");
});

test("iemBoundaryLayerConfig always sets checkedGroup to Political Boundaries", () => {
    const cfg = iemBoundaryLayerConfig("US States", "usstates");
    assert.equal(cfg.checkedGroup, "Political Boundaries");
});

test("iemBoundaryLayerConfig sets refreshable to false", () => {
    const cfg = iemBoundaryLayerConfig("US Counties", "uscounties");
    assert.equal(cfg.refreshable, false);
});

test("iemBoundaryLayerConfig sets visible to false", () => {
    const cfg = iemBoundaryLayerConfig("NWS CWSU", "cwsu-900913");
    assert.equal(cfg.visible, false);
});

test("iemBoundaryLayerConfig sets opacity to 0.8", () => {
    const cfg = iemBoundaryLayerConfig("NWS Fire Zones", "fz-900913");
    assert.equal(cfg.opacity, 0.8);
});

test("iemBoundaryLayerConfig url contains the correct layername", () => {
    const cfg = iemBoundaryLayerConfig("Tribal Boundaries", "tribal-900913");
    assert.ok(cfg.url.includes("/tribal-900913/"), "layername in URL path");
});

test("iemBoundaryLayerConfig url uses c/tile.py", () => {
    const cfg = iemBoundaryLayerConfig("NWS RFC HSA", "rfc-900913");
    assert.match(cfg.url, /\/c\/tile\.py/);
});

// Spot-check all 7 boundary layers are addressable
const boundaryLayers = [
    ["NWS WFO CWA", "wfo-900913"],
    ["NWS CWSU", "cwsu-900913"],
    ["NWS Fire Zones", "fz-900913"],
    ["US Counties", "uscounties"],
    ["US States", "usstates"],
    ["Tribal Boundaries", "tribal-900913"],
    ["NWS RFC HSA", "rfc-900913"],
];

for (const [label, layername] of boundaryLayers) {
    test(`iemBoundaryLayerConfig round-trips: ${label}`, () => {
        const cfg = iemBoundaryLayerConfig(label, layername);
        assert.equal(cfg.name, label);
        assert.ok(cfg.url.includes(`/${layername}/`), `URL contains /${layername}/`);
        assert.equal(cfg.checkedGroup, "Political Boundaries");
        assert.equal(cfg.refreshable, false);
    });
}

// ── iemTileLayerConfig ───────────────────────────────────────────────────────

test("iemTileLayerConfig passes name and checkedGroup through", () => {
    const cfg = iemTileLayerConfig("NEXRAD Base Reflectivity", "nexrad-n0q-900913", "Precip");
    assert.equal(cfg.name, "NEXRAD Base Reflectivity");
    assert.equal(cfg.checkedGroup, "Precip");
});

test("iemTileLayerConfig sets refreshable to true", () => {
    const cfg = iemTileLayerConfig("NEXRAD Base Reflectivity", "nexrad-n0q-900913", "Precip");
    assert.equal(cfg.refreshable, true);
});

test("iemTileLayerConfig sets visible to false", () => {
    const cfg = iemTileLayerConfig("NEXRAD Base Reflectivity", "nexrad-n0q-900913", "Precip");
    assert.equal(cfg.visible, false);
});

test("iemTileLayerConfig url does not use c.py", () => {
    const cfg = iemTileLayerConfig("NEXRAD Base Reflectivity", "nexrad-n0q-900913", "Precip");
    assert.ok(!cfg.url.includes("c.py"), "should not use c.py");
});
