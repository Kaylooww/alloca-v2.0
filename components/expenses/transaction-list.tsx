"use client";
import { Utensils, Bus, BookOpen, Layers, Gamepad2, ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useBudget, request } from '@/hooks/use-budget';
import { TransactionDialog } from './transaction-dialog';
import { money, dateLabel } from '@/lib/calculations/budget';
import { toast } from 'sonner';
import type { Transaction } from '@/types';
const icons: Record<string, typeof Utensils> = { Meals: Utensils, Transport: Bus, 'School supplies': BookOpen, Projects: Layers, Leisure: Gamepad2 };
export function TransactionList({ transactions, editable = false }: {
    transactions: Transaction[];
    editable?: boolean;
}) { const { data, refresh } = useBudget(); async function remove(id: string) { try {
    await request('transactions?id=' + id, 'DELETE');
    await refresh();
    toast.success('Expense deleted.');
}
catch (e) {
    toast.error((e as Error).message);
} } if (!transactions.length)
    return <div className="empty-state"><span className="empty-icon"><ArrowLeftRightIcon /></span><h3>A clean slate for your money</h3><p>Record your allowance or log your first expense.<br />Every little entry brings a little more clarity.</p></div>; return <Table><TableHeader><TableRow><TableHead>Transaction</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead>{editable && <TableHead className="text-right">Actions</TableHead>}</TableRow></TableHeader><TableBody>{transactions.map(t => { const positive = ['income', 'allowance', 'withdrawal'].includes(t.kind); const Icon = icons[t.category] || (positive ? ArrowDownLeft : ArrowUpRight); const color = data?.categories.find(c => c.name === t.category)?.color || '#087f72'; return <TableRow key={t.id}><TableCell><div className="transaction-title"><span className="category-icon" style={{ '--category-color': color, color, background: color + '12' } as React.CSSProperties}><Icon size={18}/></span><span><strong>{t.note || t.category}</strong><small>{t.kind === 'saving' ? 'Savings contribution' : t.kind === 'withdrawal' ? 'Savings withdrawal' : t.kind === 'allowance' ? 'Allowance' : t.kind === 'income' ? 'Money in' : 'Money out'}</small></span></div></TableCell><TableCell><span className="category-tag">{t.category}</span></TableCell><TableCell className="muted">{dateLabel(t.date)}</TableCell><TableCell className={'amount text-right ' + (positive ? 'positive' : '')}>{positive ? '+' : '−'}{money(t.amount)}</TableCell>{editable && <TableCell>{t.kind === 'expense' && t.cycle_id === data?.cycle.id && <div className="row-actions"><TransactionDialog edit={t}><button className="icon-btn" aria-label={'Edit ' + (t.note || t.category)}><Pencil size={15}/></button></TransactionDialog><AlertDialog><AlertDialogTrigger asChild><button className="icon-btn" aria-label={'Delete ' + (t.note || t.category)}><Trash2 size={15}/></button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this expense?</AlertDialogTitle><AlertDialogDescription>This removes {money(t.amount)} from your recorded spending and restores your available balance.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep expense</AlertDialogCancel><AlertDialogAction onClick={() => void remove(t.id)}>Delete expense</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>}</TableCell>}</TableRow>; })}</TableBody></Table>; }
function ArrowLeftRightIcon() { return <ArrowUpRight size={25}/>; }
