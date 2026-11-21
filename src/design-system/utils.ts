/** Joins class names, skipping falsy values. Tiny stand-in for `clsx`. */
export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

/** Formats a price in US dollars, e.g. 199 → "$199.00". */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
