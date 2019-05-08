/**
 * 函数防抖
 * @param  {function} fn - 处理的函数
 * @param  {string} delay - 函数执行等待时间
 * @return {function} - 控制目标函数执行的函数
 */
export function debounce(fn, delay) {
  // 持久化一个定时器 timer
  let timer = null;
  // 闭包函数可以访问 timer
  return function () {
    // 通过 'this' 和 'arguments'
    // 获得函数的作用域和参数
    let context = this;
    let args = arguments;
    // 如果事件被触发，清除 timer 并重新开始计时
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
