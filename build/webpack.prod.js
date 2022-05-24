// webpack.prod.js
// 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码
/**
 * 需要安装以下模块:
 * npm i -D  webpack-merge copy-webpack-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin
 * webpack-merge 合并配置
 * copy-webpack-plugin 拷贝静态资源
 * optimize-css-assets-webpack-plugin 压缩css
 * uglifyjs-webpack-plugin 压缩js
 */

const path = require('path');
const webpackConfig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // webpack v5 或以上版本，你不需要安装这个插件。webpack v5 ⾃带最新的terser-webpack-plugin。如果使⽤ webpack v4则必须安装terser-webpack-plugin。
const Webpack = require('webpack');

module.exports = WebpackMerge.merge(webpackConfig, {
    mode: 'production', // 生产环境
    devtool: 'cheap-module-source-map',
    plugins: [
        //使用插件定义全局变量DEV
        new Webpack.DefinePlugin({
            DEV: JSON.stringify('production')
        }),
        // 拷贝静态资源
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, '../public'),
                to: 'static' // 到哪里
            }]
        })
    ],
    optimization: {
        minimizer: [
            // 压缩js
            new TerserPlugin(),
            // new UglifyJsPlugin({
            //     cache: true, // 启用文件缓存
            //     parallel: true, // 使用多线程并行运行提高构建速度
            //     sourceMap: true // 使用SourceMaps将错误信息得位置映射到模块
            // }),
            // 压缩css
            new CssMinimizerPlugin()
            // new OptimizeCssAssetsPlugin() // 这是因为optimize-css-assets-webpack-plugin 在webpack5中已不在友好支持
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
})
