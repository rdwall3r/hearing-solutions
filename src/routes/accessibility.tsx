import type { Route } from "./+types/accessibility";
import { Link } from "~/design-system";
import { Placeholder } from "~/components/Placeholder";
import { pageMeta } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return pageMeta("Accessibility statement", "TODO(copy): accessibility statement meta description");
}

export default function Accessibility() {
  return (
    <>
      <h1>Accessibility statement</h1>
      <Placeholder>commitment to accessibility, in Ryan's words.</Placeholder>

      <h2>Standard</h2>
      <Placeholder>
        the target standard (WCAG 2.2 Level AA) and how the site was tested.
      </Placeholder>

      <h2>Known issues</h2>
      <Placeholder>
        anything that doesn't fully work yet (e.g. the spam check on the order form needs
        JavaScript).
      </Placeholder>

      <h2>Feedback</h2>
      <Placeholder>how to report a problem and the expected response time.</Placeholder>
      <p>
        <Link to="/order">Contact Ryan</Link>
      </p>

      <Placeholder>date this statement was last reviewed.</Placeholder>
    </>
  );
}
