const { defineConfig } = require("@vue/cli-service");
let publicPath = process.env.NODE_ENV === "production" ? "" : "/";
module.exports = defineConfig({
  runtimeCompiler: true,
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      BMap: "BMap",
    },
  },
  publicPath,
  productionSourceMap: false,
  devServer: {
    client: {
      //当出现编译错误或警告时，在浏览器中是否显示全屏覆盖。  示例为只显示错误信息
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    proxy: {
      "/api": {
        target: "http://localhost:10004/",
        secure: false,
        chanedOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
