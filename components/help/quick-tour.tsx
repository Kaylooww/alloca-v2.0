'use client';
import { useEffect, useRef, useState } from 'react';
import { CircleHelp, Wallet, ReceiptText, PiggyBank, ChartNoAxesCombined, WifiOff } from 'lucide-react';
import { useBudget } from '@/hooks/use-budget';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const steps=[
 {title:'Welcome to Alloca',Icon:Wallet,text:'Give every money a purpose. Your overview shows the money you can spend, what you have spent, and what you have saved.',tip:'Your allowance plan is ready. It does not add money until you confirm receipt.'},
 {title:'Record money when it arrives',Icon:Wallet,text:'On Overview, choose “Record allowance received” and confirm the amount. You can do this once per daily, weekly or monthly cycle.',tip:'Use Extra income for additional payments, gifts or side earnings. Change your schedule and amount in Profile & settings.'},
 {title:'Log the little things',Icon:ReceiptText,text:'Choose Log expense, enter the amount, select a category and save. Your available balance updates immediately.',tip:'Transactions lets you search your history and edit or delete expenses in the current cycle. Categories lets you organize your spending.'},
 {title:'Make space for your goals',Icon:PiggyBank,text:'Create a savings goal and add money toward it. Saving moves money out of your spendable balance; withdrawing moves it back.',tip:'Your unused balance carries into the next cycle. Money already saved stays with its goal.'},
 {title:'Check in and keep going',Icon:ChartNoAxesCombined,text:'Reports show your spending patterns and cycle history. The reset timer shows when the next cycle starts, and balance alerts help you notice overspending.',tip:'Choose Light, Dark or System in the header or Profile & settings.'},
 {title:'Take Alloca with you',Icon:WifiOff,text:'After signing in online, wait for Offline ready. You can then use your saved budget and record changes without internet. Reconnect to sync them.',tip:'The Help button in the corner always brings this walkthrough back. You can skip or replay it whenever you like.'},
];
export function QuickTour(){
 const {data}=useBudget();const [open,setOpen]=useState(false),[step,setStep]=useState(0);const checked=useRef('');
 useEffect(()=>{if(!data||checked.current===data.profile.id)return;checked.current=data.profile.id;
 try{if(!localStorage.getItem('alloca-tour-v1:'+data.profile.id)){setStep(0);setOpen(true)}}catch{setOpen(true)}
 },[data]);
 function close(){setOpen(false);if(data)try{localStorage.setItem('alloca-tour-v1:'+data.profile.id,'seen')}catch{/* Replay stays available when storage is unavailable. */}}
 const current=steps[step],Icon=current.Icon;
 return <><button type="button" className="help-button" aria-label="Help: replay the Alloca tutorial" onClick={()=>{setStep(0);setOpen(true)}}><CircleHelp size={20}/><span>Help</span></button>
 <Dialog open={open} onOpenChange={value=>value?setOpen(true):close()}><DialogContent className="quick-tour"><div className="tour-icon"><Icon size={28}/></div><p className="eyebrow">QUICK START · {step+1} OF {steps.length}</p><DialogTitle>{current.title}</DialogTitle><DialogDescription>{current.text}</DialogDescription><p className="tour-tip">{current.tip}</p><div className="tour-dots" aria-hidden="true">{steps.map((_,i)=><span key={i} data-active={i===step}/>)}</div><div className="tour-actions"><button type="button" className="text-link" onClick={close}>Skip tour</button><div>{step>0&&<button type="button" className="btn btn-outline" onClick={()=>setStep(s=>s-1)}>Back</button>}<button type="button" className="btn" onClick={()=>step===steps.length-1?close():setStep(s=>s+1)}>{step===steps.length-1?'Let’s get started':'Next'}</button></div></div></DialogContent></Dialog></>;
}
