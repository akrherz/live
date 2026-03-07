
import assert from 'assert';
import { getFullVersionString } from '../src/version.js';

const expected = '1.2.3 (abc123) built 2026-03-07T12:34:56Z';
const actual = getFullVersionString('1.2.3', 'abc123', '2026-03-07T12:34:56Z');
assert.strictEqual(actual, expected, 'getFullVersionString() should return correct version string');

console.log('version.test.mjs passed');
