/**
 * Order / inquiry form: field names, validation, and error messages.
 *
 * Shared by the browser (src/components/OrderForm.tsx) and the Cloudflare
 * Pages Function (functions/api/order.ts), so both always agree.
 * Keep this file free of browser-only and Node-only APIs.
 *
 * Privacy: this form intentionally collects NO health or hearing
 * information. Don't add fields for it.
 */

export const CONTACT_METHODS = [
  { value: "text", label: "Text message" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number]["value"];

/** Product select value for "I'm asking about a local service". */
export const LOCAL_SERVICE_VALUE = "local-service";

export interface OrderInput {
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  contactMethod: string;
}

export type OrderField = keyof OrderInput;
export type OrderErrors = Partial<Record<OrderField, string>>;

/** Fields in on-screen order. The error summary lists errors in this order. */
export const ORDER_FIELDS: OrderField[] = [
  "name",
  "email",
  "phone",
  "product",
  "message",
  "contactMethod",
];

/** DOM id for each field, so the error summary can link to it. */
export const FIELD_IDS: Record<OrderField, string> = {
  name: "order-name",
  email: "order-email",
  phone: "order-phone",
  product: "order-product",
  message: "order-message",
  contactMethod: "order-contact-method",
};

export const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  product: 120,
  message: 3000,
} as const;

export function readOrder(form: FormData): OrderInput {
  const get = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    product: get("product"),
    message: get("message"),
    contactMethod: get("contactMethod"),
  };
}

// TODO(copy): review the wording of these error messages.
export function validateOrder(input: OrderInput): OrderErrors {
  const errors: OrderErrors = {};

  if (!input.name) errors.name = "Enter your name.";
  else if (input.name.length > LIMITS.name)
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (!input.email) errors.email = "Enter your email address.";
  else if (input.email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
    errors.email = "Enter an email address like name@example.com.";

  const wantsPhone = input.contactMethod === "text" || input.contactMethod === "phone";
  const digits = input.phone.replace(/\D/g, "");
  if (!input.phone && wantsPhone)
    errors.phone = "Enter a phone number so Ryan can text or call you.";
  else if (input.phone && (digits.length < 10 || input.phone.length > LIMITS.phone))
    errors.phone = "Enter a phone number with area code, like 816-555-0123.";

  if (input.product.length > LIMITS.product) errors.product = "Choose a product from the list.";

  if (!input.message) errors.message = "Enter a message.";
  else if (input.message.length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;

  if (!CONTACT_METHODS.some((m) => m.value === input.contactMethod))
    errors.contactMethod = "Choose how you'd like Ryan to get back to you.";

  return errors;
}

/** JSON shape returned by /api/order. */
export type OrderResponse =
  | { ok: true }
  | { ok: false; errors?: OrderErrors; formError?: string };
