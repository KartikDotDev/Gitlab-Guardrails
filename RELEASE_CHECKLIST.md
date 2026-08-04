# Release checklist: v0.1.0

## ✅ Completed

- Manifest V3 validated; version is `0.1.0`.
- Replaced broad required host access with optional per-domain permissions and dynamic content-script registration.
- Added CSP, service worker, PNG icons, packaging, linting, tests, and GitHub Actions.
- Kept configuration focused on exact GitLab domains; the extension shows a fixed local-resolution checklist and always blocks web conflict resolution.
- Added Chrome Enterprise managed storage support for organization-controlled domains.
- Added `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `PRIVACY.md`, store listing copy, and release notes.
- Recorded the complete audit and its resolutions in `RELEASE_AUDIT.md`.
- Confirmed no analytics, telemetry, tracking, or external requests in extension code.

## ⚠ Manual work remaining

- Replace the promotional placeholders in `assets/store/` with final artwork. The supplied demo has been converted to a real 1280×800 screenshot; Chrome Web Store still requires a 440×280 promotional image.
- Replace the `OWNER/REPOSITORY` README badge target with the actual GitHub owner/repository.
- Test the blocking behavior on each GitLab version/domain you intend to support.
- For managed deployments, configure and verify both policies in `ENTERPRISE.md`.
- Create a Chrome Web Store developer account, complete its privacy fields consistently with `PRIVACY.md`, and upload the generated ZIP.
- Review the rendered extension icon and all store assets at their required sizes.

## ❌ Blockers

- This workspace has no usable Git repository metadata or GitHub remote, so a branch, commit, and pull request cannot be created from here.
- Do not submit placeholder screenshots or promotional artwork to the Chrome Web Store.
