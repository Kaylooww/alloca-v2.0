type ProviderError = { code?: string; status?: number; message?: string };
/** Keep provider details out of the public response and never log credentials or emails. */
export function registrationFailure(error: ProviderError, operation: 'register' | 'resend' = 'register') {
  const reference = crypto.randomUUID();
  let status = 400;
  let code = 'REGISTRATION_FAILED';
  let message = 'Unable to complete registration. Try again later, or log in if you already have an account.';
  if (operation === 'resend') message = 'Unable to resend your verification code. Please try again later.';
  if (error.status === 429 || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(error.code || '')) {
    status = 429; code = 'AUTH_RATE_LIMIT';
    message = 'Too many email or sign-in attempts. Please wait before trying again.';
  } else if (/error sending (confirmation|recovery|verification) email|smtp|email delivery/i.test(error.message || '') || error.code === 'email_address_not_authorized') {
    status = 503; code = 'EMAIL_DELIVERY_FAILED';
    message = 'We could not send your verification email. The site owner needs to check the email delivery settings. Please try again after this is resolved.';
  } else if (error.code === 'weak_password') {
    code = 'PASSWORD_REJECTED'; message = 'Please choose a stronger password that meets the account password requirements.';
  } else if (['email_address_invalid', 'validation_failed'].includes(error.code || '')) {
    code = 'INVALID_REGISTRATION'; message = 'Check your email address and registration details, then try again.';
  } else if (['signup_disabled', 'email_provider_disabled'].includes(error.code || '')) {
    code = 'REGISTRATION_DISABLED'; message = 'Registration is currently unavailable. Please contact the site owner.';
  } else if ((error.status || 0) >= 500) {
    status = 503; code = 'AUTH_SERVICE_UNAVAILABLE';
    message = 'Registration is temporarily unavailable. Please try again later.';
  }
  console.error('Alloca auth failure', { reference, operation, category: code, providerCode: error.code || 'unknown', providerStatus: error.status || null });
  return Response.json({ error: message + ' Reference: ' + reference, code, reference }, { status, headers: { 'Cache-Control': 'no-store' } });
}
