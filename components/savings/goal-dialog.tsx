"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useBudget, request } from '@/hooks/use-budget';
import { toast } from 'sonner';
export function GoalDialog() { const { refresh } = useBudget(); const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''); async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); const f = new FormData(e.currentTarget); try {
    await request('savings-goals', 'POST', { name: f.get('name'), target: f.get('target'), due: f.get('due') });
    await refresh();
    setOpen(false);
    toast.success('A new goal to look forward to.');
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <Dialog open={open} onOpenChange={o => { setOpen(o); setError(''); }}><DialogTrigger asChild><button className="btn"><Plus size={18}/> New goal</button></DialogTrigger><DialogContent><DialogTitle>What are you saving for?</DialogTitle><DialogDescription>Give your savings a name and a little direction.</DialogDescription><form className="form-stack" onSubmit={save}><label>Goal name<input name="name" maxLength={60} placeholder="e.g. A new laptop" required/></label><label>Target amount (₱)<input name="target" type="number" min="0.01" max="1000000" step="0.01" required/></label><label>Target date (optional)<input name="due" type="date"/></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create goal'}</button></form></DialogContent></Dialog>; }
