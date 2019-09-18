## Promise
Promise 是异步编程的一种解决方案，比传统的异步解决方案【回调函数】和【事件】更合理、更强大。


## Promise 与[事件循环(Event Loop)](https://github.com/xingqiwu55555/web-html/tree/master/base-tech/javascript\&es6\&es7/event-loop.md)
```
(function test() {
    setTimeout(function() {console.log(4)}, 0);
    new Promise(function executor(resolve) {
        console.log(1);
        for( var i=0 ; i<10000 ; i++ ) {
            i == 9999 && resolve();
        }
        console.log(2);
    }).then(function() {
        console.log(5);
    });
    console.log(3);
})()
```
上面输出结果是1,2,3,5,4，结论：
1. Promise.then 是异步执行的，而创建 Promise 实例（executor）是同步执行的。
2. setTimeout 的异步和 Promise.then 的异步看起来 “不太一样” ——至少是不在同一个队列中。

## Promise 面试题
* Promise 解决的痛点还有其他方法可以解决吗？如果有，请列举。
* 如何确保一个变量是可信任的Promise（Promise.resolve方法传入不同值的不同处理有哪些）

* [执行顺序判断](https://juejin.im/post/5aa0a1475188255589495c20)
* [Promise 完成代码题](https://segmentfault.com/a/1190000016848192)
* [Promise 相关面试题](https://juejin.im/post/5ad3fa47518825619d4d3a11#heading-9)
* [常见 Promise 面试题](https://juejin.im/post/5b31a4b7f265da595725f322)
* [当面试官问你Promise的时候，他究竟想听到什么？](https://zhuanlan.zhihu.com/p/29235579)
* [网页中预加载20张图片资源问题](https://zhuanlan.zhihu.com/p/29792886)

### 什么是 Promise？

### 如果向Promise.all()和Promise.race()传递空数组，运行结果会有什么不同？

### 传统的回调式异步操作有什么缺点？（Promise是如何解决异步操作）

### Promise 中的异步模式有哪些？有什么区别？

### Promise 的业界实现都有哪些？

### Promise是如何捕获异常的？与传统的try/catch相比有什么优势？
传统的try/catch捕获异常方式是无法捕获异步的异常的，代码如下：
```
try {
	setTimeout(function(){
		undefined();		//undefined不是一个方法，会抛出异常
	}, 500)
} catch(err){
	//这里并不能捕获异常
	console.log(err);
}
```
而对于Promise对象来说，构造Promise实例时的代码如果出错，则会被认为是一个拒绝的决议，并会向观察回调中传递异常信息。所以即使是一个异步的请求，Promise也是可以捕获异常的。此外，Promise 还可以通过 catch 回调来捕获回调中的异常,，不同的是 catch 可以捕获 then 中发生的错误。例如：
```
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('1')
    reject('error')
  }, 1000)
})
// 第一种
promise.then((res) => {
  console.log(res)
}, (error) => {
  console.log(error)
})

// 第二种
promise.then((res) => {
  console.log(res)
}, (res) => {
  res()
}).catch((error) => {
  console.log(error)
})
```

### 能不能手写一个 Promise 的 polyfill?


## 参考
- [JavaScript Promise迷你书（中文版](http://liubin.org/promises-book/#chapter1-what-is-promise)
- [JavaScript Promise：简介 | Web | Google Developers](https://developers.google.com/web/fundamentals/primers/promises?hl=zh-cn)
- [Promise 原理讲解 && 实现一个Promise对象 (遵循Promise/A+规范)](https://juejin.im/post/5aa7868b6fb9a028dd4de672#heading-10)
- [一步一步实现一个 Promise](https://juejin.im/post/5d59757f6fb9a06ae76405c6)
- [Promise 与事件循环](https://www.jianshu.com/p/559d25c88670)
- [前端碎碎念 之 nextTick, setTimeout 以及 setImmediate 三者的执行顺序](https://segmentfault.com/a/1190000008595101)