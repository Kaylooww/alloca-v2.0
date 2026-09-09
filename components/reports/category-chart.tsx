"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { money } from '@/lib/calculations/budget';
export function CategoryChart({ items }: {
    items: {
        name: string;
        color: string;
        value: number;
    }[];
}) { const total = items.reduce((s, c) => s + c.value, 0); return <div className="category-chart"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={items.length ? items : [{ name: 'No spending yet', value: 1, color: '#edf2ee' }]} dataKey="value" innerRadius={65} outerRadius={83} paddingAngle={items.length ? 4 : 0} stroke="none">{(items.length ? items : [{ color: '#edf2ee' }]).map((c, i) => <Cell key={i} fill={c.color}/>)}</Pie>{!!items.length && <Tooltip formatter={n => money(Number(n))}/>}</PieChart></ResponsiveContainer><div className="donut-center"><span>Total spent</span><strong>{money(total)}</strong></div></div><div className="category-legend">{items.length ? items.map(c => <div key={c.name}><span><i style={{ background: c.color }}/>{c.name}</span><strong>{Math.round(c.value / total * 100)}%</strong></div>) : <p className="muted small">Your spending breakdown will appear with your first expense.</p>}</div></div>; }
