import { totals, dateLabel } from '@/lib/calculations/budget';
import type { BudgetData } from '@/types';
export function weeklyReports(data: BudgetData) { return data.cycles.map(c => ({ ...totals(data.transactions.filter(t => t.cycle_id === c.id), c.carry), label: dateLabel(c.start), start: c.start, end: c.end })); }
export function categoryReport(data: BudgetData, tx = data.transactions) { return data.categories.map(c => ({ name: c.name, color: c.color, value: tx.filter(t => t.kind === 'expense' && t.category === c.name).reduce((s, t) => s + t.amount, 0) })).filter(c => c.value > 0); }
