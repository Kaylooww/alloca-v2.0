# Alloca: fix registration with Resend

## Most likely configuration issue

`onboarding@resend.dev` is a testing sender. Resend restricts it to the email associated with your Resend account. If your first signup used that address and the next used someone else’s address, the recipient restriction explains the difference. The computer itself does not decide which recipients Resend allows. This is a likely diagnosis; your Supabase Auth logs can confirm the underlying error.

## Required fix in your accounts

1. In Resend → Domains, add a domain you own and can manage DNS for.
2. Add the DNS records Resend provides at your domain/DNS provider. Wait for Resend to show the domain as verified.
3. In Supabase → Authentication → Email → SMTP Settings, change the **Sender email** from `onboarding@resend.dev` to an address on that verified domain, such as `noreply@yourdomain.com`. Use your actual domain, not this example. Sender name: Alloca.
4. Confirm host `smtp.resend.com`, port `465`, username `resend`, and password = your Resend API key. Ensure that key can send from the selected domain.
5. Save. Leave email confirmation enabled and keep the included code-based email template.
6. Retry using the failed email address. If Supabase already shows an unconfirmed user, use Alloca’s Verify email → Resend verification code. If no account was created, register again. Do not delete verified users or existing budget data.

You cannot verify `gmail.com`, `resend.dev`, or `vercel.app` as your own domain. Merely typing a Gmail address in the sender field does not remove Resend’s restriction. If you do not own a domain, use an SMTP provider that permits your verified sender address, or obtain a domain and verify it. Keep verification enabled.

SMTP settings are saved in Supabase, so that configuration change alone does not require a Vercel redeployment. The code improvements below do require a commit/redeployment.

## Apply the code patch to your existing GitHub project

Copy only these files from the updated ZIP into your existing source folder:

- `lib/auth/registration-error.ts` (new)
- `lib/auth/endpoint.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/resend/route.ts`
- `tests/auth.test.mjs` (tests; merge if you have added your own tests)

Then run `npm test` and `npm run build`, commit the changes, and push to the branch connected to Vercel. No new packages, environment variables, database migration, or data reset is needed. Preserve your `.env.local` and any unrelated edits.

The patch reports email-delivery failures, rate limits, invalid inputs and other service failures separately. Failures receive appropriate HTTP status codes. The response includes a reference ID; Vercel logs record the same ID plus the provider error code and status. Passwords, tokens, recipient addresses and raw provider messages are not logged by this patch.

This patch improves diagnosis; it cannot lift an SMTP provider’s sender/recipient restriction.

## If it still fails

Open Supabase Auth logs at the failed signup time. Check the related Resend delivery/SMTP error if available. A 403 or testing-recipient restriction supports the Resend diagnosis. Other causes include an invalid SMTP key, sender-domain mismatch, rate limits, or a database/auth hook failure. Use the error’s code/message to distinguish them; do not assume every failure is SMTP.

If the same email can register on one machine but not another, compare the exact deployment URLs and whether that email is already registered. An existing account should use Log in, not Register. Share only a redacted error code/message for further troubleshooting, never an API key or password.

Official references:
- https://resend.com/docs/knowledge-base/403-error-resend-dev-domain
- https://resend.com/docs/send-with-supabase-smtp
- https://supabase.com/docs/guides/auth/debugging/error-codes
