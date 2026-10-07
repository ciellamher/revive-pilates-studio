# Revive Pilates Studio — Client

The React frontend for Revive Pilates Studio: class schedule, spot picking, packages, bookings, and the admin dashboard.

---

### 01 — INSTALL

```bash
cd client
npm install
cp .env.example .env
```

> Runs on a simulated backend by default. Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000` to use the real API.

---

### 02 — RUN

```bash
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

---

### 03 — WHAT'S INSIDE

- `src/pages/` — One component per route, including the admin dashboard.
- `src/api/` — Calls to the Express API, with the mock backend for demo mode.
- `src/components/` — UI built in atomic design: `atoms/`, `molecules/`, `organisms/`.
- `.env.production` — Public API URL used by every production build. No secrets.
- `vercel.json` — Hosting config for the Vercel deployment.

---

### 04 — LICENSE

MIT. See [LICENSE](../LICENSE).
