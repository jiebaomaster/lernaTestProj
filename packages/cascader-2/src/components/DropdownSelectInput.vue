<template lang="pug">
.dropdown(ref='dropdown' v-clickoutside='closeDropdown'
  :class="{ show: visible }"
  @keydown.down.prevent.stop="navigateOptions('next')"
  @keydown.up.prevent.stop="navigateOptions('prev')"
  @keydown.enter.prevent.stop="handleKeyDownEnter")
  input.form-control.dropdown-toggle(type='text'
    ref='input'
    v-model.trim='searchString'
    :placeholder='placeholder'
    @click.prevent.stop='toggleOpen')
  button.clear-btn(type='button' @click="cancelSelect") &times;
  .dropdown-menu.p-0.w-100(ref='dropdown-menu' :class="{ show: visible }")
    a.dropdown-item(ref='dropdown-menu-item' v-for='(option, index) in suggestion'
      href='#'
      :title='option[displayKey]'
      :class='{ hover: hoverIndex === index, active: activeIndex === index }'
      @mouseenter='hoverIndex=index'
      @click.stop.prevent='selectOption(option)')
      slot(name="dropdown-item" :option="option" :index='index')
        .dropdown-item-label {{ option[displayKey] }}
</template>

<script>
import { debounce } from './debounce'
import clickoutside from '@cf-vue-plugin/click-outside'

export default {
  name: 'cf-select-input',
  props: {
    value: { // 当前所选项option中valueKey属性的值
      type: [String, Number],
      default: ''
    },
    isRequesting: { // 是否正在请求数据
      type: Boolean,
      default: false
    },
    valueKey: { // option中用来标志唯一性的字段名
      type: String,
      default: 'id'
    },
    displayKey: { // option中用来显示的字段名
      type: String,
      required: true
    },
    options: { // 可选项列表
      type: Array,
      default: () => []
    },
    placeholder: { // 输入框的提示文案
      type: String,
      default: '请选择'
    },
  },
  data () {
    return {
      searchString: '', // 搜索字符串
      hoverIndex: -1, // 鼠标或方向键选择的选项的Index
      activeIndex: -1, // 当前选中的选项索引
      visible: false, // 下拉选项是否可见
      suggestion: [], // 实际展示的可选项
    }
  },
  watch: {
    searchString: 'debounceFindMatch'
  },
  methods: {
    findMatch () { // 在全部可选项里进行模糊匹配，不区分大小写
      if (this.searchString.length > 0) {
        let regStr = new RegExp(this.searchString, 'i')
        let tmpArry = this.options.filter(ele => {
          return regStr.test(ele[this.displayKey])
        })
        if (tmpArry.length > 0) {
          // 输入改变时，展示匹配项列表，重置hover高亮
          this.hoverIndex = -1
          this.suggestion = tmpArry
        } else {
          this.suggestion = [{
            [this.displayKey]: 'No available option',
          }]
        }
      } else { // 默认展示
        this.hoverIndex = -1
        this.suggestion = this.options
      }
    },
    debounceFindMatch: debounce(function () {
      this.findMatch()
    }, 200),
    toggleOpen () { // 切换下拉选择显示状态
      if (!this.visible) {
        this.visible = true
        // 设置当前选中的选项索引
        this.activeIndex = this.hoverIndex = this.options.findIndex(option => option[this.valueKey] === this.value)
        if (this.isRequesting) {
          this.suggestion = [{ // 正在请求 options 的显示 loading
            [this.displayKey]: 'Loading...',
          }]
          let unwatch = this.$watch('options', () => {
            this.initSuggestion()
            unwatch()
          })
        } else {
          this.initSuggestion()
        }
      } else {
        this.closeDropdown()
      }
    },
    closeDropdown () { // 关闭下拉选择
      this.$nextTick(() => {
        let selectedOption = this.options.find(e => e[this.valueKey] === this.value)
        // 重置input显示的值
        this.searchString = selectedOption ? selectedOption[this.displayKey] : ''
        this.visible = false
      })
    },
    initSuggestion () { // 初始化 suggestion
      this.suggestion = this.options
      this.$nextTick(() => {
        this.scrollIntoView()
      })
    },
    handleKeyDownEnter () { // 回车选中高亮的选项
      let selectedOption = this.suggestion[this.hoverIndex]
      if (selectedOption) {
        this.selectOption(selectedOption)
      }
    },
    reset () { // 重置
      this.searchString = ''
      this.visible = false
    },
    cancelSelect () { // 取消当前选择
      this.reset()
      this.$emit('select-change', null)
    },
    /**
     * 鼠标点击选项
     * @param {object} option - 点击的选项
     */
    selectOption (option) {
      let value = option[this.valueKey]
      if (value === undefined) {
        return
      }
      this.$emit('select-change', option)
      this.closeDropdown()
    },
    /**
     * 支持方向键盘事件
     * @param {string} direction - 导航方向 prev/next
     */
    navigateOptions (direction) {
      // 如果选择未展开，则展开
      if (!this.visible) {
        return this.visible = true
      }
      if (this.suggestion.length === 0) return
      if (direction === 'prev') {
        this.hoverIndex--
        if (this.hoverIndex < 0) {
          this.hoverIndex = this.suggestion.length - 1
        }
      } else if (direction === 'next') {
        this.hoverIndex++
        if (this.hoverIndex >= this.suggestion.length) {
          this.hoverIndex = 0
        }
      }
      this.scrollIntoView()
    },
    scrollIntoView () { // 将当前所选项滚动到可视区域内
      if (this.hoverIndex === -1) return
      const container = this.$refs['dropdown-menu']
      const selected = this.$refs['dropdown-menu-item'][this.hoverIndex]
      const top = selected.offsetTop
      const bottom = top + selected.offsetHeight;
      const viewRectTop = container.scrollTop;
      const viewRectBottom = viewRectTop + container.clientHeight;

      if (top < viewRectTop) { // 当前所选项在可视区域之上
        container.scrollTop = top;
      } else if (bottom > viewRectBottom) { // 当前所选项在可视区域之下
        container.scrollTop = bottom - container.clientHeight;
      }
    }
  },
  directives: {
    clickoutside
  }
}
</script>

<style scoped lang="scss">
.clear-btn {
  opacity: 0;
  border: none;
  background-color: transparent;
  font-size: 20px;
  line-height: 1;
  padding: 6px 3px;
  position: absolute;
  top: 1px;
  right: 1px;
  transition: all ease .3s;
}
.dropdown:hover .clear-btn {
  opacity: 1;
}

.dropdown-menu {
  overflow-y: auto;
  max-height: 20rem;
}
.dropdown-item {
  padding: .5rem 1rem;
  cursor: pointer;
  .dropdown-item-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.active, &:active {
    background-color: #ffffff;
    color: #FA423E;
  }
  &.hover, &:hover {
    background-color: #fef6f5;
  }
}
</style>