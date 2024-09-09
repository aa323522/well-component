// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import dayjs from "dayjs";
import VueSeamlessScroll from "vue-seamless-scroll";
import JsonExcel from "vue-json-excel";
import tooltipautoshow from "./utils/tooltipautoshow.js";

Vue.config.productionTip = false;
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(VueSeamlessScroll);
Vue.use(tooltipautoshow);
Vue.component("downloadExcel", JsonExcel);
Vue.use(ElementUI);
Vue.use(Antd);
Vue.prototype.dayjs = dayjs;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
});
