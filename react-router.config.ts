import type { Config } from "@react-router/dev/config";
import { CATEGORIES } from "./src/lib/categories";
import { getProductPaths } from "./src/lib/products.server";

export default {
  appDirectory: "src",

  // No runtime server: Cloudflare Pages serves static files. The only
  // server-side code is the Pages Function in functions/api/order.ts.
  ssr: false,

  // Every content page becomes real HTML in build/client at build time.
  async prerender({ getStaticPaths }) {
    return [
      ...getStaticPaths(), // /, /products, /services, /about, /order, …
      ...CATEGORIES.map((c) => `/products/${c.slug}`),
      ...getProductPaths(),
    ];
  },
} satisfies Config;
