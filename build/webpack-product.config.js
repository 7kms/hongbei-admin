const { resolve } = require('path');
const webpack = require('webpack');
let baseConfig = require('./webpack-base.config');
const merge = require('webpack-merge');
module.exports = merge(baseConfig, {
  output: {
    path: resolve(__dirname, '../__dist/'),

    publicPath: '/dist',
    // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)

    filename: 'js/[name].[chunkhash:6].js',
    // 输出的打包文件

    chunkFilename: 'js/[name].[chunkhash:6].js'
    //「附加分块(additional chunk)」的文件名模板
  },
  devtool: false,
  stats: 'verbose',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor','manifest']
    })
  ]
});