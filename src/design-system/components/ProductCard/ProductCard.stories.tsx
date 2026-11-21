import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { ProductCard } from "./ProductCard";

const meta = {
  title: "Components/ProductCard",
  component: ProductCard,
  args: {
    title: "Sennheiser All-Day Clear",
    brand: "Sennheiser",
    to: "/products/otc-hearing-aids/sennheiser-all-day-clear",
    price: 999,
    inStock: true,
    otc: true,
    imageSrc: "/images/products/placeholder.svg",
    summary: "One-sentence summary goes here.",
    headingLevel: 2,
  },
  // Cards always live in a list, so the stories render them in one too.
  render: (args) => (
    <ul role="list" className="list-reset" style={{ maxWidth: "20rem" }}>
      <li>
        <ProductCard {...args} />
      </li>
    </ul>
  ),
} satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OtcHearingAid: Story = {};
export const Accessory: Story = {
  args: { title: "Vibrating Alarm Clock", brand: "Brand", otc: false, price: 59.95 },
};
export const OutOfStock: Story = { args: { inStock: false, otc: false } };
export const NoImage: Story = { args: { imageSrc: undefined } };
export const Focus: Story = { play: focusOn("a") };
