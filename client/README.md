# Revive Pilates Studio — Client

The React frontend for Revive Pilates Studio: class schedule, spot picking, packages, bookings, and the admin dashboard.

---

### 01 — INSTALL

```bash
cd client
npm install
cp .env.example .env
```

> Start the API first (see the main README). `VITE_API_BASE_URL` points the client at it: `http://localhost:3000` locally.

---

### 02 — RUN

```bash
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

---

### 03 — WHAT'S INSIDE

- `src/pages/` — One component per route, including the admin dashboard.
- `src/api/` — Calls to the Express API, the signed-in session, and shared class and package rules.
- `src/components/` — Shared UI: `atoms/` and `organisms/`, from the atomic design plan.
- `.env.production` — Public API URL used by every production build. No secrets.
- `vercel.json` — Hosting config for the Vercel deployment.

---

### 04 — LICENSE

MIT. See [LICENSE](../LICENSE).
