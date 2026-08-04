(function (root) {
  'use strict';

  const DEFAULTS = Object.freeze({
    domains: ['gitlab.com']
  });

  function normalizeDomains(input) {
    const values = Array.isArray(input) ? input : String(input || '').split(/[\n,]/);
    return [...new Set(values.map((value) => String(value).trim().toLowerCase()
      .replace(/^https?:\/\//, '').replace(/\/.*$/, '')))].filter(Boolean);
  }

  function sanitizeSettings(value) {
    return {
      domains: normalizeDomains(value && value.domains).length
        ? normalizeDomains(value.domains) : DEFAULTS.domains.slice()
    };
  }

  async function loadSettings(storage) {
    if (!storage || !storage.sync) return { ...DEFAULTS, domains: DEFAULTS.domains.slice() };
    const saved = await storage.sync.get(DEFAULTS);
    return sanitizeSettings(saved);
  }

  async function loadManagedDomains(storage) {
    if (!storage || !storage.managed) return null;
    try {
      const managed = await storage.managed.get(null);
      if (!Object.prototype.hasOwnProperty.call(managed, 'allowedGitLabDomains')) return null;
      return normalizeDomains(managed.allowedGitLabDomains);
    } catch (_) {
      return null;
    }
  }

  async function loadEffectiveSettings(storage) {
    const managedDomains = await loadManagedDomains(storage);
    if (managedDomains !== null) return { domains: managedDomains, managed: true };
    const local = await loadSettings(storage);
    return { ...local, managed: false };
  }

  root.GitLabConflictGuard = root.GitLabConflictGuard || {};
  root.GitLabConflictGuard.settings = { DEFAULTS, normalizeDomains, sanitizeSettings, loadSettings, loadManagedDomains, loadEffectiveSettings };

  if (typeof module !== 'undefined') module.exports = root.GitLabConflictGuard.settings;
})(typeof globalThis !== 'undefined' ? globalThis : this);
