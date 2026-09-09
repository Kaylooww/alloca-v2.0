import { api } from '@/lib/auth/api';
import { db } from '@/lib/database/client';
import { goalSchema } from '@/lib/validation/schemas';
export const POST = api(async (r, u) => { const g = goalSchema.parse(await r.json()); await db().prepare('INSERT INTO goals(id,user_id,name,target,due,created) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(), u.userId, g.name, g.target, g.due || null, new Date().toISOString()).run(); return { ok: true }; });
