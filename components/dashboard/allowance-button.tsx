"use client";
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useBudget, request } from '@/hooks/use-budget';
import { money } from '@/lib/calculations/budget';
import { toast } from 'sonner';
export function AllowanceButton() { const { data, refresh } = useBudget(); const [open, setOpen] = useState(false), [busy, setBusy] = useState(false); if (!data)
    return null; const received = data.transactions.some(t => t.cycle_id === data.cycle.id && t.kind === 'allowance'); async function save() { setBusy(true); try {
    await request('budget-cycles', 'POST');
    await refresh();
    setOpen(false);
    toast.success('Allowance received. You’re ready for this cycle.');
}
catch (e) {
    toast.error((e as Error).message);
}
finally {
    setBusy(false);
} } return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="receive-button" disabled={received}>{received ? '✓ Allowance received' : '＋ Record allowance received'}</button></DialogTrigger><DialogContent><DialogTitle>Has your allowance arrived?</DialogTitle><DialogDescription>Confirm to add {money(data.profile.allowance)} to this cycle’s available balance. You can record your planned allowance once per cycle.</DialogDescription><button className="btn" disabled={busy} onClick={save}>{busy ? 'Recording…' : 'Yes, I received ' + money(data.profile.allowance)}</button><a className="text-link" href="/profile">Change my planned allowance</a></DialogContent></Dialog>; }
