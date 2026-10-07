> Updating an existing deployment? Read [ALLOWANCE-AND-TUTORIAL-UPDATE.md](ALLOWANCE-AND-TUTORIAL-UPDATE.md) first. This release requires `npm run db:migrate` against your existing Turso database before deploying.

# Deploy Alloca from your GitHub

**Alloca — Give every money a purpose**

This project is a standard Next.js server application. GitHub stores its source. Deploy the app on Vercel or another Node.js host; GitHub Pages cannot run its server routes.

## 1. Unzip and install

Extract the ZIP, then open the `alloca` folder in VS Code. Open its terminal:

```bash
npm ci
```

Use Node.js 22.13 or newer. Copy `.env.example` to `.env.local`. On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

## 2. Set up Supabase authentication

1. Create a project at https://supabase.com.
2. In the project's API settings, copy the project URL and **publishable key** (the legacy anon key also works). Put these into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
3. In Authentication settings, enable email/password sign-up and **Confirm email**. Keep confirmation enabled: this app requires it.
4. Set minimum password length to at least 12 characters, consistent with the app. Supabase stores/hashes passwords; Alloca never writes passwords into its finance database.
5. Set the Site URL to `http://localhost:3000` during local development; later change it to your production HTTPS origin.
6. Set a short email OTP expiry, such as 10–30 minutes. Retain rate limiting. The app accepts 6–10 digit verification codes and a 60-second resend cooldown; server-side limits are enforced by Supabase.

### Configure the two email templates (required)

In Authentication → Email Templates:

- Replace **Confirm signup** body with `supabase/templates/confirm-signup.html`. Subject: `Verify your email for Alloca`.
- Replace **Reset password** body with `supabase/templates/reset-password.html`. Subject: `Reset your Alloca password`.

These templates use `{{ .Token }}`. The user copies the code into Alloca. Do not leave the default link-only templates active: this version verifies codes and does not depend on a callback URL.

### Allow verification emails to any email address (required for public use)

Configure **custom SMTP** in Supabase Authentication. Use an email service you control, such as Resend, Postmark, or another SMTP provider, with its required verified sender/domain. Enter the SMTP host, port, username, password, sender address and name in Supabase. Set the sender name to **Alloca**.

Supabase's default mail service restricts recipients and is intended for testing. It is not enough to enable registration for arbitrary Gmail/Yahoo/Outlook users. Your SMTP provider may also have sandbox restrictions; complete its sender and domain verification. SMTP credentials belong in Supabase, never in client code or GitHub. No school-domain allowlist exists in this application.

## 3. Database: local first, Turso for deployment

For local development, these values work:

```dotenv
TURSO_DATABASE_URL=file:alloca.db
TURSO_AUTH_TOKEN=
```

Run:

```bash
npm run db:migrate
npm run dev
```

To deploy:

1. Create a database at https://turso.tech or through the Turso integration in Vercel.
2. Copy its `libsql://...` connection URL and database auth token.
3. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to those remote values in `.env.local`, then run `npm run db:migrate` once against that database before opening the deployed dashboard.
4. Keep both values server-side. Do not prefix them with `NEXT_PUBLIC_`.

Use a remote database on Vercel. A `file:` database is suitable for local development, not Vercel's ephemeral filesystem. The migration command is safe to run again and checks already-applied SQL checksums. Never edit an applied migration; create another migration instead.

## 4. Upload to GitHub

Create an empty GitHub repository named `alloca`. Do not pre-create its README if using the commands below.

Inside the extracted `alloca` directory:

```bash
git init
git add .
git commit -m "Initial Alloca application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/alloca.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual username and sign in to GitHub when asked. GitHub Desktop also works. Commit the entire source folder, including `package.json`, `package-lock.json`, `app`, `lib`, `components`, `drizzle`, and the dotfolders. Do not upload the ZIP as the repository's only file.

`.gitignore` excludes credentials, local databases and dependencies. `.env.example` intentionally contains placeholders only.

## 5. Deploy on Vercel

1. At https://vercel.com, import the GitHub repository.
2. Framework preset: **Next.js**. Root directory: the folder containing `package.json` (normally repository root).
3. Install command: `npm ci`. Build command: `npm run build`. Keep the standard Next.js output setting.
4. Set all four environment variables from `.env.example`, using your real Supabase values and **remote** Turso values. Add them to the production environment; add separate values for previews if you use preview deployments.
5. Deploy. Database migration is intentionally not run in the build: run it explicitly against the intended database as described above.
6. Set Supabase's Site URL to your deployed HTTPS URL. If you change public environment variables, rebuild/redeploy the app.
7. New commits to the linked branch can redeploy automatically.

For other Node hosts, use `npm ci`, `npm run build`, then `npm start`. Supply the same variables and use a persistent remote database. This project includes no private-preview identity or hosting credentials.

## 6. Live acceptance checklist

- Register with a personal email address not belonging to your Supabase organization.
- Confirm the verification email arrives and the code works.
- Verify that a bad/expired code fails and an unverified account cannot access a dashboard.
- Resend a code and check cooldown/rate-limiting behavior.
- Set your name and allowance, confirm receipt, log an expense, create a goal, deposit savings and withdraw some.
- Refresh/reopen the app and confirm persisted balances.
- Log out; ensure protected pages and `/api/budget-cycles` cannot show your data.
- Create a second verified account and confirm it has no access to the first account's finances.
- Test the forgot-password flow and logging in with the new password.
- Check desktop and mobile widths on your actual deployment.

The included tests check calculations, real database operations and auth boundaries, but do not send real emails. Your service credentials and SMTP delivery must be tested after setup.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Verification email does not arrive | Custom SMTP enabled; sender/domain verified; provider out of sandbox; spam folder and Supabase auth logs |
| Email has a link but no code | Paste the included OTP template into Confirm signup and Reset password |
| Email confirmation configuration error | Enable Confirm email before users register |
| Dashboard says data is unavailable | Remote Turso URL/token correct; run `npm run db:migrate` on that database |
| Supabase configuration notice | Set both `NEXT_PUBLIC_SUPABASE_*` variables and rebuild |
| Works locally but data disappears after deploying | Replace `file:` with a hosted `libsql://` database |
| Existing preview data is missing | This ZIP creates an independent app and database; private-preview records are not bundled |

Official references:

- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://docs.turso.tech/sdk/ts/reference
- https://vercel.com/docs/frameworks/full-stack/nextjs

## Resend testing sender restriction

Do not use `onboarding@resend.dev` for general registrations. It can send only to the email associated with your Resend account. Verify your own domain in Resend and change Supabase’s SMTP Sender email to an address on that verified domain. See **REGISTRATION-FIX.md** for the exact configuration and code-update steps.

## Installed app and offline mode

See **OFFLINE-UPDATE.md** for upgrade instructions, session settings, offline readiness, device storage, and phone testing. New deployments also need `npm run db:migrate` before syncing. Keep the default `npm run build` command so the offline worker receives a new version for every build.
