/**
 * Product categories. The slug is the URL segment (/products/:category) and
 * must match the `category` field in product files.
 *
 * Labels are short navigation names. Descriptions are placeholders for Ryan.
 */
export const CATEGORIES = [
  {
    slug: "otc-hearing-aids",
    label: "OTC hearing aids",
    description: "TODO(copy): one or two sentences about OTC hearing aids.",
  },
  {
    slug: "assistive-listening",
    label: "Assistive listening",
    description: "TODO(copy): one or two sentences about assistive listening devices.",
  },
  {
    slug: "alerting",
    label: "Alerting devices",
    description: "TODO(copy): one or two sentences about alerting devices.",
  },
  {
    slug: "hearing-protection",
    label: "Hearing protection",
    description: "TODO(copy): one or two sentences about hearing protection.",
  },
  {
    slug: "accessories",
    label: "Accessories",
    description: "TODO(copy): one or two sentences about accessories.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type Category = (typeof CATEGORIES)[number];

export function getCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(value: unknown): value is CategorySlug {
  return typeof value === "string" && CATEGORIES.some((c) => c.slug === value);
}
