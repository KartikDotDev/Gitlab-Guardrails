const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDomains, sanitizeSettings, DEFAULTS } = require('../src/shared/settings.js');
const { loadEffectiveSettings } = require('../src/shared/settings.js');
const { isAllowedHost } = require('../src/content/domain-gate.js');
const { isResolveAction } = require('../src/content/conflict-ui.js');

test('normalizes GitLab domains from textarea input', () => {
  assert.deepEqual(normalizeDomains(' https://GitLab.com/path\ngitlab.example,gitlab.com '), ['gitlab.com', 'gitlab.example']);
});

test('uses safe defaults for empty settings', () => {
  assert.deepEqual(sanitizeSettings({ domains: '' }), DEFAULTS);
});

test('only activates for an exact configured hostname', () => {
  assert.equal(isAllowedHost('gitlab.example', ['gitlab.example']), true);
  assert.equal(isAllowedHost('evil-gitlab.example', ['gitlab.example']), false);
  assert.equal(isAllowedHost('sub.gitlab.example', ['gitlab.example']), false);
});

test('managed domains override local domains, including an explicit empty policy', async () => {
  const storage = {
    sync: { get: async () => ({ domains: ['personal.gitlab.test'] }) },
    managed: { get: async () => ({ allowedGitLabDomains: [] }) }
  };
  assert.deepEqual(await loadEffectiveSettings(storage), { domains: [], managed: true });
});

test('recognizes GitLab conflict actions by label or conflict URL', () => {
  const action = (text, href) => ({
    textContent: text,
    matches: () => true,
    getAttribute: (name) => name === 'href' ? href : null
  });
  assert.equal(isResolveAction(action('Resolve conflicts', null)), true);
  assert.equal(isResolveAction(action('Open', '/group/project/-/merge_requests/3/conflicts')), true);
  assert.equal(isResolveAction(action('Merge', '/merge')), false);
});
