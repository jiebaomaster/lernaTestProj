<template lang="pug">
.col.form-group
  label(v-if='label') {{ label }} :
  .form-row
    .col-md-3(v-for="(value, index) in displayCategoryTree")
      dropdown-select-input(ref='dropdown-select-input' value-key='id' display-key='categoryEnglishName'
        :value='selectedCategory[index]'
        :options="value"
        :is-requesting='index === requestingFlag'
        :placeholder='placeholderList[index]'
        @select-change='setCategory(index, $event)')
        .d-flex.justify-content-between(slot='dropdown-item' slot-scope="{ option }")
          span.dropdown-item-label {{ option['categoryEnglishName'] }}
          span(v-if='option.hasOwnProperty("isLeaf") && !option.isLeaf') >
</template>

<script>
import DropdownSelectInput from './DropdownSelectInput.vue'

export default {
  name: 'cf-cascader-2',
  props: {
    fetchData: { // 获取数据的方法
      type: Function,
      default: () => (() => {})
    },
    label: { // 显示的label文案
      type: String,
      required: false
    },
    placeholderList: { // 输入框placeholder文案
      type: Array,
      default: () => []
    }
  },
  components: {
    DropdownSelectInput
  },
  data () {
    return {
      selectedCategory: [], // 由选中的1、2、3级类目id依次组成的数组
      categoryTree: {}, // 类目树缓存
      displayCategoryTree: [[]], // 由当前显示的1、2、3级类目下拉可选项依次组成的数组
      requestingFlag: -1, // 目前正在请求选项数据的类目层级
    }
  },
  methods: {
    /**
     * 通过父类目 id 获取子级类目列表
     * @param {number} [parentId] - 父类目id，默认一级类目parentId为0
     * @param {number} [level] - 当前请求的类目层级-1
     */
    getCategory (parentId = 0, level = 0) {
      let displayCategory = this.categoryTree[parentId]
      return displayCategory !== undefined ? Promise.resolve(displayCategory)
        : new Promise((resolve, reject) => {
          this.requestingFlag = level // 设置displayCategory数组中对应select-input组件处于“请求中”
          this.fetchData(parentId)
            .then(model => {
              // 缓存类目数据
              this.categoryTree[parentId] = model
              resolve(model)
            })
            .finally(() => {
              this.requestingFlag = -1
            })
        })
    },
    /**
     * 选择类目的事件处理
     * @param {number} level - 当前类目层级-1
     * @param {object} $event - 子组件自定义事件抛出的值，select-input组件某个可选项对象，为null时代表清空选择
     * @param {number} $event.id - 类目id
     * @param {boolean} $event.isLeaf - 当前类目是否是叶子节点
     */
    setCategory (level, $event) {
      if ($event) {
        // 修改当前 level 的 categoryId
        this.selectedCategory.splice(level, this.selectedCategory.length, $event.id)

        if (!$event.isLeaf) {
          // 如果存在次级类目选择框，则重置input
          if (this.$refs['dropdown-select-input'][level + 1]) {
            this.$refs['dropdown-select-input'][level + 1].reset()
          } else { // 否则先预设一个空数组，即显示次级类目选择框，避免异步请求次级类目选项时展示旧数据。
            this.displayCategoryTree.splice(level + 1, this.displayCategoryTree.length, [])
          }
          // 请求下一级数据
          this.getCategory($event.id, level + 1).then(res => {
            // 设置次级类目列表
            this.displayCategoryTree.splice(level + 1, this.displayCategoryTree.length, res)
          })
        } else { // 叶子节点，隐藏次级类目选择框
          this.displayCategoryTree.splice(level + 1, this.displayCategoryTree.length)
        }
      } else { // 清空选择时，隐藏次级类目选择框
        this.selectedCategory.splice(level, this.selectedCategory.length)
        this.displayCategoryTree.splice(level + 1, this.displayCategoryTree.length)
      }
      this.$emit('category-change', this.selectedCategory)
    }
  },
  created () {
    this.getCategory().then(res => { // 获取根目录数据
      this.displayCategoryTree.splice(0, 1, res)
    })
  }
}
</script>
