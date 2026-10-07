import {operationDate,operationId} from '@/lib/offline/operation-context';
import { db, rows } from '@/lib/database/client';
import { currentCycle } from './budget-service';
import { HttpError } from '@/lib/auth/api';
import { transactionSchema } from '@/lib/validation/schemas';
export async function addTransaction(user: string, input: unknown) {
    const t = transactionSchema.parse(input);
    const cycle = await currentCycle(user);
    if (t.kind === 'expense') {
        if (!(await rows('SELECT id FROM categories WHERE user_id=? AND name=? AND archived=0', user, t.category)).length)
            throw new HttpError(400, 'Choose an active category.');
    }
    if (t.kind === 'saving' || t.kind === 'withdrawal') {
        if (!t.goalId || !(await rows('SELECT id FROM goals WHERE id=? AND user_id=?', t.goalId, user)).length)
            throw new HttpError(404, 'Savings goal not found.');
    }
    let guard = '1=1';
    let args: unknown[] = [];
    if (t.kind === 'saving') {
        guard = "? <= ? + COALESCE((SELECT SUM(CASE WHEN kind IN ('income','allowance','withdrawal') THEN amount ELSE -amount END) FROM transactions WHERE user_id=? AND cycle_id=?),0)";
        args = [t.amount, cycle.carry, user, cycle.id];
    }
    if (t.kind === 'withdrawal') {
        guard = "? <= COALESCE((SELECT SUM(CASE WHEN kind='saving' THEN amount WHEN kind='withdrawal' THEN -amount ELSE 0 END) FROM transactions WHERE user_id=? AND goal_id=?),0)";
        args = [t.amount, user, t.goalId];
    }
    const result = await db().prepare(`INSERT INTO transactions(id,user_id,cycle_id,kind,amount,category,note,date,goal_id) SELECT ?,?,?,?,?,?,?,?,? WHERE ${guard}`).bind(operationId(), user, cycle.id, t.kind, t.amount, t.category, t.note, operationDate().toISOString(), t.goalId ?? null, ...args).run();
    if (!result.meta.changes)
        throw new HttpError(400, 'Insufficient available balance for this transfer.');
    return { ok: true };
}
export async function deleteExpense(user: string, id: string) { const c = await currentCycle(user); const r = await db().prepare("DELETE FROM transactions WHERE id=? AND user_id=? AND cycle_id=? AND kind='expense'").bind(id, user, c.id).run(); if (!r.meta.changes)
    throw new HttpError(404, 'Only expenses in your current cycle can be deleted.'); return { ok: true }; }
export async function editExpense(user: string, id: string, input: unknown) { const t = transactionSchema.parse(input); const c = await currentCycle(user); if (t.kind !== 'expense')
    throw new HttpError(400, 'Only expenses can be edited.'); if (!(await rows('SELECT id FROM categories WHERE user_id=? AND name=? AND archived=0', user, t.category)).length)
    throw new HttpError(400, 'Choose an active category.'); const r = await db().prepare("UPDATE transactions SET amount=?,category=?,note=? WHERE id=? AND user_id=? AND cycle_id=? AND kind='expense'").bind(t.amount, t.category, t.note, id, user, c.id).run(); if (!r.meta.changes)
    throw new HttpError(404, 'Only current-cycle expenses can be edited.'); return { ok: true }; }
