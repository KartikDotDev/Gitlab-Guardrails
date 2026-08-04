# Enterprise deployment

GitLab Conflict Guard supports organization-managed GitLab domains through Chrome Enterprise managed storage. When the policy is present, it overrides local settings and the Options page becomes read-only.

## Extension policy

Configure this extension's managed policy with the following value:

```json
{
  "allowedGitLabDomains": [
    "gitlab.example.com"
  ]
}
```

Domains are exact hostnames. An explicitly empty list disables the guard for the organization. The policy is validated against `policy-schema.json` and can be checked on a managed browser at `chrome://policy`.

## Required Chrome deployment settings

Use Chrome Enterprise **ExtensionSettings** to force-install the extension and allow access only to the same GitLab hostnames. For example:

```json
{
  "YOUR_EXTENSION_ID": {
    "installation_mode": "force_installed",
    "runtime_allowed_hosts": [
      "https://gitlab.example.com/*"
    ]
  }
}
```

Replace `YOUR_EXTENSION_ID` with the Chrome Web Store extension ID after publication. Include an `http://` pattern only if your GitLab instance intentionally uses HTTP.

The managed domain list and `runtime_allowed_hosts` must remain aligned. Managed storage controls which domains the guard chooses; Chrome's extension policy controls the host access granted to the force-installed extension.

## Verification

1. Force-install the published extension through your Chrome Enterprise console.
2. Apply both policies above.
3. Open `chrome://policy` and reload policies; confirm the extension policy is listed.
4. Open Extension options; it should show **Managed by your organization** and disable edits.
5. Visit a configured GitLab merge request with conflicts and confirm the action is blocked.
