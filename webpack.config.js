const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// creates a static folder in project root directory.
const outputPath = path.resolve(__dirname, "static");

module.exports = {
    entry: { index: path.join(__dirname, "web", "index.js") },
    output: {
        clean: true,
        path: outputPath,
        filename: "index.js",
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
        // Copies html
        new HtmlWebpackPlugin({
            hash: true,
            title: 'VTK Web Benchmarks',
            header: 'VTKWebBenchmarks',
            metaDesc: 'A collection of VTK web benchmark applications',
            template: path.resolve(__dirname, "web", "index.html"),
            filename: 'index.html',
            inject: 'body',
            chunks: ['index']
        }),
    ],
}
