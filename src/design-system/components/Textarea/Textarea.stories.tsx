import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    label: "Message",
    name: "message",
    hint: "Please don't include health or hearing details here.",
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { error: "Enter a message." } };
export const Focus: Story = { play: focusOn("textarea") };
export const FocusError: Story = { args: { error: "Enter a message." }, play: focusOn("textarea") };
