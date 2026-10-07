'use client';

import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';

function BrowserChrome() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = resolvedTheme === 'dark' ? '#141c1a' : '#f7f9f6';
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemeProvider attribute="class" defaultTheme="system" enableSystem
    storageKey="alloca-theme" disableTransitionOnChange>
    <BrowserChrome />{children}
  </NextThemeProvider>;
}
