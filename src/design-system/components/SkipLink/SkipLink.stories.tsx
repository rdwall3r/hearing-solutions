import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div style={{ position: "relative", minHeight: "8rem", padding: "4rem 1rem 1rem" }}>
      <SkipLink {...args} />
      <main id="main" tabIndex={-1}>
        <p>Press Tab: the skip link appears in the top-left corner.</p>
      </main>
    </div>
  ),
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Hidden until it receives keyboard focus. */
export const Hidden: Story = {};
export const Focus: Story = { play: focusOn("a") };
