# webpackConfig
webpack5基础配置打包

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