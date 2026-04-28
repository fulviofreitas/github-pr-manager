// Unit tests for the new label-management and PR-merge endpoints in GitHubAPI.
// Run with: node --test tests/

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadGitHubAPI, makeFetchMock } = require('./load-api');

// --------------------- parseLinkHeader / paginate ----------------------

test('paginate follows Link header until rel="next" is missing', async () => {
    const pageOne = [{ id: 1, name: 'bug', color: 'ff0000' }, { id: 2, name: 'enh', color: '00ff00' }];
    const pageTwo = [{ id: 3, name: 'docs', color: '0000ff' }];

    let callCount = 0;
    const fetchMock = makeFetchMock(async (url) => {
        callCount += 1;
        if (callCount === 1) {
            return {
                body: pageOne,
                headers: {
                    link: '<https://api.github.com/repos/o/r/labels?per_page=100&page=2>; rel="next", <https://api.github.com/repos/o/r/labels?per_page=100&page=2>; rel="last"',
                },
            };
        }
        return { body: pageTwo, headers: {} };
    });

    const api = loadGitHubAPI(fetchMock);
    const labels = await api.listRepoLabels('o', 'r', 'tok');

    assert.equal(labels.length, 3);
    assert.deepEqual(labels.map(l => l.name), ['bug', 'enh', 'docs']);
    assert.equal(callCount, 2);
    // First call should include per_page=100&page=1
    assert.match(fetchMock.calls[0].url, /per_page=100&page=1/);
});

test('paginate stops after maxPages safety cap', async () => {
    let n = 0;
    const fetchMock = makeFetchMock(async () => {
        n++;
        return {
            body: [{ id: n, name: `label-${n}` }],
            // Always advertise a next page — pagination should still terminate.
            headers: { link: '<https://api.github.com/next>; rel="next"' },
        };
    });
    const api = loadGitHubAPI(fetchMock);
    const labels = await api.listRepoLabels('o', 'r', 'tok');
    assert.equal(labels.length, 10, 'paginate should cap at maxPages=10');
});

// --------------------- Label CRUD ----------------------

test('createRepoLabel posts to /repos/{owner}/{repo}/labels with required fields', async () => {
    const fetchMock = makeFetchMock(async (url, options) => {
        return { body: { id: 99, name: 'new', color: 'ff0000', description: 'd' } };
    });
    const api = loadGitHubAPI(fetchMock);

    const result = await api.createRepoLabel('o', 'r', { name: 'new', color: 'ff0000', description: 'd' }, 'tok');
    assert.equal(result.name, 'new');

    const call = fetchMock.calls[0];
    assert.equal(call.options.method, 'POST');
    assert.match(call.url, /\/repos\/o\/r\/labels$/);
    assert.deepEqual(JSON.parse(call.options.body), { name: 'new', color: 'ff0000', description: 'd' });
    assert.equal(call.options.headers['Authorization'], 'Bearer tok');
});

test('updateRepoLabel only sends fields that were provided', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: { name: 'renamed' } }));
    const api = loadGitHubAPI(fetchMock);

    await api.updateRepoLabel('o', 'r', 'old name', { new_name: 'renamed' }, 'tok');
    const call = fetchMock.calls[0];

    assert.equal(call.options.method, 'PATCH');
    // The original name must be URL-encoded (spaces, etc.).
    assert.match(call.url, /\/labels\/old%20name$/);
    assert.deepEqual(JSON.parse(call.options.body), { new_name: 'renamed' });
});

test('deleteRepoLabel issues DELETE with URL-encoded name', async () => {
    const fetchMock = makeFetchMock(async () => ({ status: 204, body: null }));
    const api = loadGitHubAPI(fetchMock);
    await api.deleteRepoLabel('o', 'r', 'in progress', 'tok');
    const call = fetchMock.calls[0];
    assert.equal(call.options.method, 'DELETE');
    assert.match(call.url, /\/labels\/in%20progress$/);
});

test('setIssueLabels sends PUT with labels array (replaces all labels)', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: [{ name: 'a' }, { name: 'b' }] }));
    const api = loadGitHubAPI(fetchMock);

    const result = await api.setIssueLabels('o', 'r', 42, ['a', 'b'], 'tok');
    assert.deepEqual(result.map(l => l.name), ['a', 'b']);

    const call = fetchMock.calls[0];
    assert.equal(call.options.method, 'PUT');
    assert.match(call.url, /\/repos\/o\/r\/issues\/42\/labels$/);
    assert.deepEqual(JSON.parse(call.options.body), { labels: ['a', 'b'] });
});

