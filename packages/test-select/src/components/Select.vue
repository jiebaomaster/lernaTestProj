<template lang="pug">
  .dropdown.btn-group(:class="{ show: visible && !disabled }"
    @keydown.down.prevent.stop="navigateOptions('next')"
    @keydown.up.prevent.stop="navigateOptions('prev')"
    @keydown.enter.prevent.stop="handleKeyUpEnter")
    button.btn.btn-outline-dark.dropdown-toggle(
      ref='selectButton' 
      type='button'
      :disabled='disabled'
      @click.prevent.stop='toggleOpen')
      span.mr-1 {{ selectValue || '请选择' }}
    .dropdown-menu(:class="{ show: visible && !disabled }")
      a(v-for='(option, index) in options'
        class='dropdown-item'
        href='#'
        :class='{ active: hoverIndex === index }'
        @click.stop='selectOption(option)') {{ option }}
</template>

<script>
export default {
  props: {
    defaultValue: [String], // 选中的值
    options: Array, // 可选项
    disabled: { // 是否禁用
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      selectValue: '',
      hoverIndex: -1, // 鼠标或方向键选择的选项的Index
      visible: false, // 下拉选项是否可见
    }
  },
  watch: {
    // 展开选项时自动focus
    'isOpen' (value) {
      value && this.autoFocus()
    }
  },
  methods: {
    // 自动focus button元素
    autoFocus () {
      this.$refs.selectButton.focus()
      // hoverIndex 指向选中的值或-1
      this.hoverIndex = this.options.findIndex(option => option === this.defaultValue)
    },
    // 切换Open状态
    toggleOpen () {
      this.visible = !this.visible
    },
    // 回车选中高亮的选项
    handleKeyUpEnter () {
      let value = this.options[this.hoverIndex]
      if (value) {
        this.selectOption(value)
      }
    },
    /**
     * 鼠标点击选项
     * @param {string} option - 点击的选项
     */
    selectOption (option) {
      this.selectValue = option
      this.$emit('select-option', option)
      this.visible = false
    },
    /**
     * 导航
     * @param {string} direction - 导航方向 prev/next
     */
    navigateOptions (direction) {
      // 如果选择未展开，则展开
      if (!this.visible) {
        return this.visible = true
      }
      if (this.options.length === 0) return
      if (direction === 'prev') {
        this.hoverIndex--
        if (this.hoverIndex < 0) {
          this.hoverIndex = this.options.length - 1
        }
      } else if (direction === 'next') {
        this.hoverIndex++
        if (this.hoverIndex >= this.options.length) {
          this.hoverIndex = 0
        }
      }
    }
  },
  mounted() {
    // 刚挂载时，如果选项是展开状态，则自动focus
    this.visible && this.$nextTick(() => {
      this.autoFocus()
    })
  }
}
</script>
