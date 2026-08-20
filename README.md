# UserManager

A production-ready fullstack **user-management** application: a NestJS + TypeORM
backend and a React (Vite + Redux Toolkit) frontend, deployed as a **single
origin** (Nest serves the built frontend and the API from the same host).

- **Backend:** NestJS 10, TypeORM, SQLite (local/dev) or PostgreSQL (production)
- **Frontend:** React 18, Vite, Redux Toolkit, React Hook Form, Tailwind CSS
- **Auth:** Email/password login with **JWT** (bcrypt-hashed credentials)
- **Deploy:** One Render free-tier Web Service + free PostgreSQL

## Architecture

```
NestJS (port 3000)
├── /api/auth/login   → public, returns a JWT
├── /api/users/**     → protected (JWT bearer token required)
└── /*                → serves the built React app (SPA fallback)
```

Because the API and UI share one origin, **no CORS configuration is required**.

## Local development

Backend (root):

```bash
npm install
cp .env.example .env          # optional; sensible defaults are provided
npm run start:dev
```

Frontend (separate terminal):

```bash
cd client
npm install
npm run dev                   # http://localhost:5173 (proxies /api → :3000)
```

The Vite dev server proxies `/api` to the backend, so the frontend and API
are same-origin during development too.

### Seeding an admin (local)

Set the following in `.env` to create the first admin user on first boot:

```env
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=change-me-123
JWT_SECRET=any-dev-secret
```

Then open the app, sign in at `/login`, and use the UI.

## Testing

```bash
# Backend typecheck
npm run typecheck

# End-to-end API tests (isolated SQLite DB, logs in via JWT)
npm run test:e2e
```

The E2E suite spins up the full app against a temporary SQLite database, seeds
an admin, authenticates, and exercises the user CRUD endpoints.

## Environment variables

| Variable                | Default        | Description                                                        |
| ----------------------- | -------------- | ------------------------------------------------------------------ |
| `NODE_ENV`              | `development`  | `production` ignores `.env` and relies on platform env vars        |
| `PORT`                  | `3000`         | HTTP port                                                          |
| `RATE_LIMIT`            | `20`           | Requests per 60s window per IP                                     |
| `DB_TYPE`               | `sqlite`       | `sqlite` \| `postgres`                                             |
| `DB_SQLITE_PATH`        | `./local.sqlite` | SQLite file (dev)                                                |
| `DATABASE_URL`          | —              | Postgres connection string (preferred when provided)               |
| `DB_HOST`/`DB_PORT`/... | localhost      | Individual Postgres connection fields (fallback)                   |
| `DB_SSL`                | auto           | Auto-enabled for `render.com` / `rds.amazonaws.com` URLs           |
| `DB_SYNCHRONIZE`        | sqlite: true   | Use `false` in production (migrations instead)                    |
| `DB_MIGRATIONS_RUN`     | postgres: true | Run migrations on boot                                             |
| `JWT_SECRET`            | —              | **Required in production**; signs JWTs                             |
| `JWT_EXPIRES_IN`        | `7d`           | Token lifetime                                                     |
| `ADMIN_SEED_EMAIL`      | —              | Seed admin email (only used if no admin exists)                    |
| `ADMIN_SEED_PASSWORD`   | —              | Seed admin password (only used if no admin exists)                 |
| `CORS_ORIGINS`          | —              | Optional; not needed for single-origin deployment                 |

Frontend (`client/.env`):

| Variable        | Default | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| `VITE_API_URL`  | `/api`  | API base URL (leave empty for same-origin)   |

## Database migrations

Schema changes are versioned with TypeORM migrations (driver-agnostic Table API
so they run on both SQLite and PostgreSQL).

```bash
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
```

In production, migrations run automatically on boot (`DB_MIGRATIONS_RUN=true`).

## Deploying to Render (free tier)

`render.yaml` defines a Blueprint: one Web Service plus a free PostgreSQL
database. On Render:

1. New → **Blueprint**, connect this repo.
2. Set **secret** env vars in the dashboard (not committed to git):
   - `JWT_SECRET` (generate: `openssl rand -base64 48`)
   - `ADMIN_SEED_EMAIL`
   - `ADMIN_SEED_PASSWORD`
   - `CORS_ORIGINS` (leave blank for single-origin)
3. Deploy. The build command installs deps, builds the backend, then builds the
   frontend; the start command is `node dist/main`.

The app is served at `https://<service>.onrender.com` and is immediately
usable: visit `/login`, sign in with the seeded admin, and manage users.

## API reference

All `/api/users` routes require `Authorization: Bearer <token>`.

| Method   | Path            | Auth | Description                  |
| -------- | --------------- | ---- | ---------------------------- |
| `POST`   | `/api/auth/login` | No | Body `{ email, password }` → `{ access_token }` |
| `GET`    | `/api/users`    | Yes  | List users                   |
| `GET`    | `/api/users/:id`| Yes  | Get one user                 |
| `POST`   | `/api/users`    | Yes  | Create user (atomic)         |
| `PATCH`  | `/api/users/:id`| Yes  | Update user                  |
| `DELETE` | `/api/users/:id`| Yes  | Delete user                  |

Errors return a standardized envelope:

```json
{ "error": true, "code": "HTTP_422", "message": "...", "timestamp": "..." }
```

## Scripts

Backend (root): `build`, `start`, `start:dev`, `start:prod`, `typecheck`,
`test:e2e`, `migration:generate`, `migration:run`.

Frontend (`client`): `dev`, `build`, `preview`, `typecheck`.
