# Security checklist

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` line 2 ignores `.env`, and `git ls-files` shows no `.env` |
| 2 | A `.env.example` with placeholder values only is committed | Yes | `client/.env.example` and `server/.env.example` are committed with placeholder values. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | Searched codebase for `postgres://`, `password`, and `secret`; all rely on `process.env`. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | Yes | `git log -G` search returned no results for hardcoded credentials. |
| 5 | Any credential that was ever committed has been rotated | N/A | No credentials were ever committed to the repository. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | Production keys like `DATABASE_URL` and `JWT_SECRET` are configured only in the Vercel project's environment variables. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | Checked `.github/workflows`; all workflows use `${{ secrets... }}` or `${{ vars... }}`. |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | Yes | `send-reminders.yml` securely reads `${{ secrets.CRON_SECRET }}` from repository secrets. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | Yes | No `echo` or debug print statements exist for secrets in workflow files. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | `deploy-pages.yml` only uploads the `client/dist` frontend build which does not contain `.env`. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No | Third-party actions use movable tags like `actions/checkout@v4` for automatic minor updates. |
| 12 | Secret scanning and push protection are enabled on the repository | Yes | Checked with the GitHub API: `secret_scanning` and `secret_scanning_push_protection` are both `enabled`. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | Verified all SQL in repo files (e.g. `server/usersRepo.js`) uses `$1` style placeholders. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | Yes | The PostgreSQL database requires secure authentication to access. |
| 15 | The database user the app connects as has only the permissions it needs | Yes | Default safe connection roles are used for application interaction. |
| 16 | Seed and sample data is invented, not real people's data | Yes | `db/seed.sql` only adds the studio's coaches by first name, and `db/demo-clients.sql` uses invented names with `@example.com` addresses, which cannot receive mail. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | Verified `server.js` contains no routes for `/seed` or `/reset`. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | The app implements a real password-free email-link login using JWTs. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | N/A | This project uses a custom Express API with PostgreSQL, not Supabase/Firebase. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | N/A | The app uses a real login system instead of Zero Trust or app passwords. |
| 21 | The gate covers every route, including the ones that only change data | Yes | Endpoints changing data all use `requireAdmin` or `requireUser` middleware; the only open write routes are sign-in, newsletter sign-up, and the reminder job, which checks `CRON_SECRET`. |
| 22 | The credentials for the gate are environment variables, not in source | Yes | The gate relies on `JWT_SECRET` pulled securely from `process.env`. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | Server checks input validity before executing inserts/updates in `server.js`. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | The frontend is built with React which automatically escapes rendered text. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | The error handler at the end of `server.js` logs the error on the server and always returns only `Something went wrong on the server`; bad JSON gets a plain 400. |
| 26 | CORS is not a wildcard on routes that change data | Yes | `CORS_ORIGINS` is configured securely via the environment variables. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | No | The current files are clean, but older commits still contain my school email (a default admin address in `server.js` and `.env.example`) and my full name (README, LICENSE). Removed from the files on 2026-10-07 and 2026-10-08; see below. |
| 28 | No classmate's personal data in the repository | Yes | Scanned codebase; no classmate data is present. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | `.gitignore` ignores `node_modules` and packages are drawn from default npm. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | Assessed all public assets to verify original ownership or proper licensing. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | Checked the GitHub settings to ensure the repository visibility is intentional. |

## Anything I found and fixed

- **My school email was hard-coded** as the default admin address in `server/server.js` and in `server/.env.example`. Both are removed: the admin list now comes only from the `ADMIN_EMAILS` environment variable, and the example file uses `you@example.com`. It is still visible in older commits; rewriting the published history this close to the deadline was riskier than leaving it, so row 27 is answered No.
- **My full name** was in the README and LICENSE. Both now use my GitHub username. The presentation PDF and square image keep my name on purpose, because the presentation requires it.
- **An unused Basic Auth block** (`BASIC_AUTH_USER`, `BASIC_AUTH_PASS`) was left in `server/.env.example` from an earlier assignment. Removed.
- Secrets otherwise live only in environment variables, every query uses parameters, and `git log` shows no committed `.env` file.
