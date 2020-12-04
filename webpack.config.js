const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[hash].css",
    chunkFilename: "[id].css",
  }),
  new HtmlWebPackPlugin({
    template: "index.html",
    filename: "index.html",
  }),
  new HtmlWebPackPlugin({
    template: "save-the-date.html",
    filename: "save-the-date/index.html",
  }),
];

module.exports = (_env, argv) => {
  let cssLoader = "style-loader";
  let optimization = {
    minimize: false,
  };
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
    optimization = {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
    };
  }
  return {
    context: path.resolve(__dirname, "src"),
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      filename: "[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.s?css$/,
          use: [cssLoader, "css-loader", "sass-loader"],
        },
        {
          test: /img\/(index|save-the-date)\/.+\.(jpe?g|png)$/i,
          loader: "responsive-loader",
          options: {
            sizes: [500, 1000, 1500, 2000],
          },
        },
        {
          test: /img\/card\/.+\.(jpe?g|png)$/i,
          use: ["file-loader", "image-webpack-loader"],
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: /img\/(index|save-the-date|card)/,
          use: ["url-loader", "image-webpack-loader"],
        },
      ],
    },
    plugins,
    optimization,
  };
};
