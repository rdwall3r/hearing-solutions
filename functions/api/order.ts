/**
 * POST /api/order: Cloudflare Pages Function for the order/inquiry form.
 *
 *   1. Validate the input (same rules as the browser: src/lib/order.ts)
 *   2. Verify the Cloudflare Turnstile token
 *   3. Send an email to Ryan through an email API (stubbed, see sendEmail)
 *
 * Plain fetch, no SDKs. Responds with JSON when the browser asks for it
 * (the enhanced form), otherwise with a redirect or a small HTML page (no-JS).
 *
 * Environment variables (Pages → Settings → Variables and Secrets, or
 * .dev.vars locally; see README):
 *   TURNSTILE_SECRET_KEY  required
 *   EMAIL_API_URL         required unless EMAIL_DRY_RUN=true
 *   EMAIL_API_KEY         required unless EMAIL_DRY_RUN=true (secret)
 *   EMAIL_TO              where inquiries go (Ryan's inbox)
 *   EMAIL_FROM            verified sender address at the email provider
 *   EMAIL_DRY_RUN         "true" logs the email instead of sending it
 */
import {
  CONTACT_METHODS,
  LOCAL_SERVICE_VALUE,
  readOrder,
  validateOrder,
  type OrderInput,
  type OrderResponse,
} from "../../src/lib/order";

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  EMAIL_API_URL?: string;
  EMAIL_API_KEY?: string;
  EMAIL_TO?: string;
  EMAIL_FROM?: string;
  EMAIL_DRY_RUN?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const MAX_BODY_BYTES = 20_000;

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const wantsJson = (request.headers.get("Accept") ?? "").includes("application/json");
  const fail = (status: number, body: Extract<OrderResponse, { ok: false }>) =>
    wantsJson ? json(status, body) : errorPage(status, body);

  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return fail(413, { ok: false, formError: "That message is too long. Please shorten it." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, { ok: false, formError: "The form couldn't be read. Please try again." });
  }

  // 1. Validate
  const input = readOrder(form);
  const errors = validateOrder(input);
  if (Object.keys(errors).length > 0) return fail(400, { ok: false, errors });

  // 2. Turnstile
  const token = form.get("cf-turnstile-response");
  const ip = request.headers.get("CF-Connecting-IP") ?? undefined;
  const human = await verifyTurnstile(typeof token === "string" ? token : "", ip, env);
  if (!human) {
    return fail(400, {
      ok: false,
      formError: "We couldn't confirm you're not a spam bot. Please complete the check and try again.",
    });
  }

  // 3. Email
  try {
    await sendEmail(input, env);
  } catch (error) {
    console.error("order: email failed", error);
    return fail(502, {
      ok: false,
      formError: "Sorry, your message couldn't be sent right now. Please try again later.",
    });
  }

  return wantsJson ? json(200, { ok: true }) : Response.redirect(new URL("/order/thanks", request.url).href, 303);
}

// ---- Turnstile -------------------------------------------------------------

async function verifyTurnstile(token: string, ip: string | undefined, env: Env): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("order: TURNSTILE_SECRET_KEY is not set");
    return false; // fail closed
  }
  if (!token) return false;

  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const outcome = (await res.json()) as { success?: boolean };
    return outcome.success === true;
  } catch (error) {
    console.error("order: Turnstile verification failed", error);
    return false;
  }
}

// ---- Email -----------------------------------------------------------------

async function sendEmail(input: OrderInput, env: Env): Promise<void> {
  const method = CONTACT_METHODS.find((m) => m.value === input.contactMethod)?.label ?? input.contactMethod;
  const product =
    input.product === LOCAL_SERVICE_VALUE ? "A local service" : input.product || "Nothing specific";

  // Strip line breaks so user input can't add email headers.
  const subject = `Website inquiry from ${input.name.replace(/[\r\n]+/g, " ")}`;
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "(not given)"}`,
    `Preferred contact: ${method}`,
    `Product: ${product}`,
    "",
    input.message,
  ].join("\n");

  if (env.EMAIL_DRY_RUN === "true") {
    console.log(`order: EMAIL_DRY_RUN, not sending.\nSubject: ${subject}\n${text}`);
    return;
  }

  if (!env.EMAIL_API_URL || !env.EMAIL_API_KEY || !env.EMAIL_TO || !env.EMAIL_FROM) {
    throw new Error("Email is not configured (EMAIL_API_URL, EMAIL_API_KEY, EMAIL_TO, EMAIL_FROM)");
  }

  // TODO(email): adjust the request to match your email provider's API.
  // This shape (Bearer token + JSON with from/to/subject/text/reply_to) is
  // common, but field names differ between providers. Check their docs.
  const res = await fetch(env.EMAIL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [env.EMAIL_TO],
      reply_to: input.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Email API responded ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

// ---- Responses -------------------------------------------------------------

function json(status: number, body: OrderResponse): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** Minimal accessible error page for no-JavaScript submissions. */
function errorPage(status: number, body: Extract<OrderResponse, { ok: false }>): Response {
  const items = [body.formError, ...Object.values(body.errors ?? {})].filter(Boolean) as string[];
  const html = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>There's a problem | R.D. Waller Hearing Aid Service</title>
<style>body{font:125%/1.6 system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;color:#2b2622;background:#fdfaf3}a{color:#2a4763}</style>
</head>
<body>
<main>
<h1>There's a problem</h1>
<ul>${items.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
<p><a href="/order">Go back to the form</a> (use your browser's Back button to keep what you typed).</p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
