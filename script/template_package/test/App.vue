<template>
  <div id="app">
    <Select class="demo-select"
      :options="selectOptions"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import Select from '../src'

export default {
  name: 'app',
  components: {
    Select
  },
  data () {
    return {
      selectOptions: [
        'Github',
        'Gitlab',
        'Bitbucket',
        'Coding',
        'TGit'
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.cf-select {
  width: 240px
}
</style>
