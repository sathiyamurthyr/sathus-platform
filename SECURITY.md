# Security Policy

## Supported Versions

Sathus Platform is in active development. Only the latest released minor line
receives security fixes.

| Version | Supported |
| --- | --- |
| `0.1.x` | :white_check_mark: |
| `< 0.1.0` | :x: |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Instead, please report privately using one of the following channels:

- **GitHub Private Vulnerability Reporting:** use the
  *Security → Report a vulnerability* flow on the repository.
- **Email:** security@sathus.example (replace with the project's real address).

Please include:

- A description of the vulnerability and its impact.
- Steps to reproduce, or a proof-of-concept.
- Affected versions, environments, and configurations.
- Any suggested remediation, if known.

## What to Expect

- **Acknowledgement:** within 3 business days.
- **Triage & severity assessment:** within 5 business days.
- **Status updates:** at least every 7 days until resolution.
- **Disclosure:** coordinated with the reporter; fixes are released via the
  supported version line and credited (unless anonymity is requested).

## Security Best Practices (for Contributors)

- All database access must use parameterized queries (no string concatenation).
- Validate and constrain all external input (API query params, headers, env).
- Never commit secrets, credentials, or `.env` files (see `.gitignore`).
- Prefer least-privilege database and cloud roles.
- Keep dependencies current and review PRs via the recommended dependency
  review / CodeQL workflows described in `CONTRIBUTING.md`.
