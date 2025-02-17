const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "./src/js/index.js"),
    main: path.resolve(__dirname, "./src/js/main.js"),
  },
  output: {
    // helps with cashing.clear
    filename: "[name].[contenthash].bundle.js",
    // filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack app",
      filename: "index.html",
      template: "./src/pages/index.html",
      excludeChunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      title: "webpack app",
      filename: "main.html",
      template: "./src/pages/main.html",
      chunks: ["main"],
    }),
  ],
  optimization: {
    runtimeChunk: "single",
  },
};
