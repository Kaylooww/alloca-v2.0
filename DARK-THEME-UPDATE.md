# Alloca — dark theme update

**Give every money a purpose**

## What changed

Alloca now has Light, Dark and System appearance choices. System is the default and follows your device. Use the sun/moon/monitor buttons in the dashboard header, login/register pages or landing page, or open **Profile & settings → Make yourself comfortable**.

Dark uses soft charcoal surfaces, off-white text and muted mint accents. Forms, dialogs, menus, alerts, transactions, savings and reports adapt together. Charts keep their category colors with a gentler, brighter dark-mode palette. The setting is saved on this device and works offline; it is independent of your account and is retained after logout. Clearing browser/app storage resets it. Other devices have their own setting.

## Update your deployed app

1. Back up your repository. Merge this ZIP's `alloca` files into the existing project, preserving your deployment environment variables and any personal customizations. `DARK-THEME-CHANGED-FILES.txt` lists changes from the preceding offline-enabled download.
2. Run `npm ci`, `npm test` and `npm run build`. Keep the existing build command: it also stamps the service worker with the new build version.
3. Push to GitHub and let Vercel redeploy. Keep using the same Supabase and Turso projects. This theme update needs no new environment variables or database migration. If you have not installed the earlier offline update, follow `OFFLINE-UPDATE.md` for its database migration first.
4. On your phone, connect to the internet and open Alloca. Allow the new offline assets to download, then close and reopen the app. If the old interface remains, reload once while online. Wait for **Offline ready** before testing airplane mode.

Do not clear app storage or uninstall while there are unsynced changes. A theme update does not require either action.

## Quick check after deployment

- Choose Dark: check the dashboard, expense dialog, savings, reports and settings.
- Close/reopen the installed app: the choice should remain.
- Switch to System, then change the phone's appearance: Alloca should follow.
- After Offline ready, enable airplane mode and reopen: the saved theme and offline budgeting should still work.
- Return online and confirm pending changes sync normally.

Automated contrast checks cover the principal dark text/background pairs at 4.5:1 or higher and focus/chart accents at 3:1 or higher. Production build and 31 tests pass. Physical phone behavior and visual appearance should be checked on your deployment; they have not been tested on your phone.
