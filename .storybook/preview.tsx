import type { Preview } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import "../src/design-system/tokens.css";
import "../src/design-system/base.css";

const preview: Preview = {
  // Components use <Link>/<NavLink>, which need a router.
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/products"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "padded",
    a11y: {
      // "error" fails the story's test run on any axe violation.
      test: "error",
      options: {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
      },
    },
  },
};

export default preview;
