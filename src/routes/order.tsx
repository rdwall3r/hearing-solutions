import type { Route } from "./+types/order";
import { OrderForm } from "~/components/OrderForm";
import { Placeholder } from "~/components/Placeholder";
import { getAllProducts } from "~/lib/products.server";
import { pageMeta } from "~/lib/site";

export function loader() {
  return {
    products: getAllProducts().map((p) => ({ value: p.slug, label: p.title })),
  };
}

export function meta({}: Route.MetaArgs) {
  return pageMeta("Order or ask a question", "TODO(copy): order page meta description");
}

export default function Order({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Order or ask a question</h1>
      <Placeholder>
        how ordering and payment work, shipping, and what happens after you send
        this form.
      </Placeholder>
      <p>All fields are required unless marked “optional”.</p>
      <OrderForm products={loaderData.products} />
    </>
  );
}
