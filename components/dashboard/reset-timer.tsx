"use client";
import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
export function ResetTimer({ end }: {
    end: string;
}) { const [remaining, setRemaining] = useState(''); useEffect(() => { const tick = () => { const n = Math.max(0, new Date(end).getTime() - Date.now()); setRemaining(`${Math.floor(n / 86400000)}d ${Math.floor(n / 3600000) % 24}h ${Math.floor(n / 60000) % 60}m`); }; tick(); const id = setInterval(tick, 30000); return () => clearInterval(id); }, [end]); return <span className="timer"><Clock3 size={15}/> Next cycle in {remaining || '…'}</span>; }
