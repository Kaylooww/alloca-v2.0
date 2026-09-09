"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { money } from '@/lib/calculations/budget';
import type { Transaction } from '@/types';
export function SpendingChart({ transactions, start }: {
    transactions: Transaction[];
    start: string;
}) { const days = Array.from({ length: 7 }, (_, i) => { const date = new Date(new Date(start).getTime() + i * 86400000); return { name: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Manila' }), amount: transactions.filter(t => t.kind === 'expense' && new Date(t.date) >= date && new Date(t.date).getTime() < date.getTime() + 86400000).reduce((s, t) => s + t.amount, 0) }; }); return <div className="chart-container" role="img" aria-label={days.map(d => d.name + ': ' + money(d.amount)).join(', ')}><ResponsiveContainer width="100%" height="100%"><BarChart data={days} barSize={28} margin={{ left: -20, right: 5, top: 12 }}><CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#e9edeb"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#74817c' }} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#74817c' }} tickFormatter={n => '₱' + n / 100}/><Tooltip formatter={(n) => money(Number(n))} cursor={{ fill: '#f1f6f2' }} contentStyle={{ borderRadius: 12, border: '1px solid #e1e9e4' }}/><Bar name="Spent" dataKey="amount" fill="#138b78" radius={[5, 5, 0, 0]}/></BarChart></ResponsiveContainer></div>; }
