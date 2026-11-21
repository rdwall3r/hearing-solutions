/**
 * Reads products from content/products/*.md at build time.
 *
 * The `.server` suffix keeps this module (and its use of node:fs) out of the
 * browser bundle. It's called from route loaders, which run during
 * pre-rendering, and from react-router.config.ts to list the pages to
 * pre-render.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isCategorySlug, type CategorySlug } from "./categories";
import { parseFrontmatter, type FrontmatterValue } from "./frontmatter";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  title: string;
  slug: string;
  brand: string;
  category: CategorySlug;
  price: number;
  inStock: boolean;
  otc: boolean;
  upgradeEligible: boolean;
  images: ProductImage[];
  summary: string;
  /** Markdown body, split into plain paragraphs (no Markdown formatting yet). */
  paragraphs: string[];
}

const PRODUCTS_DIR = join(process.cwd(), "content", "products");

let cache: Product[] | undefined;

export function getAllProducts(): Product[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".md"));
  const products = files.map((file) => {
    const source = readFileSync(join(PRODUCTS_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(source, `content/products/${file}`);
    return toProduct(data, body, file);
  });

  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p.slug)) throw new Error(`Duplicate product slug "${p.slug}"`);
    seen.add(p.slug);
  }

  cache = products.sort((a, b) => a.title.localeCompare(b.title));
  return cache;
}

export function getProductsInCategory(category: CategorySlug): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getProduct(category: string, slug: string): Product | undefined {
  return getAllProducts().find((p) => p.category === category && p.slug === slug);
}

/** URL paths for every product page, used by the pre-render config. */
export function getProductPaths(): string[] {
  return getAllProducts().map((p) => productPath(p));
}

export function productPath(p: Pick<Product, "category" | "slug">) {
  return `/products/${p.category}/${p.slug}`;
}

// ---- Validation -----------------------------------------------------------

function toProduct(data: Record<string, FrontmatterValue>, body: string, file: string): Product {
  const where = `content/products/${file}`;
  const err = (msg: string): never => {
    throw new Error(`${where}: ${msg}`);
  };
  const str = (key: string) => {
    const v = data[key];
    if (typeof v !== "string" || v.trim() === "") err(`"${key}" must be a non-empty string`);
    return v as string;
  };
  const bool = (key: string) => {
    const v = data[key];
    if (typeof v !== "boolean") err(`"${key}" must be true or false`);
    return v as boolean;
  };

  const slug = str("slug");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`"slug" must be lowercase-with-dashes`);
  if (file.replace(/\.md$/, "") !== slug) err(`file name must match slug ("${slug}.md")`);

  const category = data.category;
  if (!isCategorySlug(category)) err(`"category" must be one of the slugs in src/lib/categories.ts`);

  const price = data.price;
  if (typeof price !== "number" || price < 0) err(`"price" must be a number like 199 or 49.95`);

  const rawImages = data.images;
  if (!Array.isArray(rawImages) || rawImages.length === 0) err(`"images" needs at least one entry`);
  const images = (rawImages as unknown[]).map((img, n) => {
    if (!img || typeof img !== "object") err(`images[${n}] must have "src" and "alt"`);
    const { src, alt } = img as Record<string, unknown>;
    if (typeof src !== "string" || !src) err(`images[${n}].src is required`);
    // alt may be "" only if the image is purely decorative. Require the key.
    if (typeof alt !== "string") err(`images[${n}].alt is required (describe the image)`);
    return { src: src as string, alt: alt as string };
  });

  return {
    title: str("title"),
    slug,
    brand: str("brand"),
    category: category as CategorySlug,
    price: price as number,
    inStock: bool("inStock"),
    otc: bool("otc"),
    upgradeEligible: bool("upgradeEligible"),
    images,
    summary: str("summary"),
    paragraphs: body
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean),
  };
}
