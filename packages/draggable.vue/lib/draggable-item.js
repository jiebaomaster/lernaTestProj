const draggableItem = {
  name: 'draggable-item',
  componentName: 'draggable-item',
  props: {
    tag: { // 包裹元素
      type: String,
      default: 'div'
    },
    draggableFlag: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    return h(this.tag, {
      domProps: {
        draggable: this.draggableFlag
      },
      on: {
        dragstart: this.handleDragStart,
        dragover: this.handleDragOver,
        dragend: this.handleDragEnd,
        drop: this.handleDrop
      }
    }, this.$slots.default)
  },
  mounted() {
    let supportDraggable = ('draggable' in document.createElement('div'))
    if (!supportDraggable) { // 检测浏览器是否支持原生拖拽
      console.warn('Your browser do not support native drag!')
    }
  },
  methods: {
    dispatch(componentName, eventName, params) { // 向父组件传递事件
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    handleDragStart(event) {
      event.stopPropagation()
      event.dataTransfer.effectAllowed = 'move'

      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a item out of the list won't open a new tab in FireFox
        event.dataTransfer.setData('text/plain', '')
      } catch (e) {
      }

      // this.$emit('draggable-item-start', event.target)
      this.dispatch('draggable', 'draggable-item-start', event)
    },
    handleDragOver(event) {
      event.stopPropagation()
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    handleDragEnd(event) {
      event.stopPropagation()
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'

      this.$emit('drag-end', event.target)
    },
    handleDrop(event) {
      event.stopPropagation()
      event.preventDefault()

      this.dispatch('draggable', 'draggable-item-drop', event)
    }
  },
}

Vue.component('draggable-item', draggableItem)