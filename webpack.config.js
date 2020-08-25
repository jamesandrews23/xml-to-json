const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    entry: "./src/index.js",
    output: {
        filename: "bundle.[contentHash].js"
        // path: path.resolve(__dirname, "xvr/ui/admin")
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/assets/templates/template.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader"
            }
        ]
    }
};