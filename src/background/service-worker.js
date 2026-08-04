importScripts('../shared/settings.js');

(function () {
  'use strict';

  const SCRIPT_ID = 'gitlab-conflict-guard';
  const FILES = [
    'src/shared/settings.js',
    'src/content/domain-gate.js',
    'src/content/conflict-ui.js',
    'src/content/guard-controller.js',
    'src/content/index.js'
  ];

  function matchesFor(domains) {
    return domains.flatMap((domain) => [`https://${domain}/*`, `http://${domain}/*`]);
  }

  async function registerGuard(domains) {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }).catch(() => {});
    const matches = matchesFor(domains);
    const granted = await chrome.permissions.contains({ origins: matches });
    if (!granted || !matches.length) return;
    await chrome.scripting.registerContentScripts([{ id: SCRIPT_ID, js: FILES, matches, runAt: 'document_idle', persistAcrossSessions: true }]);
  }

  async function refreshRegistration() {
    const config = await self.GitLabConflictGuard.settings.loadEffectiveSettings(chrome.storage);
    await registerGuard(config.domains);
  }

  chrome.runtime.onInstalled.addListener(() => { refreshRegistration().catch(() => {}); });
  chrome.runtime.onStartup.addListener(() => { refreshRegistration().catch(() => {}); });
  chrome.storage.onChanged.addListener((changes, area) => {
    if ((area === 'sync' && changes.domains) || area === 'managed') refreshRegistration().catch(() => {});
  });
})();
