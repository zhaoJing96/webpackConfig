// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除上次打包残留文件clean-webpack-plugin
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 拆分css
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 拆分多个css
const Webpack = require('webpack');
// let indexLess = new ExtractTextWebpackPlugin('index.less');
// let indexCss = new ExtractTextWebpackPlugin('index.css');

module.exports = {
    mode: 'development', // 开发模式
    entry: {
        main: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')]
    }, // 入口文件
    output: {
        filename: '[name].[hash:8].js', // 打包后的文件名称
        path: path.resolve(__dirname, '../dist') // 打包后的目录
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }, // 配置别名
        extensions: ["*", ".js", '.json']
    },
    devServer: {
        port: 3000,
        hot: true,
        static: '../dist'
    },
    plugins: [
        new CleanWebpackPlugin, // 清除上次打包残留文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].[hash].css',
        //     chunkFilename: '[id].css'
        // }),
        // indexCss,
        // indexLess,
        new Webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader', // 转移js文件，只将ES6/7/8转换成ES5语法，不会对新api转换（promise、set、map等）,babel/polyfill可转换新api
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    {
                        // 添加浏览器前缀
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [require('autoprefixer')]
                            }
                        }
                    }
                ]// 从右向左解析原则
            },
            {
                test: /\.less$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    {
                        // 添加浏览器前缀
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [require('autoprefixer')]
                            }
                        }
                    },
                    'less-loader'
                ] // 从右向左解析原则，postcss-loader为css添加浏览器前缀
            },
            {
                test: /\.(jpe?g|png|gif)$/i, // 图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
}