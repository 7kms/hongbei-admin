const { resolve } = require('path');
const webpack = require('webpack');
let baseConfig = require('./webpack-base.config');
const merge = require('webpack-merge');
let ipv4 = require('macaddress').networkInterfaces().en0.ipv4;
module.exports = merge(baseConfig,{
    entry: {
      hmr: [
        'react-hot-loader/patch',
        // 开启 React 代码的模块热替换(HMR)

        `webpack-dev-server/client?http://${ipv4}:8080`,
        // 为 webpack-dev-server 的环境打包代码
        // 然后连接到指定服务器域名与端口

        'webpack/hot/only-dev-server',
        // 为热替换(HMR)打包好代码
        // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
      ]
    },
    devtool: '#cheap-module-source-map',
    devServer: {
        hot: true,
        // 开启服务器的模块热替换(HMR)

        contentBase: resolve(__dirname, '../dist/'),
        // 输出文件的路径

        publicPath: '/',
        // 和上文 output 的“publicPath”值保持一致

        noInfo: true,
        host: "0.0.0.0",
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
          "/api": {
            target: "http://localhost:4000",
            pathRewrite: {"^/api" : ""}
          }
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // 开启全局的模块热替换(HMR)

        new webpack.NamedModulesPlugin(),
        // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息

        new webpack.optimize.CommonsChunkPlugin({
          names: ['hmr','vendor','manifest']
        })
      ]
});