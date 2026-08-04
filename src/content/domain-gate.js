(function (root) {
  'use strict';

  function isAllowedHost(hostname, domains) {
    return domains.includes(String(hostname || '').toLowerCase());
  }

  root.GitLabConflictGuard = root.GitLabConflictGuard || {};
  root.GitLabConflictGuard.domainGate = { isAllowedHost };

  if (typeof module !== 'undefined') module.exports = root.GitLabConflictGuard.domainGate;
})(typeof globalThis !== 'undefined' ? globalThis : this);
