const { resolve } = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
let isProduct = process.env.NODE_ENV === 'production';
module.exports = {
    context: resolve(__dirname),
    entry: {
      hmr: [
        'react-hot-loader/patch',
        // 开启 React 代码的模块热替换(HMR)

        'webpack-dev-server/client?http://localhost:8080',
        // 为 webpack-dev-server 的环境打包代码
        // 然后连接到指定服务器域名与端口

        'webpack/hot/only-dev-server',
        // 为热替换(HMR)打包好代码
        // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
      ],
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

      publicPath: '/dist/',
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
    devtool: '#cheap-module-source-map',

    devServer: {
        hot: true,
        // 开启服务器的模块热替换(HMR)

        contentBase: resolve(__dirname, '../dist/'),
        // 输出文件的路径

        publicPath: '/dist/',
        // 和上文 output 的“publicPath”值保持一致

        noInfo: true,

        historyApiFallback: true
    },

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
              use: isProduct ? ExtractTextPlugin.extract({
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
              }) : ['style-loader',{
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
            },
          {
            test: /\.(jpg|png|gif)$/,
            use: 'file-loader'
          }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // 开启全局的模块热替换(HMR)

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
          names: ['hmr','vendor','manifest']
        })
    ]
};