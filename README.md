# Alloca

**Give every money a purpose**

A full-stack, multi-file allowance and savings app you can upload to your own GitHub repository and deploy independently.

## Phone/offline update

Read **OFFLINE-UPDATE.md** before updating an existing Vercel installation. This version includes persistent sign-in cookies, an installable PWA, a complete cached budget workspace, IndexedDB storage, queued offline edits, conflict handling, and idempotent server sync. Run the new database migration before use.

## What changed in this download

- Anyone can register with an accessible email address: Gmail, Yahoo, Outlook, a custom domain, or a school email.
- Email/password registration and login, mandatory email confirmation, resend verification, password recovery, and logout.
- Supabase handles passwords, rate limits, verification codes, and authentication sessions. No ChatGPT login is required.
- Standard Next.js App Router, React, TypeScript, Supabase Auth, and Turso SQLite persistence.
- Preserved Alloca branding, weekly allowance, expenses, income, savings goals, categories, alerts, charts, exports, profile, and cycle history.

## Start here

Read **DEPLOYMENT.md** for complete Supabase, verification email, database, GitHub and Vercel setup. You need to configure your own services before real verification emails can be sent.

```bash
npm ci
```

Copy `.env.example` to `.env.local` and fill in your Supabase values. For local development, keep `TURSO_DATABASE_URL=file:alloca.db` and leave the database token empty.

```bash
npm run db:migrate
npm run dev
```

Open http://localhost:3000. No demo accounts or passwords are included.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run local Next.js development server |
| `npm run build` | Build production application |
| `npm start` | Run the built app |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run budget and auth boundary tests |
| `npm run db:generate` | Generate a migration after editing db/schema.ts |
| `npm run db:migrate` | Apply unapplied migrations with checksum verification |

Node.js 22.13+ and npm are required. Commit the included package-lock.json. Never commit .env.local, database files, or node_modules.

## Source map

- `app/`: independent pages, protected layouts, finance APIs, and separate auth API routes.
- `components/auth/`: registration/login form, verification, logout, and recovery.
- `components/branding/`: logo, wordmark, and brand header.
- `components/{dashboard,expenses,savings,reports,profile,layout,shared}/`: focused UI modules.
- `lib/auth/`: verified server identity, SSR session setup, validation boundaries.
- `lib/database/`: Turso/SQLite adapter and request-scoped write transactions.
- `services/`: budget, transaction, alerts, report logic.
- `db/schema.ts`, `drizzle/`, `scripts/migrate.mjs`: schema and repeatable migrations.
- `proxy.ts`: refreshed auth cookies for protected routes.
- `supabase/templates/`: copyable verification and password-reset email templates.
- `styles/`, `public/logo/`: responsive styling and custom SVG assets.
- `tests/`: actual SQLite adapter integration tests and mocked Supabase boundary tests.
- `.github/workflows/ci.yml`: type check, test and build on GitHub.

## Data rules

Amounts are integer centavos (PHP). Weeks begin Monday 00:00 in Asia/Manila. On the first request in a new week, the previous balance carries forward, including any deficit. Planned allowance becomes income only after receipt confirmation, once per cycle. Inactive weeks do not create invented income. The app refreshes every minute.

Available = carryover + received allowance + extra income − expenses − savings deposits + withdrawals. Savings cannot exceed available funds, and withdrawals cannot exceed goal balances. Actual expenses may produce a negative balance and a warning. Completed cycles remain immutable. Archiving a category preserves its history. All finance API calls require a verified user and are executed inside a serialized database write transaction; user IDs are always derived from the auth server.

This is a fresh independent deployment. Existing records in the earlier private preview are not included in this download. It contains no personal financial data or secrets.

## Verification limits

Automated tests use an isolated real SQLite database and mocked authentication-provider responses. A successful code verification is ultimately enforced by Supabase. Live email delivery and real sign-in require your Supabase project and SMTP configuration; they have not been exercised with your credentials. Follow the deployment checklist before inviting users.
