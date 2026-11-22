/** Formats a price in US dollars, e.g. 199 → "$199.00". */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
