import { useEffect, useRef, useState } from "react";
import {
  Button,
  Notice,
  RadioGroup,
  Select,
  TextField,
  Textarea,
  type SelectOption,
} from "~/design-system";
import {
  CONTACT_METHODS,
  FIELD_IDS,
  LIMITS,
  LOCAL_SERVICE_VALUE,
  ORDER_FIELDS,
  readOrder,
  validateOrder,
  type OrderErrors,
  type OrderResponse,
} from "~/lib/order";
import styles from "./OrderForm.module.css";

// Cloudflare's public test key, which always passes. Set VITE_TURNSTILE_SITE_KEY
// for production (see README).
const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string | HTMLElement) => void };
  }
}

type Status = "idle" | "submitting" | "sent";

/**
 * Progressive enhancement:
 * - Without JavaScript the form posts straight to /api/order, which redirects
 *   to /order/thanks. (Turnstile itself needs JavaScript, so in practice a
 *   no-JS submission is rejected as spam. See README "Known limitations".)
 * - With JavaScript: we validate in the browser, show an error summary and
 *   move focus to it, then submit with fetch and show the confirmation here.
 */
export function OrderForm({ products }: { products: SelectOption[] }) {
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formError, setFormError] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [product, setProduct] = useState("");
  const [sentName, setSentName] = useState("");
  // Native browser validation stays on until JavaScript takes over.
  const [enhanced, setEnhanced] = useState(false);
  // Bumped on every failed submit so focus moves even if errors are unchanged.
  const [attempt, setAttempt] = useState(0);

  const summaryRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  const productOptions: SelectOption[] = [
    ...products,
    { value: LOCAL_SERVICE_VALUE, label: "A local service (by appointment)" },
  ];

  useEffect(() => {
    setEnhanced(true);
    // Pre-fill the product from ?product=slug. This runs after hydration
    // because the pre-rendered HTML can't know the query string.
    const fromUrl = new URLSearchParams(window.location.search).get("product");
    if (fromUrl && productOptions.some((o) => o.value === fromUrl)) setProduct(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);

  useEffect(() => {
    if (status === "sent") confirmationRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const input = readOrder(formData);
    const clientErrors = validateOrder(input);
    setFormError(undefined);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setAttempt((n) => n + 1);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = (await response.json().catch(() => null)) as OrderResponse | null;
      if (response.ok && result?.ok) {
        setSentName(input.name);
        setStatus("sent");
        return;
      }
      setErrors((result && !result.ok && result.errors) || {});
      setFormError(
        (result && !result.ok && result.formError) ||
          "Sorry, something went wrong sending your message. Please try again.",
      );
    } catch {
      setFormError(
        "Your message couldn't be sent. Check your internet connection and try again.",
      );
    }
    window.turnstile?.reset();
    setStatus("idle");
    setAttempt((n) => n + 1);
  }

  if (status === "sent") {
    return (
      <Notice
        ref={confirmationRef}
        tabIndex={-1}
        tone="success"
        title="Message sent"
        className={styles.confirmation}
      >
        {/* TODO(copy): review the confirmation wording. */}
        <p>
          Thanks{sentName ? `, ${sentName}` : ""}. Ryan usually replies within a day or two.
        </p>
      </Notice>
    );
  }

  const errorList = ORDER_FIELDS.filter((f) => errors[f]);
  const hasProblems = errorList.length > 0 || formError;

  return (
    <form
      method="post"
      action="/api/order"
      noValidate={enhanced}
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {/* React 19 moves this into <head> and loads it once. */}
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      {hasProblems && (
        <Notice
          ref={summaryRef}
          tabIndex={-1}
          tone="error"
          title="There's a problem"
          headingLevel={2}
        >
          {formError && <p>{formError}</p>}
          {errorList.length > 0 && (
            <ul>
              {errorList.map((field) => (
                <li key={field}>
                  <a
                    href={`#${FIELD_IDS[field]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(FIELD_IDS[field])?.focus();
                    }}
                  >
                    {errors[field]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Notice>
      )}

      {/* TODO(copy): review labels and hints. */}
      <TextField
        id={FIELD_IDS.name}
        name="name"
        label="Your name"
        autoComplete="name"
        maxLength={LIMITS.name}
        error={errors.name}
      />
      <TextField
        id={FIELD_IDS.email}
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        spellCheck={false}
        maxLength={LIMITS.email}
        error={errors.email}
      />
      <TextField
        id={FIELD_IDS.phone}
        name="phone"
        type="tel"
        label="Phone"
        hint="Needed if you'd like a text or a call."
        optional
        autoComplete="tel"
        maxLength={LIMITS.phone}
        error={errors.phone}
      />
      <Select
        id={FIELD_IDS.product}
        name="product"
        label="Product or service"
        optional
        emptyOption="Nothing specific / general question"
        options={productOptions}
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        error={errors.product}
      />
      <Textarea
        id={FIELD_IDS.message}
        name="message"
        label="Message"
        hint="Please don't include health or hearing details here."
        maxLength={LIMITS.message}
        error={errors.message}
      />
      <RadioGroup
        id={FIELD_IDS.contactMethod}
        name="contactMethod"
        legend="How should Ryan get back to you?"
        options={[...CONTACT_METHODS]}
        inline
        error={errors.contactMethod}
      />

      <div className={styles.turnstile}>
        <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
      </div>

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
