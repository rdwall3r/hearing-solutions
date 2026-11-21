import type { Route } from "./+types/order-thanks";
import { Link, Notice } from "~/design-system";
import { pageMeta } from "~/lib/site";

// Shown after a form submission without JavaScript. With JavaScript, the
// same confirmation appears in place on /order.
export function meta({}: Route.MetaArgs) {
  return [...pageMeta("Message sent", "Your message was sent."), { name: "robots", content: "noindex" }];
}

export default function OrderThanks() {
  return (
    <>
      <h1>Message sent</h1>
      <Notice tone="success">
        {/* TODO(copy): review the confirmation wording. */}
        <p>Thanks. Ryan usually replies within a day or two.</p>
      </Notice>
      <p>
        <Link to="/products">Back to products</Link>
      </p>
    </>
  );
}
