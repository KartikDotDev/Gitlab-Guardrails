(function (root) {
  'use strict';
  const app = root.GitLabConflictGuard;
  if (!app || !root.chrome || !chrome.storage) return;

  async function start() {
    try {
      const config = await app.settings.loadEffectiveSettings(chrome.storage);
      if (!app.domainGate.isAllowedHost(root.location.hostname, config.domains)) return;
      const controller = new app.GuardController({
        document: root.document,
        MutationObserver: root.MutationObserver,
        ui: app.conflictUi
      });
      controller.start();
      root.addEventListener('pagehide', () => controller.stop());
      root.addEventListener('pageshow', (event) => { if (event.persisted) controller.start(); });
    } catch (_) {
      // A storage or DOM failure must never interfere with GitLab.
    }
  }
  start();
})(typeof globalThis !== 'undefined' ? globalThis : this);
