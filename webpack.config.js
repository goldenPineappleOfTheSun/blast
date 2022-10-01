const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const config = {  
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: __dirname + '/dest',
        filename: 'bundle.js',
        assetModuleFilename: '[name][ext]',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Blast',
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/server.js", to: "server.js" },
                { from: "src/img", to: "img" },
            ],
        }),
    ]
}

module.exports = config;