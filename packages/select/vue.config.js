module.exports = {
  devServer: {
    port: 8000,
    index: 'test/index.html'
  },

  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./test/main.js')
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}