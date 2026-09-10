import { authEndpoint } from '@/lib/auth/endpoint';
import { emailSchema } from '@/lib/validation/auth';
import { registrationFailure } from '@/lib/auth/registration-error';
export const POST = authEndpoint(async (request, client) => {
  const { email } = emailSchema.parse(await request.json());
  const { error } = await client.auth.resend({ type: 'signup', email });
  if (error) return registrationFailure(error, 'resend');
  return { ok: true };
});
