export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
/* 代码组合
let x = 10
function fn1 (x) {return x + 1}
function fn2(x) {return x + 2}
function fn3(x) {return x + 3}
function fn4(x) {return x + 4}

// 假设我这里想求得这样的值
let a = fn1(fn2(fn3(fn4(x)))) // 10 + 4 + 3 + 2 + 1 = 20

// 根据compose的功能，我们可以把上面的这条式子改成如下：
let composeFn = compose(fn1, fn2, fn3, fn4)
let b = composeFn(x) // 理论上也应该得到20

funcs = [f1, f2, f3, f4, f5]
*/