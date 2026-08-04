# Contributing

Thanks for helping improve GitLab Conflict Guard.

## Development setup

Use Node.js 18 or newer. No dependency installation is required.

```sh
npm test
npm run lint
npm run build
```

Load the repository root as an unpacked extension in Chrome. Use a GitLab test project or a temporary DOM fixture to verify changes without affecting production work.

## Pull requests

- Keep changes small and focused on the guardrail.
- Preserve least-privilege permissions and the no-network, no-telemetry policy.
- Add or update tests for behavior changes.
- Run `npm test`, `npm run lint`, and `npm run build` before opening a pull request.
- Explain any selector changes and how you tested them against GitLab.

## Reporting vulnerabilities

Do not include sensitive GitLab data in a public issue. Open a private security advisory through GitHub when available, or contact the maintainers through the repository's published contact channel.
