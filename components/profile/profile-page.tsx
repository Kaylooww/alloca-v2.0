"use client";
import {LogoutButton} from "@/components/auth/logout-button";
import { useBudget } from '@/hooks/use-budget';
import { ProfileForm } from './profile-form';
import { DataGate } from '@/components/shared/data-gate';
import { PageHeader } from '@/components/shared/page-header';
import { BrandHeader } from '@/components/branding/brand-header';
export function ProfilePage() { const { data } = useBudget(); return <DataGate><PageHeader title="Your money. Your rhythm." description="Keep your profile and weekly plan up to date."/><div className="profile-grid"><section className="card"><h2>Your allowance plan</h2><ProfileForm initialName=""/></section><section className="card profile-details"><BrandHeader /><dl><dt>Signed in as</dt><dd>{data?.profile.email}</dd><dt>Currency</dt><dd>Philippine peso (PHP)</dd><dt>Weekly cycle</dt><dd>Monday to Sunday · Asia/Manila</dd><dt>Carryover</dt><dd>Your remaining balance moves into the next week automatically. Saved money stays in its goal.</dd><dt>Authentication</dt><dd>Your Alloca account uses a verified email address and password.</dd></dl><LogoutButton className="btn btn-outline"/></section></div></DataGate>; }
