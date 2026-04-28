// Structural sanity tests for index.html — fast, doesn't require a browser.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('index.html contains GitHubAPI extraction markers', () => {
    assert.match(html, /=== BEGIN GitHubAPI ===/);
    assert.match(html, /=== END GitHubAPI ===/);
});

test('GitHubAPI exposes label and merge methods', () => {
    for (const fn of [
        'listRepoLabels',
        'createRepoLabel',
        'updateRepoLabel',
        'deleteRepoLabel',
        'setIssueLabels',
        'addLabelsToIssue',
        'getRepository',
        'getPullRequest',
        'mergePullRequest',
        'repoAllowedMergeStrategies',
    ]) {
        assert.match(html, new RegExp(`(async\\s+)?${fn}\\s*\\(`),
            `expected ${fn} to be defined in index.html`);
    }
});

test('App renders the new UI surfaces', () => {
    // The label filter chip
    assert.match(html, /setShowLabelFilter/);
    // The merge button
    assert.match(html, /openMergeModal/);
    // The label editor
    assert.match(html, /openLabelEditor/);
    // The repo-level manager
    assert.match(html, /openLabelManager/);
    // Bulk merge entry points
    assert.match(html, /openBulkMerge/);
    assert.match(html, /runBulkMerge/);
    assert.match(html, /Merge Selected/);
});

test('Babel/React script tags are still present (no accidental breakage)', () => {
    assert.match(html, /react\.production\.min\.js/);
    assert.match(html, /react-dom\.production\.min\.js/);
    assert.match(html, /babel\.min\.js/);
    assert.match(html, /jsrsasign-all-min\.js/);
});

test('GitHubAPI block braces balance (defensive — catches accidental edits)', () => {
    const start = html.indexOf('// === BEGIN GitHubAPI ===');
    const end = html.indexOf('// === END GitHubAPI ===');
    assert.ok(start >= 0 && end > start, 'markers must exist');
    let depth = 0;
    let started = false;
    let inString = null;
    let escape = false;
    let inSingleComment = false;
    let inBlockComment = false;
    const block = html.substring(start, end);
    for (let i = 0; i < block.length; i++) {
        const c = block[i];
        const next = block[i + 1];
        if (escape) { escape = false; continue; }
        if (inSingleComment) { if (c === '\n') inSingleComment = false; continue; }
        if (inBlockComment) { if (c === '*' && next === '/') { inBlockComment = false; i++; } continue; }
        if (inString) {
            if (c === '\\') { escape = true; continue; }
            if (c === inString) inString = null;
            continue;
        }
        if (c === '/' && next === '/') { inSingleComment = true; i++; continue; }
        if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
        if (c === '"' || c === "'" || c === '`') { inString = c; continue; }
        if (c === '{') { depth++; started = true; }
        else if (c === '}') depth--;
    }
    assert.equal(depth, 0, 'GitHubAPI block braces must balance');
    assert.ok(started, 'expected to see at least one open brace');
});
