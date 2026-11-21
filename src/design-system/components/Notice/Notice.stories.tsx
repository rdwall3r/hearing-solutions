import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusOn } from "../../stories/focus";
import { Notice } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  args: {
    tone: "info",
    title: "Heads up",
    children: <p>Body text for the notice.</p>,
  },
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const OtcWarning: Story = {
  args: {
    tone: "warning",
    title: "Over-the-counter hearing aid",
    children: (
      <p>
        This device is intended for adults age 18 and older with perceived mild to moderate
        hearing loss.
      </p>
    ),
  },
};
export const Success: Story = {
  args: {
    tone: "success",
    title: "Message sent",
    children: <p>Thanks. Ryan usually replies within a day or two.</p>,
  },
};
/** The order form's error summary: focused on submit, links jump to fields. */
export const ErrorSummary: Story = {
  args: {
    tone: "error",
    title: "There's a problem",
    tabIndex: -1,
    children: (
      <ul>
        <li>
          <a href="#name">Enter your name.</a>
        </li>
        <li>
          <a href="#email">Enter an email address like name@example.com.</a>
        </li>
      </ul>
    ),
  },
};
export const FocusedErrorSummary: Story = {
  args: ErrorSummary.args,
  play: focusOn("[tabindex='-1']"),
};
export const FocusOnLinkInside: Story = {
  args: ErrorSummary.args,
  play: focusOn("a"),
};
export const WithoutTitle: Story = { args: { title: undefined } };
