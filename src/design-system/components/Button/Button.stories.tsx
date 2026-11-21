import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Send message", variant: "primary" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Accent: Story = { args: { variant: "accent" } };
export const Disabled: Story = { args: { disabled: true, children: "Sending…" } };
export const Focus: Story = { play: focusOn("button") };
export const FocusSecondary: Story = { args: { variant: "secondary" }, play: focusOn("button") };
