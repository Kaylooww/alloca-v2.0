import { getUser } from '@/lib/auth/user';
import {withDatabaseTransaction} from '@/lib/database/client';
import { ZodError } from 'zod';
export class HttpError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export function api(handler: (request: Request, user: {
    userId: string;
    email: string;
    displayName: string;
}) => Promise<unknown>) { return async (request: Request) => { try {
    const user = await getUser();
    if (!user)
        throw new HttpError(401, 'Please sign in to continue.');
    if (request.method !== 'GET') {
        const origin = request.headers.get('origin');
        if (origin && origin !== new URL(request.url).origin)
            throw new HttpError(403, 'Request origin is not allowed.');
    }
    const result = await withDatabaseTransaction(() => handler(request, user));
    return Response.json(result,{headers:{'Cache-Control':'private, no-store'}});
}
catch (e) {
    if (e instanceof ZodError)
        return Response.json({ error: e.issues[0]?.message ?? 'Check your entries.' }, { status: 400 });
    if (e instanceof HttpError)
        return Response.json({ error: e.message }, { status: e.status });
    if (e instanceof SyntaxError)
        return Response.json({ error: 'Invalid request.' }, { status: 400 });
    console.error('Alloca request failed', e);
    return Response.json({ error: 'Unable to save or load your data. Please try again.' }, { status: 503 });
} }; }
