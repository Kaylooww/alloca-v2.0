# Alloca: stay signed in and use your budget offline

**Give every money a purpose**

## Install this update on your existing deployment

1. Back up/commit your existing source changes. Merge this ZIP into your local GitHub checkout, preserving `.env.local` and any unrelated custom changes. This is an updated full source package; do not upload only the ZIP file to GitHub.
2. Run `npm ci` to use the updated lockfile.
3. Confirm `.env.local` points to the **same hosted Turso database** used by your existing Vercel deployment, then run:

```bash
npm run db:migrate
```

This adds `sync_operations` for duplicate-proof sync. Existing accounts, transactions, categories, and goals remain intact. Do not reset the database or remove previous migration files.

4. Run `npm test` and `npm run build`.
5. Commit and push to the Vercel-linked GitHub branch. Keep build command `npm run build`; it now also versions the offline service worker after each build.
6. Wait for Vercel to finish. Open the production HTTPS app on your phone while connected to the internet. If requested, log in once with your existing account, then open the budget.
7. Wait for **Offline ready · up to date** at the top. This confirms both a local budget and the offline app shell are available. If the old installation does not open the updated app, close and reopen it online; only reinstall if necessary, and never remove an installation with unsynced changes.
8. Enable airplane mode, close the app, and reopen it. Check an expense, add a small entry, visit savings/categories/reports, and reopen the app again. Restore internet and open Alloca to sync.

The offline workspace downloads all budget screens, not just the page you last visited. Development `npm run dev` intentionally does not register the worker; test offline behavior on HTTPS production or with `npm run build` then `npm start` on localhost.

## Staying signed in

Alloca uses persistent Supabase cookies with refresh tokens; closing the installed app is not a logout. The installed app opens its locally stored workspace without requiring an online authentication check first. Server synchronization still requires your verified account.

In Supabase Authentication session settings, leave **Time-box user sessions** and **Inactivity timeout** unset if you want sessions to persist, and do not enable **Single session per user** if signing in on another device should keep your phone signed in. Some controls depend on your plan. Keep the normal short-lived JWT/access-token setting: refresh tokens handle renewal. Do not disable token verification.

You may need to log in once inside the installed app even if the normal browser is already logged in; browser and installed-app storage can differ. A password reset, revoked session, explicit logout, cleared cookies/storage, or device/browser cleanup can still require online login. No web app can promise an account session will never expire or be revoked.

If reauthentication is required, the cached budget remains available and pending changes stay on the phone. Use **Sync details → Sign in again to sync**, with the same email account.

## What works without internet

| Feature | Offline behavior |
| --- | --- |
| Dashboard and balance | Calculated from saved data and pending changes |
| Allowance receipt | Queued once per allowance cycle |
| Expenses | Add, search, filter, edit/delete current-week expenses |
| Extra income | Saved immediately to the local queue |
| Savings | Create goals, deposit, withdraw with local balance validation |
| Categories | Create, archive, restore |
| Profile | Update name and planned allowance |
| Reports, charts, CSV | Generated from the saved local budget |
| Weekly timer and rollover | Uses Philippine week boundaries; preserves the original operation dates |
| Alerts | Calculated locally from the available balance |
| Initial registration/login/verification | Requires internet |
| Password recovery and account logout | Requires internet; logout is blocked while changes remain unsynced |
| Other-device updates and server sync | Requires internet and an open/foreground app |

## How saving and sync work

Every finance change is saved first in IndexedDB together with the local budget state. If storage fails, the form reports an error instead of pretending the entry was saved. Money records are not kept only in React memory or localStorage.

When connected, Alloca syncs automatically while open, on reconnection, on returning to the foreground, and during its regular refresh. The operating system may suspend closed/background apps; there is no guarantee of synchronization while the app is fully closed.

Each change has a UUID. The server records that ID in the same database transaction as the money update. Retrying after an interrupted connection does not duplicate a transaction, allowance or transfer. New offline goals/categories keep their IDs when synced, so later queued entries can reference them.

Offline entries retain their recorded dates even if they sync in a later week. Later carryovers are recalculated. The server checks account ownership, amounts, category state and savings funds again. Past-week corrections are accepted only as queued operations with their original action dates; normal expense editing still follows the current-week rule.

If another device changed a record, or the server no longer has enough funds for a queued savings transfer, Alloca reports a conflict and retains the pending queue. It does not silently overwrite the other device’s edit. The pending local view remains visible. Open **Sync details** to inspect the problem or retry.

If you decide to abandon a conflicted queue, first **Download offline backup**, then use **Discard pending changes** and confirm. This discards all pending operations on this device, not synced server records. Re-enter the intended corrected entries afterwards. The JSON backup is for inspection/manual recovery; this version does not automatically import it.

## Device storage and account switching

Offline access is intended for your own device. The budget is readable while the device/app is unlocked; there is no additional offline PIN. Auth tokens are not included in the offline backup or cached app shell. Private server-rendered pages, API replies and auth responses are never cached by the service worker.

The app requests persistent browser storage, but browsers can refuse it or remove data. Clearing site data, uninstalling the app, private browsing, device cleanup or running out of storage can remove unsynced entries. Sync before clearing or reinstalling, and export pending data if needed.

Only one account's offline workspace is active per browser profile/install. Reauthenticating with the same email preserves the queue. Switching to a different account requires syncing or explicitly discarding pending changes first. A successful logout clears the device's offline finance data and informs other open tabs.

## Validate on your phone after deployment

1. Sign in online and wait for Offline ready.
2. Close/reopen the installed app online: it should remain signed in.
3. Enable airplane mode; close/reopen the app. Dashboard and all budget routes should load.
4. Add an expense, extra income, goal and savings transfer. Update a category/profile. Restart the app offline and check persistence.
5. Restore internet and watch pending count reach zero. Reload and confirm no duplicates.
6. Check the same records on another device.
7. Edit the same expense on two devices, one offline. Confirm a sync conflict is shown rather than a silent overwrite.
8. Test logout after syncing; reopen offline and confirm no private budget is displayed.

Automated tests cover the SQLite sync service, local reducer, IndexedDB transaction semantics with an IndexedDB emulator, and the service worker cache logic with a mocked Cache API. Real phone/browser airplane-mode behavior and live Supabase/Turso sessions must be checked on your deployment; they were not tested on your device.

Official references:
- https://supabase.com/docs/guides/auth/sessions
- https://nextjs.org/docs/app/guides/progressive-web-apps
- https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
