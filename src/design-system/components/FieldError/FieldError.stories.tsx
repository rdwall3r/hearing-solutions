import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "./FieldError";

const meta = {
  title: "Components/FieldError",
  component: FieldError,
  args: { id: "example-error", children: "Enter an email address like name@example.com." },
} satisfies Meta<typeof FieldError>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Usually rendered by a field component. Shown alone here for reference. */
export const Default: Story = {};
export const LongMessage: Story = {
  args: {
    children:
      "Enter a phone number with area code, like 816-555-0123, so Ryan can text or call you back.",
  },
};
