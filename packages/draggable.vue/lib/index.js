function getEleIndexOfParent(ele, parentEle) { // 判断一个元素是父元素的第几个子元素
  return Array.prototype.indexOf.call(parentEle.childNodes, ele)
}
function getDraggableEle(event, rootEle) { // 获取可拖拽父元素
  let target = event.target
  while (target && target.tagName !== 'BODY'){
    if (getEleIndexOfParent(target, rootEle) !== -1) {
      return target
    }
    target = target.parentNode
  }
  return null
}

// 可拖拽组件
const draggable = {
  name: 'draggable',
  props: {
    list: { // 列表
      type: Array,
      required: true
    },
    element: { // 包裹元素
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      transitionMode: false // 是否使用transition组件
    }
  },
  computed: {
    rootElement () { // 根元素
      return this.transitionMode ? this.$el.childNodes[0] : this.$el
    }
  },
  render (createElement) {
    let defaultSlot = this.$slots.default
    if (defaultSlot && defaultSlot.length === 1) {
      let childNode = defaultSlot[0]
      if(childNode.componentOptions && childNode.componentOptions.tag === 'transition-group') {
        this.transitionMode = true
      }
    }
    return createElement(this.element, defaultSlot)
  },
  mounted () {
    let supportDraggable = ('draggable' in document.createElement('div'))
    if (!supportDraggable) { // 检测浏览器是否支持原生拖拽
      console.warn('Your browser do not support native drag!')
      return
    }

    let draggingIndex = -1
    let rootElement = this.rootElement  // 根元素

    Array.prototype.forEach.call(rootElement.childNodes, item => {
      // 设置draggable属性
      item.draggable = true
      // 绑定drag相关事件
      item.addEventListener('dragstart', (event) => {
        event.stopPropagation()
        event.dataTransfer.effectAllowed = 'move'
        let ele = getDraggableEle(event, rootElement)
        draggingIndex = getEleIndexOfParent(ele, rootElement)

        // wrap in try catch to address IE's error when first param is 'text/plain'
        try {
          // setData is required for draggable to work in FireFox
          // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
          event.dataTransfer.setData('text/plain', '')
        } catch (e) {
        }

        this.$emit('drag-start', event.target)
      })
      item.addEventListener('dragover', event => {
        event.stopPropagation()
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      })
      item.addEventListener('dragend', event => {
        event.stopPropagation()
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      
        this.$emit('drag-end', event.target)
      })
      item.addEventListener('drop', event => {
        event.stopPropagation()
        event.preventDefault()

        let targetEle = getDraggableEle(event, rootElement)
        let targetIndex = getEleIndexOfParent(targetEle, rootElement)
        let list = this.list
        let tmp = list.splice(draggingIndex, 1)
        list.splice(targetIndex, 0, tmp[0])
      })
    })
  },

  beforeDestroy () {

  }
}

// export default {
//   install (Vue) {
//     // 注册全局组件
//     Vue.component('draggable', draggable)
//   }
// }

Vue.component('draggable', draggable)
