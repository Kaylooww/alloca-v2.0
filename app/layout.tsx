import { ThemeProvider } from '@/components/theme/theme-provider';
import {PwaRegister} from '@/components/offline/pwa-register';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
export const metadata: Metadata = { title: 'Alloca — Give every money a purpose', description: 'A little more intention. A lot more possibility. Your allowance, expenses, and savings in one place.', manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'Alloca'},icons: { icon: '/logo/favicon.svg',apple:'/logo/icon-192.png' } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en" suppressHydrationWarning><body><ThemeProvider><PwaRegister/>{children}<Toaster position="bottom-right" richColors/></ThemeProvider></body></html>; }
