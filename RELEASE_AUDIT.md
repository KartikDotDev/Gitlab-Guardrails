# Release audit: v0.1.0

## Findings resolved

| Finding | Resolution |
| --- | --- |
| Static content scripts and required host permissions covered every HTTP(S) site. | Replaced with optional host permissions and dynamically registered scripts for saved exact GitLab domains only. |
| Manifest had no icons or explicit extension-pages CSP. | Added validated PNG icons at 16, 32, 48, and 128 pixels and a restrictive MV3 CSP. |
| No background lifecycle managed domain-scoped injection. | Added a minimal service worker that unregisters stale scripts and registers only granted domains. |
| Configuration needed to remain simple for the first release. | Kept validated exact GitLab domains and a fixed local-resolution checklist; the web action is always blocked. |
| Organizations could not centrally control allowed domains. | Added a managed-storage schema and Chrome Enterprise deployment guide; managed domains override local settings. |
| SPA observer did not clean up on page lifecycle changes. | Added stop/restart handling for page hide and back/forward cache restoration. |
| No release documentation, privacy policy, license, contribution guide, or changelog existed. | Added the required open-source and publication documents. |
| No CI, build, package, or release-file validation existed. | Added dependency-free scripts and GitHub Actions for test, lint, build, and package artifacts. |
| Required extension icons and store graphics were missing. | Added PNG icons plus exact-size, clearly marked store-art placeholders. |
| No issue/PR templates existed. | Added bug report, feature request, and PR templates. |

## Remaining external findings

| Finding | Why it cannot be fixed automatically |
| --- | --- |
| Promotional graphics are placeholders. | They must be replaced with truthful, approved product artwork before submission. A real 1280×800 demo screenshot is now included. |
| README CI badge has `OWNER/REPOSITORY`. | The destination GitHub repository was not provided. |
| GitLab UI compatibility is not verified against a real target instance. | It requires access to each GitLab version/domain the publisher supports. |
| No Git repository, remote, GitHub CLI, or GitHub authentication is available in this workspace. | A branch, commit, and pull request cannot be created here. |
