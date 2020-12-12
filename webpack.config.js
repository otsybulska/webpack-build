const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

module.exports = {
    context: path.resolve(__dirname, './#src'),
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetWebpackPlugin({}),
            new TerserWebpackPlugin({})
        ]
    },
    devServer: {
        hot: isDev,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './#src/assets/'),
                    to: path.resolve(__dirname, './dist/assets/')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(css|s[ac]ss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: ['file-loader']
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            }
        ]
    }
}