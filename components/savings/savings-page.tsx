"use client";
import { PiggyBank } from 'lucide-react';
import { useBudget } from '@/hooks/use-budget';
import { PageHeader } from '@/components/shared/page-header';
import { DataGate } from '@/components/shared/data-gate';
import { GoalCard } from './goal-card';
import { GoalDialog } from './goal-dialog';
import { money } from '@/lib/calculations/budget';
export function SavingsPage() { const { data } = useBudget(); const goals = data?.goals ?? []; return <DataGate><PageHeader title="A little closer to your someday." description="Give your savings a purpose. Then get there, one small step at a time." actions={<GoalDialog />}/><section className="savings-banner"><PiggyBank size={40}/><div><p>Total set aside</p><h2>{money(goals.reduce((s, g) => s + g.saved, 0))}</h2></div><div className="savings-banner-note">Separate from your spending money.<br />Right where your future needs it.</div></section><div className="goals-grid">{goals.map(g => <section className="card" key={g.id}><GoalCard goal={g}/></section>)}</div>{!goals.length && <section className="card empty-state"><PiggyBank size={40}/><h2>Big things start small.</h2><p>Name something you’re looking forward to.<br />A little from your allowance can go a long way.</p><GoalDialog /></section>}</DataGate>; }
