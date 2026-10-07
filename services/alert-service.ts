import { totals } from '@/lib/calculations/budget';
import type { Transaction } from '@/types';
export function spendingAlert(tx: Transaction[], carry: number) { const t = totals(tx, carry); if (t.available < 0)
    return { level: 'warning', title: 'Your balance is below zero', message: 'Review your expenses or record any extra income you received.' }; if (t.funds > 0 && t.available / t.funds <= 0.2)
    return { level: 'warning', title: 'A little budget check-in', message: 'You have 20% or less of your cycle funds left. Plan your essentials first.' }; return { level: 'good', title: t.funds > 0 ? 'You’re in control of your cycle' : 'Your fresh start is here', message: t.funds > 0 ? 'Keep logging the little things. They add up to better habits.' : 'Record your allowance when it arrives, then give it a purpose.' }; }
