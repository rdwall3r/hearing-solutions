import { useEffect, useRef } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./design-system/tokens.css";
import "./design-system/base.css";
import { Layout as SiteLayout, Link, themeScript, type NavItem } from "~/design-system";
import { Placeholder } from "~/components/Placeholder";
import { SITE } from "~/lib/site";
import site from "~/styles/site.module.css";

export const links: Route.LinksFunction = () => [
  // Favicons: browsers that support SVG use favicon.svg, which switches
  // between light and dark versions; others fall back to favicon.ico.
  // sizes="32x32" stops Chrome from choosing the .ico over the SVG.
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  // Home-screen icon for iPhone and iPad.
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&display=swap",
  },
];

const NAV: NavItem[] = [
  { to: "/products", label: "Products" },
  { to: "/services", label: "Local services" },
  { to: "/about", label: "About" },
  { to: "/order", label: "Order or ask" },
];

/** The HTML document. Shared by every page, including error pages. */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: themeScript may set data-theme on <html>
    // before React hydrates.
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Applies a saved light/dark choice before the page draws. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <>
      <Placeholder>
        a line making clear this is Ryan's personal side project, not a company.
      </Placeholder>
      <p>
        {SITE.owner}, Missouri-licensed hearing instrument specialist · {SITE.location}
        <br />
        License: {SITE.licenseNumber}
      </p>
      <nav aria-label="Footer">
        <ul role="list" className={`list-reset ${site.footerNav}`}>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/order">Contact</Link>
          </li>
          <li>
            <Link to="/accessibility">Accessibility</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SiteLayout
      siteName={SITE.name}
      byline={SITE.tagline}
      nav={NAV}
      footer={<SiteFooter />}
    >
      {children}
    </SiteLayout>
  );
}

/**
 * After a client-side navigation, move focus to <main> so screen reader and
 * keyboard users start at the new page's content (like a full page load).
 * Skipped on first load and for same-page #hash links.
 */
function useFocusMainOnNavigate() {
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (location.hash) return;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname]);
}

export default function App() {
  useFocusMainOnNavigate();
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let details = "Sorry, this page couldn't be loaded. Please try again later.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error) && error.status === 404) {
    title = "Page not found";
    details = "Sorry, there's no page at this address.";
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Shell>
      <title>{`${title} | ${SITE.name}`}</title>
      <h1>{title}</h1>
      <p>{details}</p>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
      {stack && (
        <pre style={{ overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </Shell>
  );
}
