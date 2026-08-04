(function (root) {
  'use strict';
  const { settings } = root.GitLabConflictGuard;
  const domains = document.getElementById('domains');
  const status = document.getElementById('status');
  const managedMessage = document.getElementById('managed-message');

  function originPatterns(configuredDomains) {
    return configuredDomains.flatMap((domain) => [`https://${domain}/*`, `http://${domain}/*`]);
  }

  async function restore() {
    const config = await settings.loadEffectiveSettings(chrome.storage);
    domains.value = config.domains.join('\n');
    domains.disabled = config.managed;
    document.getElementById('save').disabled = config.managed;
    managedMessage.hidden = !config.managed;
  }
  document.getElementById('save').addEventListener('click', async () => {
    const config = settings.sanitizeSettings({ domains: domains.value });
    const granted = await chrome.permissions.request({ origins: originPatterns(config.domains) });
    if (!granted) {
      status.textContent = 'Domain access was not granted; settings were not saved.';
      return;
    }
    await chrome.storage.sync.set(config);
    domains.value = config.domains.join('\n');
    status.textContent = 'Saved.';
    setTimeout(() => { status.textContent = ''; }, 1800);
  });
  restore().catch(() => { status.textContent = 'Unable to load settings.'; });
})(typeof globalThis !== 'undefined' ? globalThis : this);
