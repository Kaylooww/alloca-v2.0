"use client";
import { useBudget } from '@/hooks/use-budget';
import { ProfileForm } from '@/components/profile/profile-form';
import { Skeleton } from '@/components/ui/skeleton';
export function DataGate({ children }: {
    children: React.ReactNode;
}) { const { loading, error, needsSetup, refresh } = useBudget(); if (loading)
    return <div className="loading-grid" aria-label="Loading your budget"><Skeleton className="h-20 w-2/3"/><Skeleton className="h-60 w-full"/><Skeleton className="h-80 w-full"/></div>; if (error)
    return <section className="card empty-state" role="alert"><h2>Let’s try that again</h2><p>{error}</p><a href="/login" className="text-link">Sign in online</a><button className="btn" onClick={() => void refresh()}>Retry</button></section>; if (needsSetup)
    return <section className="onboarding card"><span className="pill">A fresh start</span><h1>Make room for what matters.</h1><p className="muted">Set up your weekly allowance. From your next meal to your next big goal, give every money a purpose.</p><ProfileForm initialName=""/><p className="small muted">Your week runs Monday–Sunday, Philippine time. Money is added only when you confirm that you’ve received it.</p></section>; return children; }
