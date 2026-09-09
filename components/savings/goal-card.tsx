"use client";
import { Goal as GoalIcon, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { TransactionDialog } from '@/components/expenses/transaction-dialog';
import { money, dateLabel } from '@/lib/calculations/budget';
import type { Goal } from '@/types';
export function GoalCard({ goal, compact = false }: {
    goal: Goal;
    compact?: boolean;
}) { const percent = Math.min(100, Math.round(goal.saved / goal.target * 100)); return <div className={'goal-card ' + (compact ? 'compact' : '')}><div className="goal-heading"><span className="goal-icon">{percent === 100 ? <Check size={21}/> : <GoalIcon size={21}/>}</span><div><h3>{goal.name}</h3><p className="muted small">{percent === 100 ? 'You made it. Well done!' : goal.due ? 'Target: ' + dateLabel(goal.due + 'T00:00:00+08:00') : 'One small step at a time'}</p></div></div><div className="goal-amount"><strong>{money(goal.saved)} <small>of {money(goal.target)}</small></strong><span>{percent}%</span></div><Progress value={percent} aria-label={goal.name + ' progress'}/>{!compact && <div className="goal-actions"><TransactionDialog kind="saving" goalId={goal.id}><button className="btn btn-outline">+ Add savings</button></TransactionDialog>{goal.saved > 0 && <TransactionDialog kind="withdrawal" goalId={goal.id}><button className="text-link">Withdraw</button></TransactionDialog>}</div>}</div>; }
