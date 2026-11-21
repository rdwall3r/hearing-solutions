import type { Route } from "./+types/not-found";
import { Link } from "~/design-system";
import { pageMeta } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [...pageMeta("Page not found", ""), { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>Sorry, there's no page at this address.</p>
      <p>
        <Link to="/">Go to the home page</Link> or <Link to="/products">browse products</Link>.
      </p>
    </>
  );
}
