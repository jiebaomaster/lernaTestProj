const path = require('path');
const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require('vue-loader')

const jsexclude = /node_modules/;

const webpackConfig = {
  entry: {
    index: path.join(__dirname, './src/index.js')
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, './src')
    },
    modules: ['node_modules']
  },
  externals: [ // 去除依赖
    nodeExternals(),
    nodeExternals({
      modulesDir: path.join(__dirname, '../../node_modules/')
    })
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: jsexclude, // babel 不处理
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};

module.exports = webpackConfig;
