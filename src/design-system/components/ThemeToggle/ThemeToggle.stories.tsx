import type { Meta, StoryObj } from '@storybook/react-vite';
import { focusOn } from '../../stories/focus';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Click it to switch the whole Storybook preview between light and dark. */
export const Default: Story = {};
export const Focus: Story = { play: focusOn('button') };
