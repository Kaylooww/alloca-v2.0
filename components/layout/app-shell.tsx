"use client";
import {LogoutButton} from "@/components/auth/logout-button";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, ChartNoAxesCombined, Goal, Tags, Settings, LogOut, ArrowUpRight, Sparkles } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { BrandHeader } from '@/components/branding/brand-header';
import { BudgetProvider, useBudget } from '@/hooks/use-budget';
const links = [['/dashboard', 'Overview', LayoutDashboard], ['/expenses', 'Transactions', ArrowLeftRight], ['/savings', 'Savings goals', Goal], ['/reports', 'Reports', ChartNoAxesCombined], ['/categories', 'Categories', Tags]] as const;
function Shell({ children, name }: {
    children: React.ReactNode;
    name: string;
}) { const path = usePathname(); const { data } = useBudget(); const display = data?.profile.name || name; return <SidebarProvider><Sidebar className="alloca-sidebar"><SidebarHeader className="sidebar-brand"><BrandHeader tagline={false}/><p className="sidebar-tagline">Give every money a purpose</p></SidebarHeader><SidebarContent><p className="nav-caption">WORKSPACE</p><SidebarMenu className="navigation">{links.map(([url, label, Icon]) => <SidebarMenuItem key={url}><SidebarMenuButton asChild isActive={path === url}><a href={url}><Icon size={19}/><span>{label}</span></a></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu><div className="sidebar-tip"><Sparkles size={22}/><h3>Small steps.<br />Bigger possibilities.</h3><p>Your future self will thank you for saving today.</p><a href="/savings">Make a little progress <ArrowUpRight size={16}/></a></div></SidebarContent><SidebarFooter className="sidebar-footer"><a href="/profile"><Settings size={18}/> Profile & settings</a><LogoutButton className="sidebar-logout"/><div className="user-block"><span className="avatar">{display.slice(0, 1).toUpperCase()}</span><span><strong>{display}</strong><small>Student account</small></span></div></SidebarFooter></Sidebar><SidebarInset className="workspace"><div className="topbar"><div className="topbar-left"><SidebarTrigger /><span>My workspace</span><span className="slash">/</span><strong>{links.find(l => l[0] === path)?.[1] || 'Profile & settings'}</strong></div><a href="/profile" className="top-profile"><span className="pill">Student life, sorted</span><span className="avatar small-avatar">{display.slice(0, 1).toUpperCase()}</span></a></div><main className="main-content">{children}</main><footer className="app-footer"><span>Alloca · Give every money a purpose</span><span>Made for your student journey.</span></footer></SidebarInset></SidebarProvider>; }
export function AppShell({ children, name }: {
    children: React.ReactNode;
    name: string;
}) { return <BudgetProvider><Shell name={name}>{children}</Shell></BudgetProvider>; }
