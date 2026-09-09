import { api } from '@/lib/auth/api';
import { db } from '@/lib/database/client';
import { profileSchema } from '@/lib/validation/schemas';
import { profile, currentCycle } from '@/services/budget-service';
export const GET = api(async (_r, u) => ({ profile: await profile(u.userId) }));
export const POST = api(async (r, u) => { const p = profileSchema.parse(await r.json()); const exists = await profile(u.userId); const statements = [db().prepare('INSERT INTO profiles(id,name,email,allowance,created) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,allowance=excluded.allowance').bind(u.userId, p.name, u.email, p.allowance, new Date().toISOString())]; if (!exists) {
    const colors = ['#087f72', '#f4a65b', '#6d81d5', '#cb78a0', '#55a9b8', '#8e9a58'];
    ['Meals', 'Transport', 'School supplies', 'Projects', 'Leisure', 'Others'].forEach((n, i) => statements.push(db().prepare('INSERT OR IGNORE INTO categories(id,user_id,name,color) VALUES(?,?,?,?)').bind(crypto.randomUUID(), u.userId, n, colors[i])));
} await db().batch(statements); await currentCycle(u.userId); return { ok: true }; });
