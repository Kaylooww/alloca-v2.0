'use client';
import { useState } from 'react';
import { useBudget, request } from '@/hooks/use-budget';
import { Choice } from '@/components/shared/choice';
import type { Frequency } from '@/lib/calculations/budget';
import { toast } from 'sonner';
const presets: Record<Frequency, number[]> = {daily:[50,100,150],weekly:[500,1000],monthly:[5000,10000]};
export function ProfileForm({initialName}:{initialName:string}) {
 const {data,refresh}=useBudget();
 const [frequency,setFrequency]=useState<Frequency>(data?.profile.frequency||'weekly');
 const [amount,setAmount]=useState(data?String(data.profile.allowance/100):'');
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');
 const f=new FormData(e.currentTarget);
 try{await request('profile','POST',{name:f.get('name'),allowance:amount,frequency});await refresh();toast.success('Your allowance plan is saved.');}
 catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <form className="form-stack" onSubmit={save}>
 <label>Your name<input name="name" autoComplete="given-name" maxLength={60} defaultValue={data?.profile.name||initialName} placeholder="What should we call you?" required/></label>
 <label>Allowance schedule<Choice label="Allowance schedule" value={frequency} onChange={v=>setFrequency(v as Frequency)} options={[{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'}]}/></label>
 <fieldset className="allowance-presets"><legend>Quick amounts · {frequency}</legend><div>{presets[frequency].map(n=><button type="button" className="btn btn-outline" aria-pressed={Number(amount)===n} key={n} onClick={()=>setAmount(String(n))}>₱{n.toLocaleString('en-PH')}</button>)}</div></fieldset>
 <label>Your {frequency} amount (₱)<input name="allowance" type="number" inputMode="decimal" step="0.01" min="0.01" max="1000000" placeholder="Choose above or enter any amount" value={amount} onChange={e=>setAmount(e.target.value)} required/></label>
 <p className="muted small">Use a suggested amount or enter your own. Money is added only when you record that it arrived, once per cycle.</p>
 <p className="muted small">Daily resets at midnight, weekly on Monday, and monthly on the first (Philippine time). {data?'Schedule changes start after your current cycle ends. Amount changes apply to your next allowance receipt.':''}</p>
 {error&&<p role="alert" className="form-error">{error}</p>}<button className="btn" disabled={busy}>{busy?'Saving…':data?'Save changes':'Create my Alloca account'}</button></form>;
}
