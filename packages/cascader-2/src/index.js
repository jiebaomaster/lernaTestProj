import Helloworld from './components/Helloworld.vue'

Helloworld.install = function (Vue) {
  Vue.component(Helloworld.name, Helloworld)
}

export default Helloworld