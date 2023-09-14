const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

// creates a static folder in project root directory.
const outputPath = path.resolve(path.dirname(__dirname), "static", "conesjs");

module.exports = {
  entry: {
    index: [path.resolve(__dirname, "src", "index.js")],
  },
  output: {
    clean: true,
    path: outputPath,
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Cones JS',
      header: 'ConesJS',
      metaDesc: 'A VTK JS benchmark application',
      template: path.resolve(__dirname, "src", "index.html"),
      filename: 'index.html',
      chunks: ["index"],
      inject: 'body'
    }),
  ],
  performance: {
    maxAssetSize: 15000000,
    maxEntrypointSize: 15000000,
  },
}