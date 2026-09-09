import type { Transaction, Cycle } from '@/types';
export const money = (cents: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(cents / 100);
export const sum = (tx: Transaction[], kind: string) => tx.filter(t => t.kind === kind).reduce((s, t) => s + t.amount, 0);
export function totals(tx: Transaction[], carry = 0) { const income = sum(tx, 'income') + sum(tx, 'allowance'); const spent = sum(tx, 'expense'); const saved = sum(tx, 'saving') - sum(tx, 'withdrawal'); return { income, spent, saved, available: carry + income - spent - saved, funds: carry + income }; }
export function cycleDates(now = new Date()) { const local = new Date(now.getTime() + 8 * 3600000); const day = local.getUTCDay(); local.setUTCDate(local.getUTCDate() - ((day + 6) % 7)); local.setUTCHours(0, 0, 0, 0); const start = new Date(local.getTime() - 8 * 3600000); return { start: start.toISOString(), end: new Date(start.getTime() + 7 * 86400000).toISOString() }; }
export const dateLabel = (value: string) => new Date(value).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' });
export const cycleTransactions = (all: Transaction[], cycle: Cycle) => all.filter(t => t.cycle_id === cycle.id);
