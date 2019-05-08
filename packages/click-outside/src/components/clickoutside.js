// 缓存监听事件的DOM对象(观察者)
const nodeList = [];
// 观察者在DOM对象上的key
const ctx = '@@clickoutsideContext';
// 缓存点击开始的事件
let startClick;
// Id自增的种子
let seed = 0;
// 注册事件的函数
const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

// mousedown和mouseup，允许鼠标在一个dom上按下，移动到其他dom松开的事件
// 而click事件只能鼠标在同一个DOM上按下松开才能触发
// 鼠标按下时记录点击开始的事件
on(document, 'mousedown', e => (startClick = e));
// 鼠标放松时，通知到所有的观察者，触发处理方法
on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

/**
 * 创建document事件触发处理函数的函数
 * @param {element} el - 监听事件的DOM元素
 * @param {object} binding - Vue 自定义指令内置的对象，{name: 指令名, value: 指令的绑定值, expression: 字符串形式的指令表达式, ...}
 * @param {object} vnode - 虚拟DOM
 * @returns {function} document事件触发的处理函数
 */
function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    // 如果触发事件的对象在监听事件的DOM元素里，或者就是是这个DOM元素，return
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target) return;
    // 否则触发点击元素外面的处理
    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-clickoutside="handleClose">
 * ```
 */
export default {
  name: 'clickoutside',
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      // jsx 中传递的 binding 没有 expression 属性，有 value 属性
      methodName: binding.expression, // 'handleClose'
      bindingFn: binding.value // function
    };
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};
