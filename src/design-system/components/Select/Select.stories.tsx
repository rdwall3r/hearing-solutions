import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Product or service",
    name: "product",
    optional: true,
    emptyOption: "Nothing specific / general question",
    options: [
      { value: "sennheiser-all-day-clear", label: "Sennheiser All-Day Clear" },
      { value: "tv-listening-system", label: "TV Listening System" },
      { value: "local-service", label: "A local service (by appointment)" },
    ],
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Preselected: Story = { args: { defaultValue: "tv-listening-system" } };
export const Error: Story = { args: { optional: false, error: "Choose a product from the list." } };
export const Focus: Story = { play: focusOn("select") };
export const FocusError: Story = {
  args: { optional: false, error: "Choose a product from the list." },
  play: focusOn("select"),
};
