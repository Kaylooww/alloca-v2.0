import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
export const metadata: Metadata = { title: 'Alloca — Give every money a purpose', description: 'A little more intention. A lot more possibility. Your student allowance, expenses, and savings in one place.', icons: { icon: '/logo/favicon.svg' } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body>{children}<Toaster position="bottom-right" richColors theme="light"/></body></html>; }
