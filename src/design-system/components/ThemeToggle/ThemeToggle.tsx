import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import styles from './ThemeToggle.module.css';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs in <head> before the page draws, so a saved choice applies without a
 * flash of the wrong theme. Inline it with:
 *   <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 */
export const themeScript = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

function currentTheme(): Theme {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Switches between light and dark mode. Until it's used, the site follows
 * the device setting; after that, the choice is saved in this browser.
 *
 * A small round icon button, as on rdwaller.net: a moon in light mode, a sun
 * in dark mode. Its accessible name says what it will do ("Switch to dark
 * mode"), and the same text shows as a tooltip on hover.
 *
 * Renders nothing until JavaScript has run: without JS the device setting
 * still applies, but there's no way to change it.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    setTheme(currentTheme());
    // Keep the label right if the device setting changes while the visitor
    // hasn't made their own choice.
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setTheme(currentTheme());
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (!theme) return null;

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  function toggle() {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (e.g. private mode): the choice lasts for this page.
    }
    setTheme(next);
  }

  const label = `Switch to ${next} mode`;
  return (
    <button
      type="button"
      className={clsx(styles.toggle, className)}
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      {next === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M9.53 1.72a.75.75 0 0 1 .16.82A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9c1.23 0 2.4-.24 3.46-.69a.75.75 0 0 1 .98.98A10.5 10.5 0 0 1 12.75 21.75C6.95 21.75 2.25 17.05 2.25 11.25c0-4.37 2.67-8.11 6.46-9.69a.75.75 0 0 1 .82.16Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.25" fill="currentColor" stroke="none" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}
