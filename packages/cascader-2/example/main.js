import Vue from 'vue'
import App from './App.vue'
import Helloworld from '@'

Vue.config.productionTip = false
Vue.use(Helloworld)

new Vue({
  render: h => h(App),
}).$mount('#app')
