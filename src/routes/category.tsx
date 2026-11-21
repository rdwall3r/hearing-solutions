import { data } from "react-router";
import type { Route } from "./+types/category";
import { Link, ProductCard } from "~/design-system";
import { getCategory } from "~/lib/categories";
import { getProductsInCategory, productPath } from "~/lib/products.server";
import { pageMeta } from "~/lib/site";
import site from "~/styles/site.module.css";

export function loader({ params }: Route.LoaderArgs) {
  const category = getCategory(params.category);
  if (!category) throw data("Category not found", { status: 404 });
  return {
    category,
    products: getProductsInCategory(category.slug).map((p) => ({ ...p, path: productPath(p) })),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return pageMeta("Not found", "");
  return pageMeta(loaderData.category.label, loaderData.category.description);
}

export default function Category({ loaderData }: Route.ComponentProps) {
  const { category, products } = loaderData;
  return (
    <>
      <nav aria-label="Breadcrumb" className={site.breadcrumbs}>
        <ol role="list" className="list-reset">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to={`/products/${category.slug}`} aria-current="page">
              {category.label}
            </Link>
          </li>
        </ol>
      </nav>
      <h1>{category.label}</h1>
      <p className={site.lede}>{category.description}</p>

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
                headingLevel={2}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No products in this category yet. <Link to="/products">See all products</Link>.
        </p>
      )}
    </>
  );
}
