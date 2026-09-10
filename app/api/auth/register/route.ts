import { authEndpoint } from '@/lib/auth/endpoint';
import { registerSchema } from '@/lib/validation/auth';
import { registrationFailure } from '@/lib/auth/registration-error';
export const POST = authEndpoint(async (request, client) => {
  const data = registerSchema.parse(await request.json());
  const { data: result, error } = await client.auth.signUp({
    email: data.email, password: data.password, options: { data: { name: data.name } },
  });
  if (error) return registrationFailure(error);
  if (result.session) {
    await client.auth.signOut();
    return { error: 'Email confirmation must be enabled in the authentication settings before registration is available.' };
  }
  return { ok: true };
});
