# Alloca — allowance schedules and quick-start tutorial

**Give every money a purpose**

## What is new

- A six-step tutorial opens after account setup, once per account on each device/browser. Completing, skipping or closing it dismisses the automatic walkthrough. A small **Help** button at the bottom-right replays it on every dashboard page, including offline. Existing users see it once too. Clearing local browser storage resets the tutorial preference.
- **Daily** allowance presets: ₱50, ₱100, ₱150.
- **Weekly** allowance presets: ₱500, ₱1,000.
- **Monthly** allowance presets: ₱5,000, ₱10,000.
- Every schedule accepts a custom amount, including centavos. Picking a preset only fills the amount field; save to apply it.
- The account label now reads **Your account**. Dashboard wording welcomes everyone.
- Actual cycle dates, resets, allowance receipt protection, balance carryover, charts and offline calculations support all three schedules. Reports retain weekly and monthly filters alongside the current cycle and all-time history.

## Cycle behavior

All boundaries use Asia/Manila time. Daily resets at midnight; weekly resets Monday at midnight; monthly resets on the first day of the next calendar month. Month lengths and leap years are respected.

Existing accounts and history stay weekly until a user changes their plan. A schedule change takes effect after the current cycle ends. If that end falls partway through the new calendar period, the first new cycle is shorter so periods never overlap. Later cycles follow the normal boundaries. Amount changes apply to the next allowance receipt. Money is never added automatically; record receipt once per cycle, and use Extra income for additional money. Unspent funds carry forward; savings remain in their goals.

## Update your GitHub / Vercel deployment

1. Back up the repository and merge this ZIP's `alloca` files. Keep your own `.env.local` and Vercel environment variables. `ALLOWANCE-AND-TUTORIAL-CHANGED-FILES.txt` lists changes from the preceding dark-theme package.
2. Run `npm ci` locally.
3. **Before deploying the new code, run `npm run db:migrate` using your existing hosted Turso database settings.** This applies `0003_allowance_frequency.sql` and any missing earlier migrations. It adds frequency columns with a weekly default. Do not create a new database, reset tables or edit previously applied migration files.
4. Run `npm test` and `npm run build`, then commit and push to GitHub for Vercel to redeploy. Keep the build script's service-worker stamping step.
5. Open each installed app while online, wait for the update, and reopen/reload if it still shows the previous interface. Wait for **Offline ready** before airplane-mode testing. Sync any pending changes before testing schedule changes across multiple devices.

No new environment variables are required. Your Supabase email settings and existing authentication setup remain in use.

## Check after deploying

- Register with a verified email, finish profile setup, and check that the tutorial opens. Skip or finish, then replay using Help. Reload and confirm it no longer auto-opens on that device.
- Choose each schedule and preset in profile setup/settings; try a custom value and verify the saved amount.
- Record allowance once, then verify it cannot be received twice in that cycle.
- Confirm a schedule change keeps the current period until its displayed end. Check the next period and carried balance.
- Test light/dark themes and a narrow phone screen, including the tutorial's Back/Next/Skip/close controls.
- After Offline ready, disconnect, open Help, save a profile change or expense, reconnect and confirm syncing.

Automated checks cover schedule boundaries, calendar months, leap years, one receipt per cycle, balance carryover, offline/server agreement, concurrent profile edits and delayed offline schedule updates. Physical phone and live provider checks require your deployment.
