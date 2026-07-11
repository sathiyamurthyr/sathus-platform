# Admin Dashboard

Internal admin dashboard for hospital analytics built on Next.js 15 (App Router).

## Features

Admin Dashboard APIs exposing optimized SQL-backed analytics:

- **Daily Patients** – daily visit volume by type (OPD / IPD / Emergency) and unique patients.
- **Revenue** – gross, discount, paid revenue and outstanding by day and department.
- **Doctor Performance** – visits, completion, revenue and average consult time per doctor.
- **Queue Statistics** – per-department wait/service times and ticket disposition.
- **Bed Occupancy** – real-time bed utilization by ward.

## Getting started

```bash
npm install
cp .env.example .env.local   # set DATABASE_URL
npm run dev
```

API base: `/api/admin/analytics`

| Endpoint | Query params |
| --- | --- |
| `GET /api/admin/analytics/daily-patients` | `from`, `to` (ISO dates) |
| `GET /api/admin/analytics/revenue` | `from`, `to`, `department?` |
| `GET /api/admin/analytics/doctor-performance` | `from`, `to`, `department?`, `limit?` |
| `GET /api/admin/analytics/queue-statistics` | `from`, `to`, `department?` |
| `GET /api/admin/analytics/bed-occupancy` | `ward?` |
| `GET /api/admin/analytics/overview` | `from`, `to` |

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run lint` – eslint
- `npm run typecheck` – `tsc --noEmit`
- `npm run test` – vitest
