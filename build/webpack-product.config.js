const { resolve } = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  context: resolve(__dirname),
  entry: {
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom'
    ],
    app: [
      '../src/index.js'
      // 我们 app 的入口文件
    ]
  },
  output: {
    path: resolve(__dirname, '../dist/'),

    publicPath: './',
    // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)

    filename: '[name].js'
    // 输出的打包文件
  },
  resolve: {
    alias: {
      'react': resolve(__dirname, '../node_modules/react'),
      'react-dom': resolve(__dirname, '../node_modules/react-dom'),
      '~less': resolve(__dirname, '../src/assets'),
      '~util': resolve(__dirname, '../src/util')
    }
  },
  devtool: false,

  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test:  /\.jsx?$/,
      //   use: 'eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options:{
                modules: true,
                importLoader: true,
                localIdentName: '[name]-[local]-[hash:base64:6]'
              }
            },{
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')({
                  browsers: ['last 10 versions']
                })]
              }
            },'less-loader']
          })
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.NamedModulesPlugin(),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息

    new ExtractTextPlugin('[name].[contenthash:6].css'),
    // 单独提取入口依赖的css文件

    new HtmlWebpackPlugin({
      title: 'react-exercise',
      template: '../src/template/index.html',
      filename: 'index.html'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest']
    })
  ]
};