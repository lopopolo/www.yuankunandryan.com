const path = require("path");
const glob = require("glob");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].css",
  }),
  new PurgeCSSPlugin({
    paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
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
    chunkIds: "deterministic",
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  };
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
    optimization.minimize = true;
    optimization.minimizer = ["...", new CssMinimizerPlugin()];
  }
  return {
    context: path.resolve(__dirname, "src"),
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      filename: "[name].[contenthash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    module: {
      rules: [
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
          test: /img\/card\/.+\.(jpe?g|png)$/i, // social images
          type: "asset",
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: /img\/(index|save-the-date|card)/,
          type: "asset",
        },
      ],
    },
    plugins,
    optimization,
  };
};
