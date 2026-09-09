import { api, HttpError } from '@/lib/auth/api';
import { db, rows } from '@/lib/database/client';
import { categorySchema } from '@/lib/validation/schemas';
export const POST = api(async (r, u) => { const c = categorySchema.parse(await r.json()); if ((await rows('SELECT id FROM categories WHERE user_id=? AND lower(name)=lower(?)', u.userId, c.name)).length)
    throw new HttpError(400, 'A category with this name already exists.'); await db().prepare('INSERT INTO categories(id,user_id,name,color) VALUES(?,?,?,?)').bind(crypto.randomUUID(), u.userId, c.name, c.color).run(); return { ok: true }; });
export const PATCH = api(async (r, u) => { const id = new URL(r.url).searchParams.get('id') ?? ''; const result = await db().prepare('UPDATE categories SET archived=1-archived WHERE user_id=? AND id=?').bind(u.userId, id).run(); if (!result.meta.changes)
    throw new HttpError(404, 'Category not found.'); return { ok: true }; });
