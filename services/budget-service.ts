import {operationDate,operationId} from '@/lib/offline/operation-context';
import { db, rows } from '@/lib/database/client';
import { nextCycleDates, totals } from '@/lib/calculations/budget';
import type { Profile, Cycle, Transaction, Category, Goal } from '@/types';
import { HttpError } from '@/lib/auth/api';
export async function profile(user: string) { return (await rows<Profile>('SELECT * FROM profiles WHERE id=?', user))[0]; }
export async function currentCycle(user: string) {
 const p=await profile(user);if(!p) throw new HttpError(409,'Set up your Alloca profile first.');
 const now=operationDate();
 const cycles=await rows<Cycle>('SELECT * FROM cycles WHERE user_id=? ORDER BY start DESC',user);
 const active=cycles.find(c=>c.start<=now.toISOString()&&c.end>now.toISOString());if(active)return active;
 const dates=nextCycleDates(cycles,now,p.frequency||'weekly');
 const previous=cycles.find(c=>c.start<dates.start);
 const tx=previous?await rows<Transaction>('SELECT * FROM transactions WHERE user_id=? AND cycle_id=?',user,previous.id):[];
 const carry=previous?totals(tx,previous.carry).available:0;
 await db().prepare('INSERT OR IGNORE INTO cycles(id,user_id,start,end,carry,frequency) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user,dates.start,dates.end,carry,p.frequency||'weekly').run();
 return (await rows<Cycle>('SELECT * FROM cycles WHERE user_id=? AND start=?',user,dates.start))[0];
}
export async function getBudget(user: string) { const p = await profile(user); if (!p)
    return { needsSetup: true }; const cycle = await currentCycle(user); const [transactions, categories, goals, cycles] = await Promise.all([rows<Transaction>('SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC', user), rows<Category>('SELECT * FROM categories WHERE user_id=? ORDER BY rowid', user), rows<Goal>("SELECT g.*,COALESCE(SUM(CASE WHEN t.kind='saving' THEN t.amount WHEN t.kind='withdrawal' THEN -t.amount ELSE 0 END),0) AS saved FROM goals g LEFT JOIN transactions t ON t.goal_id=g.id AND t.user_id=g.user_id WHERE g.user_id=? GROUP BY g.id ORDER BY g.created", user), rows<Cycle>('SELECT * FROM cycles WHERE user_id=? ORDER BY start DESC', user)]); return { profile: p, cycle, transactions, categories, goals, cycles }; }
export async function receiveAllowance(user: string) { const p = await profile(user); const c = await currentCycle(user); const result = await db().prepare("INSERT INTO transactions(id,user_id,cycle_id,kind,amount,category,note,date) SELECT ?,?,?,'allowance',?,'Allowance','Allowance',? WHERE NOT EXISTS(SELECT 1 FROM transactions WHERE user_id=? AND cycle_id=? AND kind='allowance')").bind(operationId(), user, c.id, p.allowance, operationDate().toISOString(), user, c.id).run(); if (!result.meta.changes)
    throw new HttpError(409, 'You already recorded this cycle’s allowance. Use extra income for additional funds.'); return { ok: true }; }
