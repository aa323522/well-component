The project is a UI component library showcasing various UI components using Storybook. The project is built using Vue.js.

## Installation
To install the project dependencies, run the following command:

```bash
npm install
```
Running the Project
To run the project, you can use one of the following commands:

```bash
npm run serve
```
This will start a development server.

Running Storybook
To run Storybook, you can use the following command:

```bash
npm run storybook
```
This will start the Storybook development server. You can then view the UI components and their variations in Storybook.

Building Storybook
To build Storybook, you can use the following command:

```bash
npm run build-storybook
```
This will build the Storybook for production.

## Dependencies
The project utilizes the following dependencies:

- "@vue/cli": "^5.0.8"
- "@vue/cli-service": "^5.0.8"
- "vue": "2.6.12"

## Adding Sass/SCSS support to Storybook
Pre-configured Storybook installations
Some configurations of Storybook already come pre-configured to support Sass/SCSS. If your project meets the following, you're likely ready to go:

1. Storybook >= 7.x with the Vite builder.
2. Storybook >= 7.x with the @storybook/nextjs framework.
3. Storybook >= 6.x with the @storybook/preset-create-react-app and react-scripts@2.x.x or higher.

Setting up Sass and Storybook
Sass is a popular CSS preprocessor that allows developers to write more maintainable and reusable stylesheets. Storybook is an industry-standard tool for developing and testing UI components in isolation. With the help of the @storybook/addon-styling package, developers can easily incorporate Sass stylesheets into their Storybook components.

First, install the required dependencies:

```bash
npm install -D @storybook/addon-styling sass
```

Next, register @storybook/addon-styling in your .storybook/main.js file:

```js
module.exports = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: {
        less: {
          // Require your Sass preprocessor here
          implementation: require('less'),
        },
      },
    },
  ],
};
```

This registers the @storybook/addon-styling package as an addon, with options to specify the Sass preprocessor to use.

If you have any global styles you would like to expose for your stories, you can import them into your .storybook/preview.js file:

```js
// .storybook/preview.js
import '../src/index.scss';
```



总结：
npm install 安装依赖， 如安装缓慢请切到国内镜像

npm run storybook 启动组件库

echart图表由于是初期化就渲染，所以storybook有的时候在线改变量是不好用的（不会触发渲染），实际使用时会动态变化

