# R.D. Waller Hearing Aid

A small, accessible shop site for R.D. Waller Hearing Aid, Ryan Waller's personal side
project. It sells OTC hearing aids and assistive listening devices by mail and
offers a few local services by appointment in Parkville, MO.

- **React Router v8** in framework mode, TypeScript, Vite
- **Fully pre-rendered**: every content page is static HTML in `build/client`
- **Plain CSS**: CSS Modules on top of design tokens (CSS custom properties)
- **Cloudflare Pages** for hosting, plus one Pages Function for the order form

All page copy is placeholder text marked `TODO(copy)`. It shows on the page in
a dashed box. Find everything left to do with:

```sh
grep -rn "TODO(" src content functions
```

## Requirements

- Node.js 22 or newer (developed on Node 25, npm 11)

## Run it

```sh
npm install
npm run dev          # http://localhost:5173
```

The dev server doesn't run the Pages Function, so submitting the order form in
dev fails with a "couldn't be sent" message. To test the form end to end, see
[Testing the order form locally](#testing-the-order-form-locally).

## Build

```sh
npm run build        # → build/client (static site)
npm run preview      # serve build/client locally
```

The build:

1. Reads products from `content/products/*.md`
2. Pre-renders every page to `build/client/**/index.html` (the list is in
   `react-router.config.ts`)
3. Copies the SPA fallback to `build/client/404.html`, so unknown URLs show the
   site's "Page not found" page with a real 404 status

A product file with a missing or mistyped field fails the build with the file
name and the problem. See `content/README.md` for the product format.

Other checks:

```sh
npm run typecheck        # TypeScript + React Router route types
npm run check:contrast   # WCAG contrast for every color pair in tokens.css
```

## Storybook

```sh
npm run storybook        # http://localhost:6006
npm run build-storybook  # → storybook-static/
```

Every design-system component has stories, including focus and error states.
The **Accessibility** panel (axe) runs on each story. Fix anything it reports
before using a component on the site.

## Project layout

```
content/products/      Product Markdown files (frontmatter + description)
functions/api/order.ts Cloudflare Pages Function: POST /api/order
public/                Static files copied as-is (images, favicon)
scripts/               Build helpers (postbuild, contrast check)
src/
  design-system/       Tokens, base CSS, components and their stories
  components/          Site-specific components (OrderForm, Placeholder)
  lib/                 Content loading, categories, order validation, site settings
  routes/              One file per page
  routes.ts            URL → route file map
  root.tsx             HTML document, header/nav/footer, error page
```

## Deploy to Cloudflare Pages

1. Push the repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, and pick the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `build/client`
   - Environment variable: `NODE_VERSION` = `22` (or newer)
4. Cloudflare finds `functions/` automatically and deploys `/api/order`.
5. Add the environment variables below (**Settings → Variables and Secrets**),
   then redeploy.
6. Set up Turnstile: **Turnstile → Add widget**, add your domain, and copy
   the site key and secret key into the variables below.

### Environment variables

| Name                      | Where it's used            | Secret? | Notes                                                    |
| ------------------------- | -------------------------- | ------- | -------------------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY` | Build (browser)            | No      | Turnstile site key. Falls back to Cloudflare's test key. |
| `TURNSTILE_SECRET_KEY`    | Pages Function             | **Yes** | Turnstile secret key. Without it, every submission fails. |
| `EMAIL_API_URL`           | Pages Function             | No      | Your email provider's "send" endpoint.                   |
| `EMAIL_API_KEY`           | Pages Function             | **Yes** | Your email provider's API key.                           |
| `EMAIL_TO`                | Pages Function             | No      | Where inquiries are delivered (Ryan's inbox).            |
| `EMAIL_FROM`              | Pages Function             | No      | A sender address verified with the email provider.       |
| `EMAIL_DRY_RUN`           | Pages Function             | No      | `true` logs emails instead of sending them.              |

`VITE_TURNSTILE_SITE_KEY` is read at **build** time, so set it for the build
environment. The rest are read by the function at request time.

The email request in `functions/api/order.ts` (`sendEmail`) is a stub marked
`TODO(email)`. Adjust the JSON body and headers to match your provider's API.

### Testing the order form locally

The Pages Function runs under Cloudflare's `wrangler` CLI. It isn't a project
dependency, so `npx` downloads it on first use:

```sh
cp .dev.vars.example .dev.vars   # test Turnstile secret + EMAIL_DRY_RUN=true
npm run build
npx wrangler pages dev build/client
```

With `EMAIL_DRY_RUN=true`, the email prints in the terminal instead of being
sent.

## Accessibility

The target is WCAG 2.2 AA. Built in:

- Landmarks (header, nav, main, footer), skip link, one `h1` per page, and a
  logical heading order
- A strong focus ring on everything focusable, never removed without a
  replacement
- Lists styled without bullets keep `role="list"`
- Every form control has a visible label. Errors are tied to their fields
  (`aria-describedby`), listed in a summary, and focus moves to the summary
- After client-side navigation, focus moves to `<main>`
- 20px base text in `rem`, layouts that reflow at 320px wide and 200% zoom
- Animations only when the user hasn't asked for reduced motion
- Content pages are complete HTML and work without JavaScript

Before launch, test manually: keyboard only, a screen reader (VoiceOver), 200%
and 400% zoom, and a 320px-wide window.

## Known limitations

- **Order form without JavaScript**: the form posts normally, but Turnstile
  needs JavaScript, so a no-JS submission is rejected as spam with a plain
  error page. People without JavaScript need another way to make contact.
  TODO: publish a phone number or email address somewhere on the site.
- **Product descriptions** are plain paragraphs. Markdown formatting (links,
  bold, lists) isn't rendered yet.
- **Fonts** load from Google Fonts, a third-party request. Self-hosting
  Atkinson Hyperlegible would remove it.