test('addLabelsToIssue sends POST with labels array (appends)', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: [{ name: 'a' }, { name: 'b' }] }));
    const api = loadGitHubAPI(fetchMock);
    await api.addLabelsToIssue('o', 'r', 42, ['x'], 'tok');
    const call = fetchMock.calls[0];
    assert.equal(call.options.method, 'POST');
    assert.deepEqual(JSON.parse(call.options.body), { labels: ['x'] });
});

// --------------------- Repo metadata ----------------------

test('getRepository returns the repo object', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: { default_branch: 'main', allow_squash_merge: false } }));
    const api = loadGitHubAPI(fetchMock);
    const r = await api.getRepository('o', 'r');
    assert.equal(r.default_branch, 'main');
    assert.equal(r.allow_squash_merge, false);
});

test('repoAllowedMergeStrategies respects repo settings', () => {
    const api = loadGitHubAPI(() => Promise.resolve({}));

    assert.deepEqual(
        api.repoAllowedMergeStrategies({ allow_merge_commit: true, allow_squash_merge: true, allow_rebase_merge: true }),
        { allowed: ['merge', 'squash', 'rebase'], default: 'squash' }
    );
    // Squash off — default falls back to merge
    assert.deepEqual(
        api.repoAllowedMergeStrategies({ allow_merge_commit: true, allow_squash_merge: false, allow_rebase_merge: true }),
        { allowed: ['merge', 'rebase'], default: 'merge' }
    );
    // Only rebase
    assert.deepEqual(
        api.repoAllowedMergeStrategies({ allow_merge_commit: false, allow_squash_merge: false, allow_rebase_merge: true }),
        { allowed: ['rebase'], default: 'rebase' }
    );
    // Empty input — be permissive (older API responses may omit these fields)
    const r = api.repoAllowedMergeStrategies(null);
    assert.deepEqual(r.allowed, ['merge', 'squash', 'rebase']);
});

// --------------------- Merge ----------------------

test('mergePullRequest sends PUT with merge_method and SHA', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: { merged: true, sha: 'abc1234' } }));
    const api = loadGitHubAPI(fetchMock);

    const result = await api.mergePullRequest('o', 'r', 7, {
        merge_method: 'squash',
        commit_title: 'PR title',
        commit_message: 'detail',
        sha: 'headsha',
    }, 'tok');

    assert.equal(result.merged, true);
    const call = fetchMock.calls[0];
    assert.equal(call.options.method, 'PUT');
    assert.match(call.url, /\/repos\/o\/r\/pulls\/7\/merge$/);
    assert.deepEqual(JSON.parse(call.options.body), {
        merge_method: 'squash',
        commit_title: 'PR title',
        commit_message: 'detail',
        sha: 'headsha',
    });
});

test('mergePullRequest surfaces 405 (not mergeable) with status on the error', async () => {
    const fetchMock = makeFetchMock(async () => ({
        ok: false,
        status: 405,
        body: { message: 'Pull Request is not mergeable' },
    }));
    const api = loadGitHubAPI(fetchMock);

    await assert.rejects(
        api.mergePullRequest('o', 'r', 7, { merge_method: 'merge' }, 'tok'),
        (err) => {
            assert.equal(err.status, 405);
            assert.match(err.message, /not mergeable/i);
            return true;
        }
    );
});

test('mergePullRequest surfaces 409 (sha changed) with status on the error', async () => {
    const fetchMock = makeFetchMock(async () => ({
        ok: false,
        status: 409,
        body: { message: 'Head branch was modified. Review and try the merge again.' },
    }));
    const api = loadGitHubAPI(fetchMock);

    await assert.rejects(
        api.mergePullRequest('o', 'r', 7, { merge_method: 'merge', sha: 'stale' }, 'tok'),
        (err) => err.status === 409
    );
});

test('getPullRequest fetches /repos/{owner}/{repo}/pulls/{n}', async () => {
    const fetchMock = makeFetchMock(async () => ({ body: { number: 7, mergeable: true, mergeable_state: 'clean' } }));
    const api = loadGitHubAPI(fetchMock);
    const pr = await api.getPullRequest('o', 'r', 7);
    assert.equal(pr.mergeable, true);
    assert.equal(pr.mergeable_state, 'clean');
    assert.match(fetchMock.calls[0].url, /\/repos\/o\/r\/pulls\/7$/);
});
