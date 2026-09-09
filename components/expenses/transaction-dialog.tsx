"use client";
import { useState } from 'react';
import { Plus, ArrowDownLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Choice } from '@/components/shared/choice';
import { useBudget, request } from '@/hooks/use-budget';
import { toast } from 'sonner';
import type { Transaction } from '@/types';
export function TransactionDialog({ kind = 'expense', goalId, edit, children }: {
    kind?: 'expense' | 'income' | 'saving' | 'withdrawal';
    goalId?: string;
    edit?: Transaction;
    children?: React.ReactNode;
}) { const { data, refresh } = useBudget(); const [open, setOpen] = useState(false), [category, setCategory] = useState(edit?.category || ''), [busy, setBusy] = useState(false), [error, setError] = useState(''); const title = edit ? 'Edit expense' : kind === 'expense' ? 'Log an expense' : kind === 'income' ? 'Add extra income' : kind === 'saving' ? 'Put money toward your goal' : 'Move savings to your balance'; const active = data?.categories.filter(c => !c.archived) ?? []; async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); if (busy)
    return; setBusy(true); setError(''); const f = new FormData(e.currentTarget); try {
    await request(edit ? 'transactions?id=' + edit.id : 'transactions', edit ? 'PATCH' : 'POST', { kind, amount: f.get('amount'), category: kind === 'expense' ? (category || active[0]?.name) : kind === 'income' ? 'Extra income' : 'Savings', note: f.get('note'), goalId });
    await refresh();
    setOpen(false);
    toast.success(edit ? 'Expense updated.' : 'All saved. A little more clarity.');
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <Dialog open={open} onOpenChange={o => { setOpen(o); setError(''); }}><DialogTrigger asChild>{children || <button className={kind === 'expense' ? 'btn' : 'btn btn-outline'}>{kind === 'expense' ? <Plus size={18}/> : <ArrowDownLeft size={18}/>} {kind === 'expense' ? 'Log expense' : 'Extra income'}</button>}</DialogTrigger><DialogContent><DialogTitle>{title}</DialogTitle><DialogDescription>{kind === 'expense' ? 'The little things count. Capture this purchase.' : kind === 'income' ? 'A side hustle, gift, or a little extra support.' : kind === 'saving' ? 'This amount moves out of your spendable balance.' : 'This amount becomes available to spend again.'}</DialogDescription><form onSubmit={save} className="form-stack"><label>Amount (₱)<input name="amount" type="number" inputMode="decimal" min="0.01" max="1000000" step="0.01" autoFocus defaultValue={edit ? edit.amount / 100 : undefined} placeholder="0.00" required/></label>{kind === 'expense' && <label>Category<Choice label="Expense category" value={category || active[0]?.name || ''} onChange={setCategory} options={active.map(c => ({ value: c.name, label: c.name }))}/></label>}<label>{kind === 'income' ? 'Source / note' : 'Note (optional)'}<input name="note" maxLength={160} defaultValue={edit?.note} placeholder={kind === 'expense' ? 'e.g. Lunch after class' : 'What’s this for?'}/></label><p className="muted small">Recorded today in your current allowance week.</p>{error && <p role="alert" className="form-error">{error}</p>}<button className="btn" disabled={busy || (kind === 'expense' && !active.length)}>{busy ? 'Saving…' : edit ? 'Save changes' : 'Save ' + (kind === 'expense' ? 'expense' : kind === 'income' ? 'income' : 'transfer')}</button></form></DialogContent></Dialog>; }
