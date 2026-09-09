"use client";
import { useState } from 'react';
import { useBudget, request } from '@/hooks/use-budget';
import { toast } from 'sonner';
export function ProfileForm({ initialName }: {
    initialName: string;
}) { const { data, refresh } = useBudget(); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setError(''); const f = new FormData(e.currentTarget); try {
    await request('profile', 'POST', { name: f.get('name'), allowance: f.get('allowance') });
    await refresh();
    toast.success('Your allowance plan is saved.');
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <form className="form-stack" onSubmit={save}><label>Your name<input name="name" autoComplete="given-name" maxLength={60} defaultValue={data?.profile.name || initialName} placeholder="What should we call you?" required/></label><label>Weekly allowance (₱)<input name="allowance" type="number" step="0.01" min="0.01" max="1000000" placeholder="e.g. 1500" defaultValue={data ? data.profile.allowance / 100 : undefined} required/></label><p className="muted small">This is your weekly plan. Confirm each payment from your overview when the money arrives.</p>{error && <p role="alert" className="form-error">{error}</p>}<button className="btn" disabled={busy}>{busy ? 'Saving…' : data ? 'Save changes' : 'Create my Alloca account'}</button></form>; }
