const path = require('path')
const webpack = require('webpack')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const jsLoaders = () => {
    const loaders = [
    {
        loader: 'babel-loader',
        options: {
        presets: ['@babel/preset-env']
        }
        }
    ];

    if (isDev) {
        loaders.push('eslint-loader');
    }
    return loaders;
};

module.exports = {
    target: "web",
    context: path.resolve(__dirname, './#src'),
    entry: {
        main: ['@babel/polyfill', './index.js']
    },
    output: {
        filename: '[contenthash].bundle.js',
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
        compress: true
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new CleanWebpackPlugin(),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 7 }],
                    ['svgo', { plugins: [{ removeViewBox: false }] } ],
                ],
            },
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './#src/assets/'),
                    to: path.resolve(__dirname, './dist/assets/')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(css|s[ac]ss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(eot|ttf|otf|woff|woff2)$/i,
                type: 'asset/resource'
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: jsLoaders()
            }
        ]
    }
}