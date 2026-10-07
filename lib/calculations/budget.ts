import type { Transaction, Cycle } from '@/types';
export const money = (cents: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(cents / 100);
export const sum = (tx: Transaction[], kind: string) => tx.filter(t => t.kind === kind).reduce((s, t) => s + t.amount, 0);
export function totals(tx: Transaction[], carry = 0) { const income = sum(tx, 'income') + sum(tx, 'allowance'); const spent = sum(tx, 'expense'); const saved = sum(tx, 'saving') - sum(tx, 'withdrawal'); return { income, spent, saved, available: carry + income - spent - saved, funds: carry + income }; }
export type Frequency = 'daily' | 'weekly' | 'monthly';
export function cycleDates(now = new Date(), frequency: Frequency = 'weekly') {
 const local = new Date(now.getTime() + 8 * 3600000);
 local.setUTCHours(0,0,0,0);
 if(frequency==='weekly') local.setUTCDate(local.getUTCDate()-((local.getUTCDay()+6)%7));
 if(frequency==='monthly') local.setUTCDate(1);
 const end=new Date(local);
 if(frequency==='monthly') end.setUTCMonth(end.getUTCMonth()+1);
 else end.setUTCDate(end.getUTCDate()+(frequency==='daily'?1:7));
 return {start:new Date(local.getTime()-8*3600000).toISOString(),end:new Date(end.getTime()-8*3600000).toISOString()};
}
/** Finish existing cycles before adopting a different schedule. */
export function nextCycleDates(cycles: Cycle[], now: Date, frequency: Frequency = 'weekly') {
 const dates=cycleDates(now,frequency);
 const previous=cycles.filter(c=>c.end<=now.toISOString()).sort((a,b)=>b.end.localeCompare(a.end))[0];
 if(previous && previous.end>dates.start) dates.start=previous.end;
 return dates;
}
export const dateLabel = (value: string) => new Date(value).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' });
export const cycleTransactions = (all: Transaction[], cycle: Cycle) => all.filter(t => t.cycle_id === cycle.id);
