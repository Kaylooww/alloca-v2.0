import { requireUser } from '@/lib/auth/user';
import { AppShell } from '@/components/layout/app-shell';
export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: {
    children: React.ReactNode;
}) { const user = await requireUser(); return <AppShell name={user.fullName || 'Student'}>{children}</AppShell>; }
