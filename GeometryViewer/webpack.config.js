const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

// creates a static folder in project root directory.
const outputPath = path.resolve(path.dirname(__dirname), "static", "geometryviewer");
const imagesDir = path.resolve(path.dirname(__dirname), "images");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    clean: true,
    path: outputPath,
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head', // insert style tag inside of <head>
              injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    // Links html with webgl and webgpu entry points.
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Geometry Viewer',
      header: 'GeometryViewer',
      metaDesc: 'A VTK web application to view geometry files.',
      favicon: path.resolve(imagesDir, "vtkLogo.ico"),
      template: path.resolve(__dirname, "src", "index.html"),
      filename: 'index.html',
      chunks: ["index"],
      inject: 'body',
    }),
  ],
  performance: {
    maxAssetSize: 15000000,
    maxEntrypointSize: 15000000,
  },
}