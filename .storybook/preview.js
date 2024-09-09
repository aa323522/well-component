/** @type { import('@storybook/vue').Preview } */
// .storybook/preview.js
import "../src/style/common.less";
import "ant-design-vue/dist/antd.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import dayjs from "dayjs";

Vue.use(Antd);
Vue.use(ElementUI);
Vue.prototype.dayjs = dayjs;

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
