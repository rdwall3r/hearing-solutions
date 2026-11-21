import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:category", "routes/category.tsx"),
  route("products/:category/:slug", "routes/product.tsx"),
  route("services", "routes/services.tsx"),
  route("about", "routes/about.tsx"),
  route("order", "routes/order.tsx"),
  route("order/thanks", "routes/order-thanks.tsx"),
  route("accessibility", "routes/accessibility.tsx"),
  // Anything else. Served from 404.html on Cloudflare Pages (see scripts/postbuild.mjs).
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
