// Parse the inline <script type="text/babel"> with @babel/parser to catch JSX
// or JS syntax errors at CI time, since the page itself only fails at runtime.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');

test('inline babel script parses as JS+JSX', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
    assert.ok(match, 'expected an inline <script type="text/babel"> block');

    // Should not throw.
    parser.parse(match[1], { sourceType: 'script', plugins: ['jsx'] });
});
