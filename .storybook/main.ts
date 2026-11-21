import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/design-system/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  // Storybook reuses vite.config.ts. Drop the React Router plugin there:
  // it expects to build the whole app, not isolated components.
  async viteFinal(config) {
    const isReactRouter = (p: unknown) =>
      !!p && typeof p === "object" && "name" in p && String((p as { name: string }).name).startsWith("react-router");
    config.plugins = (config.plugins ?? []).flat(Infinity as 1).filter((p) => !isReactRouter(p));
    return config;
  },
};

export default config;
