import type { Meta, StoryObj } from '@storybook/react-vite';
import { focusOn } from '../../stories/focus';
import { Layout } from './Layout';

const meta = {
  title: 'Components/Layout',
  component: Layout,
  parameters: { layout: 'fullscreen' },
  args: {
    siteName: 'R.D. Waller Hearing Solutions',
    byline: 'Straightforward, comprehensive service',
    nav: [
      { to: '/products', label: 'Products' },
      { to: '/services', label: 'Local services' },
      { to: '/about', label: 'About' },
      { to: '/order', label: 'Order or ask' },
    ],
    footer: <p>Footer content</p>,
    children: (
      <>
        <h1>Page heading</h1>
        <p>
          Main content. The router in Storybook starts on /products, so
          “Products” is the current page.
        </p>
      </>
    ),
  },
} satisfies Meta<typeof Layout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FocusOnNavLink: Story = {
  play: focusOn('nav a[href="/services"]'),
};
export const FocusOnSkipLink: Story = { play: focusOn('a[href="#main"]') };

/** Narrow viewport: the nav collapses behind the "Menu" button. */
export const SmallScreen: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
export const SmallScreenMenuOpen: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector<HTMLButtonElement>('button[aria-expanded]')
      ?.click();
  },
};
