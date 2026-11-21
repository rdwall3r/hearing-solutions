import type { Route } from "./+types/products";
import { Link, ProductCard } from "~/design-system";
import { Placeholder } from "~/components/Placeholder";
import { CATEGORIES } from "~/lib/categories";
import { getProductsInCategory, productPath } from "~/lib/products.server";
import { pageMeta } from "~/lib/site";
import site from "~/styles/site.module.css";

export function loader() {
  return {
    groups: CATEGORIES.map((category) => ({
      category,
      products: getProductsInCategory(category.slug).map((p) => ({
        ...p,
        path: productPath(p),
      })),
    })),
  };
}

export function meta({}: Route.MetaArgs) {
  return pageMeta("Products", "TODO(copy): products page meta description");
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Products</h1>
      <Placeholder>
        intro to the shop: mail order, shipping area, how ordering works.
      </Placeholder>

      {loaderData.groups.map(({ category, products }) => (
        <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
          <h2 id={`cat-${category.slug}`}>
            <Link to={`/products/${category.slug}`}>{category.label}</Link>
          </h2>
          {products.length > 0 ? (
            <ul role="list" className={`list-reset ${site.grid}`}>
              {products.map((p) => (
                <li key={p.slug}>
                  <ProductCard
                    title={p.title}
                    brand={p.brand}
                    to={p.path}
                    price={p.price}
                    inStock={p.inStock}
                    otc={p.otc}
                    imageSrc={p.images[0]?.src}
                    summary={p.summary}
                    headingLevel={3}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No products in this category yet.</p>
          )}
        </section>
      ))}
    </>
  );
}
