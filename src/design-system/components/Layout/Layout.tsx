import { NavLink } from "react-router";
import { Link } from "../Link/Link";
import { SkipLink } from "../SkipLink/SkipLink";
import styles from "./Layout.module.css";

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
 *
 * <main> has id="main" for the skip link and tabIndex={-1} so it can take
 * focus programmatically without joining the tab order.
 */
export function Layout({ siteName, byline, nav, footer, children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <SkipLink targetId="main" />
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <Link to="/" className={styles.siteName}>
              {siteName}
            </Link>
            {byline && <p className={styles.byline}>{byline}</p>}
          </div>
          <nav aria-label="Main" className={styles.nav}>
            <ul role="list" className={`list-reset ${styles.navList}`}>
              {nav.map((item) => (
                <li key={item.to}>
                  {/* NavLink sets aria-current="page" on the active link. */}
                  <NavLink to={item.to} className={styles.navLink} end={item.to === "/"}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.inner}>{children}</div>
      </main>
      {footer && (
        <footer className={styles.footer}>
          <div className={styles.inner}>{footer}</div>
        </footer>
      )}
    </div>
  );
}
