import { data } from "react-router";
import type { Route } from "./+types/product";
import { formatPrice, Link, Notice, Subheading } from "~/design-system";
import { Placeholder } from "~/components/Placeholder";
import { getCategory } from "~/lib/categories";
import { getProduct, productPath } from "~/lib/products.server";
import { pageTitle, SITE } from "~/lib/site";
import site from "~/styles/site.module.css";

export function loader({ params }: Route.LoaderArgs) {
  const product = getProduct(params.category, params.slug);
  const category = getCategory(params.category);
  if (!product || !category) throw data("Product not found", { status: 404 });
  return { product, category, path: productPath(product) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: pageTitle("Product not found") }];
  const { product, path } = loaderData;
  const url = new URL(path, SITE.url).href;

  return [
    { title: pageTitle(product.title) },
    // TODO(copy): uses the card summary for now. Add a `metaDescription` field if needed.
    { name: "description", content: product.summary },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        sku: product.slug,
        brand: { "@type": "Brand", name: product.brand },
        description: product.summary,
        image: product.images.map((img) => new URL(img.src, SITE.url).href),
        url,
        offers: {
          "@type": "Offer",
          url,
          price: product.price.toFixed(2),
          priceCurrency: "USD",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Person", name: SITE.owner },
        },
      },
    },
  ];
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, category } = loaderData;
  const [mainImage, ...moreImages] = product.images;

  return (
    <>
      <nav aria-label="Breadcrumb" className={site.breadcrumbs}>
        <ol role="list" className="list-reset">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to={`/products/${category.slug}`}>{category.label}</Link>
          </li>
          <li>
            <Link to={`/products/${category.slug}/${product.slug}`} aria-current="page">
              {product.title}
            </Link>
          </li>
        </ol>
      </nav>

      <h1>{product.title}</h1>

      <div className={site.productLayout}>
        <div>
          {mainImage && (
            <img
              className={site.productImage}
              src={mainImage.src}
              alt={mainImage.alt}
              width={480}
              height={360}
            />
          )}
          {moreImages.length > 0 && (
            <ul role="list" className={`list-reset ${site.grid}`}>
              {moreImages.map((img) => (
                <li key={img.src}>
                  <img className={site.productImage} src={img.src} alt={img.alt} loading="lazy" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <dl className={site.facts}>
            <dt>Price</dt>
            <dd className={site.price}>{formatPrice(product.price)}</dd>
            <dt>Brand</dt>
            <dd>{product.brand}</dd>
            <dt>Availability</dt>
            <dd>{product.inStock ? "In stock" : "Out of stock"}</dd>
          </dl>

          {product.otc && (
            // Wording follows FDA OTC hearing aid rules (21 CFR 800.30).
            // TODO(copy): confirm against the manufacturer's labeling.
            <Notice tone="warning" title="Over-the-counter hearing aid" headingLevel={2}>
              <p>
                This device is intended for adults age 18 and older with perceived mild to
                moderate hearing loss.
              </p>
            </Notice>
          )}

          <p>
            <Link to={`/order?product=${product.slug}`} variant="button">
              {product.inStock ? "Order or ask about this" : "Ask about availability"}
            </Link>
          </p>
        </div>
      </div>

      <section aria-labelledby="details-heading">
        <h2 id="details-heading">Details</h2>
        {product.paragraphs.length > 0 ? (
          product.paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <Placeholder>product description.</Placeholder>
        )}
      </section>

      {product.upgradeEligible && (
        <section className={`${site.service} ${site.spaced}`} aria-labelledby="local-help-heading">
          <h2 id="local-help-heading">Local help in {SITE.location}</h2>
          <Subheading color="service">Local service, by appointment</Subheading>
          <Placeholder>
            how professional testing and programming can help with this device.
          </Placeholder>
          <ul>
            <li>
              <Link to="/services#hearing-tests">Hearing tests</Link>
            </li>
            <li>
              <Link to="/services#otc-programming">OTC hearing aid programming</Link>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
