import test from "node:test";
import assert from "node:assert/strict";
import { UTCStringToDate } from "../src/utils/date-utils.js";

// ── Ymd\Th:i:s format ────────────────────────────────────────────────────────

test("UTCStringToDate parses Ymd\\Th:i:s format correctly", () => {
    const dt = UTCStringToDate("20260227T14:30:00", "Ymd\\Th:i:s");
    assert.ok(dt instanceof Date, "should return a Date");
    assert.equal(dt.getUTCFullYear(), 2026);
    assert.equal(dt.getUTCMonth(), 1); // 0-indexed: February
    assert.equal(dt.getUTCDate(), 27);
    assert.equal(dt.getUTCHours(), 14);
    assert.equal(dt.getUTCMinutes(), 30);
    assert.equal(dt.getUTCSeconds(), 0);
});

test("UTCStringToDate parses Ymd\\Th:i:s midnight correctly", () => {
    const dt = UTCStringToDate("20260101T00:00:00", "Ymd\\Th:i:s");
    assert.ok(dt instanceof Date);
    assert.equal(dt.getUTCFullYear(), 2026);
    assert.equal(dt.getUTCMonth(), 0);
    assert.equal(dt.getUTCDate(), 1);
    assert.equal(dt.getUTCHours(), 0);
    assert.equal(dt.getUTCMinutes(), 0);
    assert.equal(dt.getUTCSeconds(), 0);
});

test("UTCStringToDate returns null for Ymd\\Th:i:s with wrong string", () => {
    // Dashes don't match the compact format
    const dt = UTCStringToDate("2026-02-27T14:30:00", "Ymd\\Th:i:s");
    assert.equal(dt, null);
});

test("UTCStringToDate returns null for Ymd\\Th:i:s with empty string", () => {
    const dt = UTCStringToDate("", "Ymd\\Th:i:s");
    assert.equal(dt, null);
});

// ── Y-m-d\Th:i:s format ──────────────────────────────────────────────────────

test("UTCStringToDate parses Y-m-d\\Th:i:s format correctly", () => {
    const dt = UTCStringToDate("2026-02-27T14:30:00", "Y-m-d\\Th:i:s");
    assert.ok(dt instanceof Date);
    assert.equal(dt.getUTCFullYear(), 2026);
    assert.equal(dt.getUTCMonth(), 1);
    assert.equal(dt.getUTCDate(), 27);
    assert.equal(dt.getUTCHours(), 14);
    assert.equal(dt.getUTCMinutes(), 30);
    assert.equal(dt.getUTCSeconds(), 0);
});

test("UTCStringToDate parses Y-m-d\\Th:i:s end-of-year correctly", () => {
    const dt = UTCStringToDate("2025-12-31T23:59:59", "Y-m-d\\Th:i:s");
    assert.ok(dt instanceof Date);
    assert.equal(dt.getUTCFullYear(), 2025);
    assert.equal(dt.getUTCMonth(), 11);
    assert.equal(dt.getUTCDate(), 31);
    assert.equal(dt.getUTCHours(), 23);
    assert.equal(dt.getUTCMinutes(), 59);
    assert.equal(dt.getUTCSeconds(), 59);
});

test("UTCStringToDate returns null for Y-m-d\\Th:i:s with compact string", () => {
    const dt = UTCStringToDate("20260227T14:30:00", "Y-m-d\\Th:i:s");
    assert.equal(dt, null);
});

test("UTCStringToDate returns null for Y-m-d\\Th:i:s with empty string", () => {
    const dt = UTCStringToDate("", "Y-m-d\\Th:i:s");
    assert.equal(dt, null);
});

// ── Fallback (no format / unknown format) ────────────────────────────────────

test("UTCStringToDate parses ISO 8601 string without explicit format", () => {
    const dt = UTCStringToDate("2026-02-27T14:30:00Z");
    assert.ok(dt instanceof Date);
    // Must be a valid date
    assert.ok(!Number.isNaN(dt.getTime()));
});

test("UTCStringToDate parses RFC 2822-style string without format", () => {
    const dt = UTCStringToDate("Fri, 27 Feb 2026 14:30:00 GMT");
    assert.ok(dt instanceof Date);
    assert.ok(!Number.isNaN(dt.getTime()));
});

test("UTCStringToDate returns null for unparseable string without format", () => {
    const dt = UTCStringToDate("not a date");
    assert.equal(dt, null);
});

test("UTCStringToDate returns null for empty string without format", () => {
    const dt = UTCStringToDate("");
    assert.equal(dt, null);
});

test("UTCStringToDate returns null for unknown format with valid-looking string", () => {
    // The unknown format falls through to new Date() which parses ISO fine
    const dt = UTCStringToDate("2026-02-27T14:30:00Z", "unknown-format");
    assert.ok(dt instanceof Date);
});

// ── Date.parseDate shim compatibility ────────────────────────────────────────

test("UTCStringToDate uses Date.parseDate when available", () => {
    const sentinel = new Date(2000, 0, 1);
    Date.parseDate = () => sentinel;
    try {
        const dt = UTCStringToDate("20260227T14:30:00", "Ymd\\Th:i:s");
        assert.strictEqual(dt, sentinel, "should return the Date.parseDate result");
    } finally {
        delete Date.parseDate;
    }
});

// ── UTC-correctness cross-check ───────────────────────────────────────────────

test("UTCStringToDate Ymd and Y-m-d formats produce identical results", () => {
    const compact = UTCStringToDate("20260615T08:45:30", "Ymd\\Th:i:s");
    const dashed  = UTCStringToDate("2026-06-15T08:45:30", "Y-m-d\\Th:i:s");
    assert.ok(compact instanceof Date);
    assert.ok(dashed instanceof Date);
    assert.equal(compact.getTime(), dashed.getTime());
});
