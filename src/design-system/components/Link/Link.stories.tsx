import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  args: { to: "/products", children: "Browse products" },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: (args) => (
    <p>
      You can <Link {...args} /> or ask a question.
    </p>
  ),
};
export const External: Story = {
  args: { to: undefined, href: "https://example.com", children: "An external site" } as never,
};
export const AsButton: Story = { args: { variant: "button" } };
export const AsSecondaryButton: Story = { args: { variant: "button-secondary" } };
export const Focus: Story = { play: focusOn("a") };
export const FocusAsButton: Story = { args: { variant: "button" }, play: focusOn("a") };
