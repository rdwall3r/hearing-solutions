import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button } from '../Button/Button';
import { Link } from '../Link/Link';
import { SkipLink } from '../SkipLink/SkipLink';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './Layout.module.css';

export interface NavItem {
  to: string;
  label: string;
}

export interface LayoutProps {
  siteName: string;
  /** Short line under the site name, e.g. who runs it and where. */
  byline?: React.ReactNode;
  nav: NavItem[];
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The page shell: skip link, then the four landmarks in order
 * (banner/header → navigation → main → contentinfo/footer).
 * The footer always ends with the light/dark mode toggle, bottom right.
 *
 * <main> has id="main" for the skip link and tabIndex={-1} so it can take
 * focus programmatically without joining the tab order.
 *
 * On narrow screens (and at high zoom) the nav collapses behind a "Menu"
 * disclosure button. That only happens once JavaScript has run: without it,
 * the links are always shown and wrap below the site name.
 */
export function Layout({
  siteName,
  byline,
  nav,
  footer,
  children,
}: LayoutProps) {
  const menu = useMenuDisclosure();
  return (
    <div className={styles.page}>
      <SkipLink targetId="main" />
      <header
        ref={menu.headerRef}
        className={styles.header}
        data-menu={menu.state}
      >
        <div className={styles.inner}>
          <div className={styles.brand}>
            <Link to="/" className={styles.siteName}>
              {siteName}
            </Link>
            {byline && <p className={styles.byline}>{byline}</p>}
          </div>
          {/* Wraps the button and nav so the open dropdown can be positioned
              against the button. */}
          <div className={styles.menu}>
            {menu.state && (
              <Button
                ref={menu.buttonRef}
                variant="secondary"
                size="small"
                className={styles.menuButton}
                aria-expanded={menu.state === 'open'}
                aria-controls={menu.navId}
                onClick={menu.toggle}
              >
                <MenuIcon open={menu.state === 'open'} />
                Menu
              </Button>
            )}
            <nav id={menu.navId} aria-label="Main" className={styles.nav}>
              <ul role="list" className={`list-reset ${styles.navList}`}>
                {nav.map((item) => (
                  <li key={item.to}>
                    {/* NavLink sets aria-current="page" on the active link. */}
                    <NavLink
                      to={item.to}
                      className={styles.navLink}
                      end={item.to === '/'}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.inner}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.footerContent}>{footer}</div>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}

/**
 * State for the small-screen menu. `state` is undefined until after
 * hydration, so server-rendered and no-JS pages always show the full nav.
 * Closes on navigation, on Escape (returning focus to the button), and when
 * the user clicks, taps or tabs anywhere outside the header.
 */
function useMenuDisclosure() {
  const [state, setState] = useState<'open' | 'closed'>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navId = useId();
  const { pathname } = useLocation();

  useEffect(() => setState('closed'), [pathname]);

  useEffect(() => {
    if (state !== 'open') return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setState('closed');
      buttonRef.current?.focus();
    }
    function onOutside(event: Event) {
      if (!headerRef.current?.contains(event.target as Node))
        setState('closed');
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [state]);

  return {
    state,
    buttonRef,
    headerRef,
    navId,
    toggle: () => setState((s) => (s === 'open' ? 'closed' : 'open')),
  };
}

/** Three bars, or an X when the menu is open. Decorative: the button says "Menu". */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={styles.menuIcon}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}
