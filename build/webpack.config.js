// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除上次打包残留文件clean-webpack-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 拆分css
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 拆分多个css
const Webpack = require('webpack');
// let indexLess = new ExtractTextWebpackPlugin('index.less');
// let indexCss = new ExtractTextWebpackPlugin('index.css');
// const devMode = process.argv.indexOf('--mode=production') === -1;

let mode = "development";
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

module.exports = {
    mode: mode,
    entry: {
        main: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')]
    }, // 入口文件
    output: {
        filename: '[name].[fullhash:8].js', // 打包后的文件名称
        path: path.resolve(__dirname, '../dist'), // 打包后的目录
        chunkFilename: 'js/[name].[fullhash:8].js'
    },
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
                exclude: /node_modules/ // 不包括node_modules
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                    MiniCssExtractPlugin.loader,
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
                                    name: 'img/[name].[fullhash:8].[ext]'
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
                                    name: 'media/[name].[fullhash:8].[ext]'
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
                                    name: 'fonts/[name].[fullhash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }, // 配置别名
        extensions: ["*", ".js", '.json'] // 扩展名顺序
    },
    plugins: [
        // 清除上次打包残留文件
        new CleanWebpackPlugin({
            path: '../dist'
        }),
        //使用插件生成Html入口文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html', // 模板文件名
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        // 提取css
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
            chunkFilename: '[id].css'
        }),
        // indexCss,
        // indexLess,
        new Webpack.HotModuleReplacementPlugin()
    ]
}