// Loads the GitHubAPI object literal from index.html for testing.
// We extract it between the marker comments rather than refactoring the
// project into separate JS files — index.html is meant to run from file://
// without a build step, and we want to keep it that way.

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const BEGIN = '// === BEGIN GitHubAPI ===';
const END = '// === END GitHubAPI ===';

function loadGitHubAPI(fetchMock) {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const startMarkerIdx = html.indexOf(BEGIN);
    const endMarkerIdx = html.indexOf(END);
    if (startMarkerIdx < 0 || endMarkerIdx < 0) {
        throw new Error('GitHubAPI markers not found in index.html');
    }
    // Slice from after BEGIN marker line to before END marker line.
    const beginLineEnd = html.indexOf('\n', startMarkerIdx);
    const block = html.substring(beginLineEnd + 1, endMarkerIdx);

    // Also pull in `parseLinkHeader` since GitHubAPI.paginate uses it.
    const helperMatch = html.match(/function parseLinkHeader[\s\S]*?\n\}/);
    if (!helperMatch) throw new Error('parseLinkHeader not found in index.html');

    // Run in the host context so Array/Object identity matches what the test
    // file uses (assert.deepEqual is strict about prototype identity).
    // We wrap the code in an IIFE-style factory and inject the mocks.
    const code = `
        (function(fetch, KJUR) {
            ${helperMatch[0]}
            ${block}
            return GitHubAPI;
        })
    `;
    const factory = vm.runInThisContext(code, { filename: 'index.html (extracted)' });
    return factory(fetchMock, { jws: { JWS: { sign: () => 'test.jwt' } } });
}

// Build a fetch mock factory that records calls and returns canned responses.
function makeFetchMock(handler) {
    const calls = [];
    const fn = async (url, options = {}) => {
        calls.push({ url, options });
        const result = await handler(url, options);
        const body = result.body !== undefined ? result.body : null;
        const headers = new Map(Object.entries(result.headers || {}));
        return {
            ok: result.ok !== false,
            status: result.status || 200,
            json: async () => body,
            headers: { get: (k) => headers.get(k.toLowerCase()) || headers.get(k) || null },
        };
    };
    fn.calls = calls;
    return fn;
}

module.exports = { loadGitHubAPI, makeFetchMock };
