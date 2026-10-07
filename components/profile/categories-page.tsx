"use client";
import { useState } from 'react';
import { Tags, Plus, Archive, RotateCcw } from 'lucide-react';
import { useBudget, request } from '@/hooks/use-budget';
import { PageHeader } from '@/components/shared/page-header';
import { DataGate } from '@/components/shared/data-gate';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Choice } from '@/components/shared/choice';
import { toast } from 'sonner';
export function CategoriesPage() { const { data, refresh } = useBudget(); const [open, setOpen] = useState(false), [color, setColor] = useState('#087f72'), [busy, setBusy] = useState(false), [error, setError] = useState(''); async function save(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); try {
    await request('categories', 'POST', { name: new FormData(e.currentTarget).get('name'), color });
    await refresh();
    setOpen(false);
    toast.success('Category added.');
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } async function toggle(id: string) { try {
    await request('categories?id=' + id, 'PATCH');
    await refresh();
    toast.success('Category updated.');
}
catch (e) {
    toast.error((e as Error).message);
} } return <DataGate><PageHeader title="A place for every purchase." description="Student essentials, personal favorites. Organize spending your way." actions={<Dialog open={open} onOpenChange={o => { setOpen(o); setError(''); }}><DialogTrigger asChild><button className="btn"><Plus size={18}/> Add category</button></DialogTrigger><DialogContent><DialogTitle>Create a category</DialogTitle><DialogDescription>A simple label makes your spending easier to understand.</DialogDescription><form onSubmit={save} className="form-stack"><label>Category name<input name="name" maxLength={40} required placeholder="e.g. Printing"/></label><label>Color<Choice label="Category color" value={color} onChange={setColor} options={['Teal', 'Orange', 'Blue', 'Pink', 'Cyan', 'Olive'].map((n, i) => ({ label: n, value: ['#087f72', '#f4a65b', '#6d81d5', '#cb78a0', '#55a9b8', '#8e9a58'][i] }))}/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Create category'}</button></form></DialogContent></Dialog>}/><div className="categories-grid">{data?.categories.map(c => <section className={'card category-card ' + (c.archived ? 'archived' : '')} key={c.id}><span className="category-icon" style={{ '--category-color': c.color, color: c.color, background: c.color + '16' } as React.CSSProperties}><Tags size={23}/></span><div><h3>{c.name}</h3><p className="muted small">{c.archived ? 'Archived' : data.transactions.filter(t => t.category === c.name && t.kind === 'expense').length + ' expenses'}</p></div><button className="icon-btn" aria-label={(c.archived ? 'Restore ' : 'Archive ') + c.name} onClick={() => void toggle(c.id)}>{c.archived ? <RotateCcw size={18}/> : <Archive size={18}/>}</button></section>)}</div><p className="muted small">Archiving hides a category from new expenses. Your previous transactions and reports stay intact.</p></DataGate>; }
