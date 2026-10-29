# RoadWatch — Road Damage Reporting and Maintenance Management System

Frontend-only civic operations app. Citizens submit road damage reports, administrators verify and assign crews, and maintenance teams update repair progress.

Sample records in the seed data are fictional development records. Map markers use coordinates stored with each report; they are not independently verified field surveys.

## Requirements

- Node.js 18 or later
- A modern browser

There is no server, PostgreSQL database, or email/SMS delivery. Persistence uses browser LocalStorage (`roadwatch_db_v2` and `roadwatch_session_v2`).

## Setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — Oxlint

## Seed accounts

Passwords are stored as SHA-256 hashes. The shared seed password is `Watch#2026`.

| Role | Email |
|---|---|
| Citizen | `arjun.kumar@roadwatch.app` |
| Citizen | `priya.venkatesh@roadwatch.app` |
| Citizen | `karthik.selvam@roadwatch.app` |
| Administrator | `meena.raj@roadwatch.app` |
| Maintenance | `suresh.balan@roadwatch.app` |
| Maintenance | `lakshmi.devi@roadwatch.app` |

Citizens can also create accounts at `/register`. Staff accounts are not self-registered.

## Main routes

Public: `/`, `/login`, `/register`

Citizen: `/citizen`, `/citizen/report`, `/citizen/reports`, `/citizen/reports/:id`

Administrator: `/admin`, `/admin/verification`, `/admin/reports`, `/admin/reports/:id`, `/admin/analytics`

Maintenance: `/maintenance`, `/maintenance/tasks`, `/maintenance/tasks/:id`, `/maintenance/completed`

Shared (signed in): `/map`, `/notifications`, `/profile`

Administrators can restore original sample data from **Profile & settings → Reset development data**.

## Status workflow

Submitted → Under Review → Verified → Maintenance Assigned → In Progress → Resolved → Closed

Rejected (with a reason) is also supported. Transitions are validated in `src/services/reportService.js`. Route access is enforced in the React router only; this is not server-side authorization.

## Limitations

- No Express API or PostgreSQL. Closing or refreshing a different browser/profile starts from LocalStorage for that origin.
- Authentication and role checks run in the client.
- Uploaded images are stored as data URLs and must stay at or below 450 KB.
- Large LocalStorage usage can drop raster photos while keeping reports.
- Notifications are in-app only.
