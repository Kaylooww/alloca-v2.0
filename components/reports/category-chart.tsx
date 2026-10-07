"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { money } from '@/lib/calculations/budget';
export function CategoryChart({ items }: {
    items: {
        name: string;
        color: string;
        value: number;
    }[];
}) { const total = items.reduce((s, c) => s + c.value, 0); return <div className="category-chart"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={items.length ? items : [{ name: 'No spending yet', value: 1, color: 'var(--muted)' }]} dataKey="value" innerRadius={65} outerRadius={83} paddingAngle={items.length ? 4 : 0} stroke="none">{(items.length ? items : [{ color: 'var(--muted)' }]).map((c, i) => <Cell key={i} fill={`color-mix(in srgb, ${c.color}, #e0e8e3 var(--category-tint))`}/>)}</Pie>{!!items.length && <Tooltip contentStyle={{ background: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)', borderRadius: 12 }} itemStyle={{ color: 'var(--foreground)' }} formatter={n => money(Number(n))}/>}</PieChart></ResponsiveContainer><div className="donut-center"><span>Total spent</span><strong>{money(total)}</strong></div></div><div className="category-legend">{items.length ? items.map(c => <div key={c.name}><span><i style={{ background: `color-mix(in srgb, ${c.color}, #e0e8e3 var(--category-tint))` }}/>{c.name}</span><strong>{Math.round(c.value / total * 100)}%</strong></div>) : <p className="muted small">Your spending breakdown will appear with your first expense.</p>}</div></div>; }
