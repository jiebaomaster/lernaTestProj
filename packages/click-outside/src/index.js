import Helloworld from './components/clickoutside.js'

Helloworld.install = function (Vue) {
  Vue.directive(Helloworld.name, Helloworld)
}

export default Helloworld