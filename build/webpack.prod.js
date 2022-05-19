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
