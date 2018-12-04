const path = require('path');
const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require('vue-loader')

const jsexclude = /node_modules/;

const webpackConfig = {
  entry: {
    select: path.join(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    modules: ['node_modules']
  },
  externals: [{vue: 'vue'}, nodeExternals()],
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
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
        use: [
          /* config.module.rule('pug').use('pug-plain-loader') */
          {
            loader: 'pug-plain-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
    ]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};

module.exports = webpackConfig;
