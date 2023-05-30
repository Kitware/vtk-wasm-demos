const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// creates a static folder in project root directory.
const outputPath = path.resolve(path.dirname(__dirname), "static", "cones");

module.exports = {
    entry: {
        webgl: [path.resolve(__dirname, "web", "webgl.js")],
        webgpu: [path.resolve(__dirname, "web", "webgpu.js")],
    },
    output: {
        clean: true,
        path: outputPath,
        filename: "[name].js"
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
            title: 'Cones (WebGL)',
            header: 'ConesWebGL',
            metaDesc: 'A VTK C++ WebAssembly benchmark application with WebGL',
            template: path.resolve(__dirname, "web", "index.html"),
            filename: 'webgl.html',
            chunks: ["webgl"],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Cones (WebGPU)',
            header: 'ConesWebGPU',
            metaDesc: 'A VTK C++ WebAssembly benchmark application with WebGPU',
            template: path.resolve(__dirname, "web", "index.html"),
            filename: 'webgpu.html',
            chunks: ["webgpu"],
            inject: 'body'
        }),
        // copies wasm and glue js to static directory.
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(
                        __dirname, "out", "Cones.js"
                    ),
                    to: path.resolve(outputPath, "Cones.js")
                },
                {
                    from: path.resolve(
                        __dirname, "out", "Cones.wasm"
                    ),
                    to: path.resolve(outputPath, "Cones.wasm")
                }
            ],
        })
    ],
    performance: {
        maxAssetSize: 10000000,
        maxEntrypointSize: 200000,
    },
}