// Runs after `react-router build`.
//
// Cloudflare Pages serves build/client/404.html (with a 404 status) for any
// URL that has no file. We copy React Router's SPA fallback there, so unknown
// URLs still load the site shell and show the "Page not found" route.

import { copyFileSync, existsSync } from "node:fs";

const fallback = "build/client/__spa-fallback.html";
if (!existsSync(fallback)) {
  console.error(`postbuild: ${fallback} not found. Did the build pre-render "/"?`);
  process.exit(1);
}
copyFileSync(fallback, "build/client/404.html");
console.log("postbuild: wrote build/client/404.html");
