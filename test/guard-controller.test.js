const test = require('node:test');
const assert = require('node:assert/strict');
const { GuardController } = require('../src/content/guard-controller.js');

test('controller scans initially and observes SPA DOM changes', () => {
  let callback;
  let observed = false;
  const observer = class { constructor(cb) { callback = cb; } observe() { observed = true; } disconnect() {} };
  let disabled = 0;
  const document = { documentElement: {}, head: {}, querySelectorAll() { return []; } };
  const ui = { injectStyles() {}, findResolveActions() { return ['action']; }, protectAction() { disabled++; } };
  const controller = new GuardController({ document, MutationObserver: observer, ui });
  controller.start();
  assert.equal(disabled, 1);
  assert.equal(observed, true);
  callback();
  return Promise.resolve().then(() => assert.equal(disabled, 2));
});

test('controller contains DOM failures', () => {
  const controller = new GuardController({ document: { documentElement: {} }, ui: { injectStyles() { throw Error('changed'); } } });
  assert.doesNotThrow(() => controller.scan());
});
