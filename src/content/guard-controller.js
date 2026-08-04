(function (root) {
  'use strict';

  class GuardController {
    constructor({ document, MutationObserver, ui }) {
      this.document = document;
      this.MutationObserver = MutationObserver;
      this.ui = ui;
      this.observer = null;
      this.scheduled = false;
    }

    scan = () => {
      this.scheduled = false;
      try {
        this.ui.injectStyles(this.document);
        this.ui.findResolveActions(this.document)
          .forEach((action) => this.ui.protectAction(action, this.document));
      } catch (_) {
        // GitLab may alter its DOM at any time; preserving page functionality is safer than throwing.
      }
    };

    scheduleScan = () => {
      if (this.scheduled) return;
      this.scheduled = true;
      const queue = root.queueMicrotask || ((callback) => Promise.resolve().then(callback));
      queue(this.scan);
    };

    start() {
      if (this.observer) return;
      this.scan();
      if (!this.MutationObserver || !this.document.documentElement) return;
      this.observer = new this.MutationObserver(this.scheduleScan);
      this.observer.observe(this.document.documentElement, { childList: true, subtree: true });
    }

    stop() {
      if (this.observer) this.observer.disconnect();
      this.observer = null;
      this.scheduled = false;
    }
  }

  root.GitLabConflictGuard = root.GitLabConflictGuard || {};
  root.GitLabConflictGuard.GuardController = GuardController;
  if (typeof module !== 'undefined') module.exports = { GuardController };
})(typeof globalThis !== 'undefined' ? globalThis : this);
