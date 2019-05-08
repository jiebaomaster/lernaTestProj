<template lang='pug'>
#app.container.mt-5.pl-5
  section
    h2 > print message when click out side
    p 当使用该指令的元素存在时，点击元素外时会触发处理函数
    button.btn.btn-primary.mr-4(type="button" v-clickoutside="print1") click button one!
    button.btn.btn-outline-primary(type="button" v-clickoutside="print2") click button two!
    ol
      li(v-for='item in message') {{ item }}
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'app',
  data () {
    return {
      message: [],
    }
  },
  methods: {
    print1 () {
      this.message.push(`ONE!`)
    },
    print2 () {
      this.message.push(`TWO!`)
    }
  }
}
</script>
