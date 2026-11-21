import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    name: "contactMethod",
    legend: "How should Ryan get back to you?",
    options: [
      { value: "text", label: "Text message" },
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone call" },
    ],
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Inline: Story = { args: { inline: true } };
export const WithHint: Story = { args: { hint: "Pick whichever is easiest for you." } };
export const Selected: Story = { args: { defaultValue: "email" } };
export const Error: Story = { args: { error: "Choose how you'd like Ryan to get back to you." } };
export const Focus: Story = { play: focusOn("input") };
export const FocusError: Story = {
  args: { error: "Choose how you'd like Ryan to get back to you." },
  play: focusOn("input"),
};
