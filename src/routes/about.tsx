import type { Route } from "./+types/about";
import { Placeholder } from "~/components/Placeholder";
import { pageMeta, SITE } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return pageMeta("About", "TODO(copy): about page meta description");
}

export default function About() {
  return (
    <>
      <h1>About</h1>
      <Placeholder>
        a note that R.D. Waller Hearing Aid Co. is Ryan's personal side project, not a company.
      </Placeholder>

      <h2>Background</h2>
      <Placeholder>Ryan's background and why he runs this.</Placeholder>

      <h2>License</h2>
      <dl>
        <dt>Licensed as</dt>
        <dd>Hearing instrument specialist, State of Missouri</dd>
        <dt>License number</dt>
        <dd>{SITE.licenseNumber}</dd>
        <dt>Location</dt>
        <dd>{SITE.location}</dd>
      </dl>
      <Placeholder>how to verify the license (link to the state lookup).</Placeholder>
    </>
  );
}
