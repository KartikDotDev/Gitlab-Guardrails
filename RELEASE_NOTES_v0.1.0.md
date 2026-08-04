# Release notes: v0.1.0

## Summary

This first public release packages GitLab Conflict Guard as a least-privilege Manifest V3 extension. It preserves the existing conflict-resolution warning behavior while making installation, configuration, testing, packaging, and policy review ready for open-source distribution.

## New files

- `src/background/service-worker.js` dynamically registers the guard only on approved domains.
- `policy-schema.json` and `ENTERPRISE.md` define organization-managed allowed domains and deployment steps.
- `assets/icons/` contains required PNG extension icons.
- `assets/store/` contains dimension-correct placeholders for required store graphics.
- `scripts/` provides asset generation, release linting, build, and ZIP packaging.
- `.github/` provides templates and CI.
- `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `PRIVACY.md`, `STORE_LISTING.md`, `RELEASE_CHECKLIST.md`, and `RELEASE_AUDIT.md` provide release-facing documentation.

## Changed files

- `manifest.json` now declares version `0.1.0`, icons, restrictive CSP, service worker, and optional rather than global host permissions.
- Settings and options validate exact GitLab domains; the local-resolution checklist is fixed in the extension.
- Managed Chrome policies override local domain settings and make the Options page read-only.
- The content controller now cleans up its observer on page lifecycle changes and safely restarts after a persisted page restore.
- `README.md` documents the product, configuration, limitations, development, build, test, and contribution workflow.

## Manual publication steps

1. Replace placeholder promotional graphics with approved product artwork. A 1280×800 demo screenshot is included.
2. Update the GitHub badge repository path in `README.md`.
3. Run `npm run package` and upload `dist/gitlab-conflict-guard-v0.1.0.zip` to the Chrome Web Store.
4. Paste the text from `STORE_LISTING.md`, select Developer Tools, and complete privacy disclosures using `PRIVACY.md`.
5. Create a GitHub repository/remote if one is not already available, commit the release changes, open a PR, merge it, tag `v0.1.0`, and create a GitHub Release using these notes.

## Chrome Web Store checklist

- Upload the ZIP built from this revision.
- Upload a real 1280×800 screenshot and 440×280 promo tile; add the 1400×560 marquee tile if desired.
- Confirm the 128×128 icon is present and readable.
- Confirm listing copy, privacy answers, and permissions match the implementation.
- Test the installed package on each supported GitLab instance before submitting.

## GitHub release checklist

- Confirm CI passes.
- Confirm no placeholder assets or `OWNER/REPOSITORY` remains.
- Review the diff and license copyright holder.
- Merge the release PR, tag `v0.1.0`, and publish a GitHub Release with these notes.
