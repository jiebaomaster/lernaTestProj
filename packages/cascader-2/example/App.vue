<template lang='pug'>
  #app.container.mt-5.pl-5
    section
      h2 > 级联选择
      ol
        li 支持输入框输入字符串搜索每一级数据
        li 支持键盘方向键操作选择
      cf-cascader-2(label='Category', :placeholder-list='placeholderList', :fetch-data="fetchData")
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import root from './mock-data/rootCategories.json'
import second from './mock-data/secondCategories.json'
import third from './mock-data/thirdCategories.json'

export default {
  name: 'app',
  data() {
    return {
      placeholderList: ['1st Category', '2nd Category', '3rd Category'],
    }
  },
  methods: {
    fetchData (parentId) {
      return new Promise((resolve, reject) => {
        let data = {}
        if (parentId === 0) {
          data = root.model
        } else if (/^\d{3}$/.test(parentId)) {
          data = second.model
        } else if (/^\d{5}$/.test(parentId)) {
          data = third.model
        }
        console.log(`fetchData: parentId = ${parentId}`)
        setTimeout(() => {
          resolve(data)
        }, 3000)
      })
    }
  }
}
</script>
