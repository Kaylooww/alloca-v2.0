'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

const options = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const;

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div className={`theme-switcher${compact ? ' theme-compact' : ''}`} role="group" aria-label="Color theme">
    {options.map(({ value, label, Icon }) => <button key={value} type="button"
      disabled={!mounted} aria-pressed={mounted && theme === value}
      aria-label={`${label} theme`} title={value === 'system' ? 'Follow your device theme' : `${label} theme`}
      onClick={() => setTheme(value)}>
      <Icon size={17} aria-hidden="true" /><span>{label}</span>
    </button>)}
  </div>;
}

export function AppearanceSettings() {
  return <section className="card appearance-settings"><h2>Make yourself comfortable</h2>
    <p className="muted small">Choose a light or soft dark appearance, or follow your device. Your choice stays saved on this device, including offline.</p>
    <ThemeSwitcher />
  </section>;
}
