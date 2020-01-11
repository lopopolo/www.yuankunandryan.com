const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const plugins = [
  new CopyPlugin([
    { from: path.resolve(__dirname, "CNAME") },
  ]),
  new MiniCssExtractPlugin({
    filename: "[hash].css",
    chunkFilename: "[id].css"
  }),
  new HtmlWebPackPlugin({
    template: "index.html",
    filename: "index.html",
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true
    }
  }),
  new HtmlWebPackPlugin({
    template: "rsvp.html",
    filename: "rsvp/index.html",
    rsvpSlug: "test02",
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true
    }
  }),
  new HtmlWebPackPlugin({
    template: "save-the-date.html",
    filename: "save-the-date/index.html",
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true
    }
  }),
  new HtmlWebpackInlineSourcePlugin()
];

module.exports = (env, argv) => {
  let cssLoader = "style-loader";
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
  }
  return {
    context: path.resolve(__dirname, "src"),
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      filename: "[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.s?css$/,
          use: [cssLoader, "css-loader", "sass-loader"]
        },
        {
          test: /img\/(index|save-the-date)\/.+\.(jpe?g|png)$/i,
          loader: 'responsive-loader',
          options: {
            sizes: [500, 1000, 1500, 2000]
          }
        },
        {
          test: /img\/card\/.+\.(jpe?g|png)$/i,
          use: ["file-loader", "image-webpack-loader"]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: /img\/(index|save-the-date|card)/,
          use: ["url-loader", "image-webpack-loader"]
        }
      ]
    },
    plugins,
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()]
    }
  };
};
