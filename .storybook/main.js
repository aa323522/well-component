/** @type { import('@storybook/vue-webpack5').StorybookConfig } */
const config = {
  viteFinal: (config, { configType }) => {
    if (configType === "PRODUCTION") {
      config.base = "./";
    }

    return config;
  },
  stories: ["../src/**/*.mdx", "../src/**/*/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {
        less: {
          // Require your Sass preprocessor here
          implementation: require("less"),
        },
      },
    },
  ],
  framework: {
    name: "@storybook/vue-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
