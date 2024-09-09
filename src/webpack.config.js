module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "vue-style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.js$/,
        options: {
          presets: ["@babel/react"],
          plugins: [["import", { libraryName: "antd", style: true }]],
        },
      },
    ],
  },
};
