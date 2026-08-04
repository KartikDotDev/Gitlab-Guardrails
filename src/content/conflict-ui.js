(function (root) {
  'use strict';

  const GUARD_ATTRIBUTE = 'data-gitlab-conflict-guard';
  const ACTION_STATE = '__gitLabConflictGuardState';
  const RESOLVE_TEXT = /^resolve conflicts?$/i;
  const LOCAL_INSTRUCTIONS = `Resolve conflicts from your checkout instead:

1. Fetch the target branch.
2. Merge or rebase it into your source branch.
3. Resolve and test the conflicts locally.
4. Commit and push the result.`;

  function isResolveAction(element) {
    if (!element || !element.matches || !element.matches('a, button, [role="button"]')) return false;
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
    const href = element.getAttribute && element.getAttribute('href');
    return RESOLVE_TEXT.test(text) || Boolean(href && /\/conflicts(?:\/|$|\?)/i.test(href));
  }

  function findResolveActions(document) {
    if (!document || !document.querySelectorAll) return [];
    return [...document.querySelectorAll('a, button, [role="button"]')].filter(isResolveAction);
  }

  function makeNotice(document) {
    const notice = document.createElement('section');
    notice.setAttribute(GUARD_ATTRIBUTE, 'notice');
    notice.setAttribute('role', 'alert');
    notice.className = 'gitlab-conflict-guard-notice';
    notice.innerHTML = '<strong>Conflict resolution protected</strong><p>GitLab\'s web conflict resolution can merge the target branch into the source branch. Resolve this merge request locally instead.</p><details open><summary>Resolve locally</summary><pre></pre></details>';
    notice.querySelector('pre').textContent = LOCAL_INSTRUCTIONS;
    return notice;
  }

  function blockAction(action) {
    action.setAttribute('aria-disabled', 'true');
    action.setAttribute('tabindex', '-1');
    action.classList.add('gitlab-conflict-guard-disabled');
  }

  function protectAction(action, document) {
    if (!action) return;
    let state = action[ACTION_STATE];
    if (!state) {
      state = {};
      action[ACTION_STATE] = state;
      action.setAttribute(GUARD_ATTRIBUTE, 'action');
      action.addEventListener('click', (event) => {
        event.preventDefault(); event.stopImmediatePropagation();
      }, true);
      action.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); event.stopImmediatePropagation();
        }
      }, true);
    }
    blockAction(action);
    if (state.noticeInserted) return;
    state.noticeInserted = true;
    const next = action.nextElementSibling;
    if (next && next.getAttribute(GUARD_ATTRIBUTE) === 'notice') next.remove();
    const notice = makeNotice(document);
    action.insertAdjacentElement('afterend', notice);
  }

  function injectStyles(document) {
    if (document.getElementById('gitlab-conflict-guard-styles')) return;
    const style = document.createElement('style');
    style.id = 'gitlab-conflict-guard-styles';
    style.textContent = '.gitlab-conflict-guard-disabled{opacity:.55!important;cursor:not-allowed!important;pointer-events:none}.gitlab-conflict-guard-notice{margin:12px 0;padding:14px 16px;border:1px solid #d16b00;border-left-width:4px;border-radius:4px;background:#fff8e1;color:#332b00;font:14px/1.45 sans-serif}.gitlab-conflict-guard-notice p{margin:7px 0}.gitlab-conflict-guard-notice pre{margin:8px 0 0;white-space:pre-wrap;font:inherit}';
    (document.head || document.documentElement).appendChild(style);
  }

  root.GitLabConflictGuard = root.GitLabConflictGuard || {};
  root.GitLabConflictGuard.conflictUi = { findResolveActions, isResolveAction, protectAction, injectStyles, GUARD_ATTRIBUTE, LOCAL_INSTRUCTIONS };

  if (typeof module !== 'undefined') module.exports = root.GitLabConflictGuard.conflictUi;
})(typeof globalThis !== 'undefined' ? globalThis : this);
