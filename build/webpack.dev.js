// webpack.dev.js
// 开发环境主要实现的是热更新，不要压缩代码，完整的sourceMap
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.config.js');

module.exports = WebpackMerge.merge(webpackConfig, {
    mode: 'development', // 开发模式
    devtool: 'cheap-module-source-map',
    devServer: {
        port: 3000,
        hot: true, // 允许热加载
        static: '../dist'
    },
    plugins: [
        // 定义全局变量
        new Webpack.DefinePlugin({
            //这里必须要解析成字符串进行判断，不然将会被识别为一个变量
            DEV: JSON.stringify('dev')
        }),
        new Webpack.HotModuleReplacementPlugin()
    ]
})