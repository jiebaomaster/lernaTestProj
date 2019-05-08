module.exports = {
  devServer: {
    index: 'example/index.html'
  },

  chainWebpack: config => {
    config
      .entry('app')
        .clear()
        .add('./example/main.js')
        .end()
      .resolve
        .symlinks(false)
  },
}