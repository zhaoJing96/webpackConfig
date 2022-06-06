# webpackConfig
webpack5基础配置打包

##### webpack配置中需要理解几个核心的概念Entry 、Output、Loaders 、Plugins、 Chunk。
Entry：指定webpack开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库;
Output：告诉webpack如何命名输出的文件以及输出的目录;
Loaders：由于webpack只能处理javascript，所以我们需要对一些非js文件处理成webpack能够处理的模块，比如sass文件;
Plugins：Loaders将各类型的文件处理成webpack能够处理的模块，plugins有着很强的能力。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。但也是最复杂的一个。比如对js文件进行压缩优化的UglifyJsPlugin插件;
Chunk：coding split的产物，我们可以对一些代码打包成一个单独的chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。



##### 配置html模板
js文件打包好,在html文件中引入打包好的js,通过html-webpack-plugin插件实现。
多个入口文件则生成多个多入口文件如何开发实例来解决问题。
~~~
// webpack.config.js
 plugins:[
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/index.html'),
        filename:'index.html',
        chunks:['main'] // 与入口文件对应的模块名
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/header.html'),
        filename:'header.html',
        chunks:['header'] // 与入口文件对应的模块名
      })
    ]
~~~

##### clean-webpack-plugin
执行npm run build 会发现dist文件里会残留上次打包的文件，推荐一个plugin在打包输出前清空文件夹clean-webpack-plugin
~~~
// webpack.config.js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    // ...省略其他配置
    plugins:[new CleanWebpackPlugin()]
}
~~~
##### 引用CSS
~~~
npm i -D style-loader css-loader
~~~
如果使用less来构建样式，则需安装：
~~~
npm i -D less less-loader
~~~
~~~
// webpack.config.js
module.exports = {
    // ...省略其他配置
    module:{
      rules:[
        {
          test:/\.css$/,
          use:['style-loader','css-loader'] // 从右向左解析原则
        },
        {
          test:/\.less$/,
          use:['style-loader','css-loader','less-loader'] // 从右向左解析原则
        }
      ]
    }
}
~~~
postcss-loader为css添加浏览器前缀，配合autoprefixer使其生效  
~~~
// webpack.config.js
module.exports = {
    module:{
        rules:[{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
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
            },]
    }
}
~~~
##### 用babel转义js文件
~~~
npm i -D babel-loader @babel/preset-env @babel/core
~~~
注意 babel-loader与babel-core的版本对应关系
babel-loader 8.x 对应babel-core 7.x
babel-loader 7.x 对应babel-core 6.x
~~~
// webpack.config.js
module.exports = {
    // 省略其它配置 ...
    module:{
        rules:[
          {
            test:/\.js$/,
            use:{
              loader:'babel-loader',
              options:{
                presets:['@babel/preset-env']
              }
            },
            exclude:/node_modules/
          },
       ]
    }
}
~~~
babel-loader只将ES6/7/8转换成ES5语法，不会对新api转换（promise、set、map等）,babel/polyfill可转换新api
~~~
npm i @babel/polyfill
~~~
~~~
// webpack.config.js
const path = require('path')
module.exports = {
    entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],    // 入口文件
}
~~~
##### 配置webpack-dev-server进行热更新
~~~
npm i -D webpack-dev-server
~~~
~~~
const Webpack = require('webpack')
module.exports = {
  // ...省略其他配置
  devServer:{
    port:3000,
    hot:true,
    contentBase:'../dist'
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
}
~~~
##### 配置打包命令
~~~
"scripts": {
    "dev": "webpack-dev-server --config build/webpack.config.js --open",
    "build": "webpack --config build/webpack.config.js"
  }
~~~
执行npm run dev这时候如果浏览器出现Vue开发环境运行成功，那么恭喜你，已经成功迈出了第一步。

##### webpack v5版本 hash已被弃用，改名为fullhash

##### copy-webpack-plugin 拷贝静态资源
~~~
module.exports = {
  // ...省略其他配置
  plugins:[
    // 拷贝静态资源
    new CopyWebpackPlugin({
        patterns: [{
            from: path.resolve(__dirname, '../public'),
            to: 'static' // 到哪里
        }]
    })
  ]
}
~~~

##### 压缩js、css
###### 压缩css: css-minimizer-webpack-plugin
optimize-css-assets-webpack-plugin 在webpack 5中已不在友好支持.
css-minimizer-webpack-plugin 就像 optimize-css-assets-webpack-plugin 一样，但在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行

###### 压缩js: terser-webpack-plugin
由于老版本uglifyjs-webpack-plugin 不支持新的 es6 语法,且不在更新，解决方法使用 terser-webpack-plugin 替换 uglifyjs-webpack-plugin。
webpack v5 或以上版本，你不需要安装这个插件。webpack v5 ⾃带最新的terser-webpack-plugin。如果你使用的是 webpack v5 或更高版本，同时希望自定义配置，那么仍需要安装 terser-webpack-plugin。如果使⽤ webpack v4，则必须安装terser-webpack-plugin V4的版本。

###### css loader优化公共提取
从例子中看出css、less文件的兼容处理中有相同代码，所以可以进行提取。
~~~
// css loader配置
const commonCssLoader = [
    // 将css文件提出来不能使用style-loader，需要使用mini-css-extract-plugin自己的loader
    // 作用将js中的css提取成单独文件
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
];// 从右向左解析原则

// loader配置
module: {
  rules: [
      {
          test: /\.css$/,
          use: [...commonCssLoader]// 从右向左解析原则
      },
      {
          test: /\.less$/,
          use: [...commonCssLoader, 'less-loader'] // 从右向左解析原则
      }
  ]
}
~~~
