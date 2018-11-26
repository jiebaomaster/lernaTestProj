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

const draggable = {
  name: 'draggable',
  componentName: 'draggable',
  props: {
    list: { // 列表
      type: Array,
      required: true
    },
    tag: { // 包裹元素
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      transitionMode: false, // 是否使用transition组件
      draggingIndex: -1, // 正在拖拽行的索引
    }
  },
  computed: {
    rootElement () { // 根元素
      return this.transitionMode ? this.$el.childNodes[0] : this.$el
    }
  },
  render (h) {
    let defaultSlot = this.$slots.default
    // 判断是否使用 ‘transition-group’
    if (defaultSlot && defaultSlot.length === 1) {
      let childNode = defaultSlot[0]
      if(childNode.componentOptions && childNode.componentOptions.tag === 'transition-group') {
        this.transitionMode = true
      }
    }
    return this.element ? h(this.element, defaultSlot) : defaultSlot[0]
  },
  methods: {
    dragStart ($event) { // 开始拖拽，记录拖拽行的初始索引
      let ele = getDraggableEle($event, this.rootElement)
      this.draggingIndex = getEleIndexOfParent(ele, this.rootElement)
    }, 
    moveDraggableItem ($event) { // 拖拽结束，交换数据的位置
      let targetEle = getDraggableEle($event, this.rootElement)
      let targetIndex = getEleIndexOfParent(targetEle, this.rootElement)
      let list = this.list
      let tmp = list.splice(this.draggingIndex, 1)
      list.splice(targetIndex, 0, tmp[0])
    }
  },
  created () {
    this.$on('draggable-item-start', this.dragStart)
    this.$on('draggable-item-drop', this.moveDraggableItem)
  }
}

Vue.component('draggable', draggable)