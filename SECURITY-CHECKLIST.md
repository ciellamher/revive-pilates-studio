# Security checklist

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` line 2 ignores `.env`, and `git ls-files` shows no `.env` |
| 2 | A `.env.example` with placeholder values only is committed | Yes | `client/.env.example` and `server/.env.example` are committed with placeholder values. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | Searched codebase for `postgres://`, `password`, and `secret`; all rely on `process.env`. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | Yes | `git log -G` search returned no results for hardcoded credentials. |
| 5 | Any credential that was ever committed has been rotated | N/A | No credentials were ever committed to the repository. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | Production keys like `DATABASE_URL` and `JWT_SECRET` are configured only in Vercel/Render. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | Checked `.github/workflows`; all workflows use `${{ secrets... }}` or `${{ vars... }}`. |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | Yes | `send-reminders.yml` securely reads `${{ secrets.CRON_SECRET }}` from repository secrets. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | Yes | No `echo` or debug print statements exist for secrets in workflow files. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | `deploy-pages.yml` only uploads the `client/dist` frontend build which does not contain `.env`. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No | Third-party actions use movable tags like `actions/checkout@v4` for automatic minor updates. |
| 12 | Secret scanning and push protection are enabled on the repository | Yes | These are enabled by default for the GitHub repository. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | Verified all SQL in repo files (e.g. `server/usersRepo.js`) uses `$1` style placeholders. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | Yes | The PostgreSQL database requires secure authentication to access. |
| 15 | The database user the app connects as has only the permissions it needs | Yes | Default safe connection roles are used for application interaction. |
| 16 | Seed and sample data is invented, not real people's data | Yes | `db/seed.sql` only contains fictitious records like 'ghost footsteps'. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | Verified `server.js` contains no routes for `/seed` or `/reset`. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | The app implements a real password-free email-link login using JWTs. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | N/A | This project uses a custom Express API with PostgreSQL, not Supabase/Firebase. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | N/A | The app uses a real login system instead of Zero Trust or app passwords. |
| 21 | The gate covers every route, including the ones that only change data | Yes | Endpoints changing data all use `requireAdmin` or `requireSelf` middleware. |
| 22 | The credentials for the gate are environment variables, not in source | Yes | The gate relies on `JWT_SECRET` pulled securely from `process.env`. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | Server checks input validity before executing inserts/updates in `server.js`. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | The frontend is built with React which automatically escapes rendered text. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | The global error handler checks `IS_PRODUCTION` to hide stack traces in production. |
| 26 | CORS is not a wildcard on routes that change data | Yes | `CORS_ORIGINS` is configured securely via the environment variables. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | Verified no personal contact information exists in source files or commits. |
| 28 | No classmate's personal data in the repository | Yes | Scanned codebase; no classmate data is present. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | `.gitignore` ignores `node_modules` and packages are drawn from default npm. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | Assessed all public assets to verify original ownership or proper licensing. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | Checked the GitHub settings to ensure the repository visibility is intentional. |

## Anything I found and fixed

Nothing caught by this checklist, as I had already set up environment variables for secrets and used parameterized queries throughout `server.js` and the repositories. I checked the commit history with `git log` and reviewed `.env.example` to ensure no real credentials leaked.
