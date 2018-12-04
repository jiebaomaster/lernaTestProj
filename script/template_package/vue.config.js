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
}