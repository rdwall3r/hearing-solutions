import { useEffect } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import site from '../../../styles/site.module.css';
import { Subheading } from './Subheading';

/** Shows the subheading where it's used: under a heading in a green panel. */
const inServicesPanel: Decorator = (Story) => (
  <section className={site.service} aria-labelledby="demo-heading">
    <h2 id="demo-heading">Local services in Greater Kansas City</h2>
    <Story />
    <p>Body text follows with a little more room above it.</p>
  </section>
);

/**
 * Forces a theme for one story by setting <html data-theme>, as the site's
 * theme toggle does, and restores the previous value afterwards so other
 * stories aren't affected.
 */
function withTheme(theme: 'light' | 'dark'): Decorator {
  return function ThemeDecorator(Story) {
    useEffect(() => {
      const root = document.documentElement;
      const previous = root.getAttribute('data-theme');
      root.setAttribute('data-theme', theme);
      return () => {
        if (previous === null) root.removeAttribute('data-theme');
        else root.setAttribute('data-theme', previous);
      };
    }, []);
    return <Story />;
  };
}

const meta = {
  title: 'Components/Subheading',
  component: Subheading,
  args: { children: 'By appointment, in person' },
  decorators: [inServicesPanel],
} satisfies Meta<typeof Subheading>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Default color: ink black (newsprint in dark mode). */
export const Light: Story = { decorators: [withTheme('light')] };
export const Dark: Story = { decorators: [withTheme('dark')] };

/** color="service": sage green, for local, in-person services. */
export const ServiceLight: Story = {
  args: { color: 'service' },
  decorators: [withTheme('light')],
};
export const ServiceDark: Story = {
  args: { color: 'service' },
  decorators: [withTheme('dark')],
};
