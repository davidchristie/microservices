const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const IgnoreNotFoundExportPlugin = require("ignore-not-found-export-plugin");
const path = require("path");

module.exports = {
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true,
    host: "0.0.0.0",
    port: process.env.PORT
  },
  devtool: "cheap-module-source-map",
  entry: "./source/index.js",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(t|j)sx?$/,
        use: { loader: "babel-loader" }
      },
      {
        exclude: /node_modules/,
        test: /\.html$/,
        use: { loader: "html-loader" }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./source/index.html"
    }),
    new HardSourceWebpackPlugin(),
    // required because of https://github.com/babel/babel/issues/7640
    new IgnoreNotFoundExportPlugin([
      "CallbackSideEffect",
      "NotificationSideEffect",
      "RedirectionSideEffect",
      "RefreshSideEffect"
    ])
  ],
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".json"]
  }
};
