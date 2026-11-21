import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: { label: "Your name", name: "name" },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = {
  args: { label: "Phone", type: "tel", hint: "Needed if you'd like a text or a call.", optional: true },
};
export const Error: Story = { args: { error: "Enter your name." } };
export const ErrorWithHint: Story = {
  args: {
    label: "Email",
    type: "email",
    hint: "We'll only use this to reply.",
    defaultValue: "ryan@",
    error: "Enter an email address like name@example.com.",
  },
};
export const Focus: Story = { play: focusOn("input") };
export const FocusError: Story = { args: { error: "Enter your name." }, play: focusOn("input") };
