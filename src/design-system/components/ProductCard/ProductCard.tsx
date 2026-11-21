import { formatPrice } from "../../utils";
import { Link } from "../Link/Link";
import styles from "./ProductCard.module.css";

export interface ProductCardProps {
  title: string;
  brand: string;
  /** Path to the product page. */
  to: string;
  price: number;
  inStock: boolean;
  otc?: boolean;
  /** Image path. The image is decorative in the card because the title says what it is. */
  imageSrc?: string;
  summary?: string;
  /** Match the page outline: 2 directly under the h1, 3 under a section h2. */
  headingLevel?: 2 | 3;
}

/**
 * One product in a list. Render cards inside <ul role="list"> with each card
 * in an <li>, so screen readers announce how many products there are.
 */
export function ProductCard({
  title,
  brand,
  to,
  price,
  inStock,
  otc,
  imageSrc,
  summary,
  headingLevel = 3,
}: ProductCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className={styles.card}>
      <Heading className={styles.title}>
        <Link to={to} className={styles.link}>
          {title}
        </Link>
      </Heading>
      {imageSrc && (
        <img className={styles.image} src={imageSrc} alt="" width={480} height={360} loading="lazy" />
      )}
      <p className={styles.brand}>{brand}</p>
      {summary && <p className={styles.summary}>{summary}</p>}
      <dl className={styles.facts}>
        <div>
          <dt className="visually-hidden">Price</dt>
          <dd className={styles.price}>{formatPrice(price)}</dd>
        </div>
        <div>
          <dt className="visually-hidden">Availability</dt>
          <dd>{inStock ? "In stock" : "Out of stock"}</dd>
        </div>
        {otc && (
          <div>
            <dt className="visually-hidden">Type</dt>
            <dd className={styles.tag}>OTC hearing aid</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
