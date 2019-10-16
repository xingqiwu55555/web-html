# Promise
Promise 是异步编程的一种解决方案，比传统的异步解决方案【回调函数】和【事件】更合理、更强大。

Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，也一个构造函数，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

出现的原因：原生 ajax 出现了回调地狱的灾难，而为了我们的代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来。

原生 ajax 使用补充：
```
var url = 'https://www.baidu.com';
var result;

var XHR = new XMLHttpRequest();
XHR.open('GET', url, true);
XHR.send();

XHR.onreadystatechange = function() {
    if (XHR.readyState == 4 && XHR.status == 200) {
        result = XHR.response;
        console.log(result);
    }
}
```

# 基础知识
Promise 无法取消，一旦新建它就会立即执行

## Promise 的三种状态
1. pending: 等待中，或者进行中，表示还没有得到结果；
2. resolved(Fulfilled): 已经完成，表示得到了我们想要的结果，可以继续往下执行；
3. rejected: 也表示得到结果，但是由于结果并非我们所愿，因此拒绝执行；

这三种状态不受外界影响，而且状态只能从 pending 改变为 resolved 或 rejected，不可逆。在Promise对象的构造函数中，将一个函数作为第一个参数。而这个函数，就是用来处理Promise的状态变化。resolve、reject函数，分别对应状态 resolved、rejected。

## Promise 的 then 方法
then 方法是定义在 Promise 原型对象 Promise.prototype 上的。

then 方法 可以接收构造函数中处理的状态变化，并分别对应执行。then 方法有 2 个参数，第一个函数接收 resolved 状态的执行，第二个参数接收 rejected 状态的执行。

then 方法 的执行结果也会返回一个 Promise 对象。因此我们可以进行 then 的链式执行，这也是解决回调地狱的主要方式。

注意：then(null, function() {}) 就等同于catch(function() {})

如果调用 then 的 Promise 的状态（resolved 或 rejected）发生改变，但是 then 中并没有关于这种状态的回调函数，那么 then 将创建一个没有经过回调函数处理的新 Promise 对象，这个新 Promise 只是简单地接受调用这个 then 的原 Promise 的终态作为它的终态。

## Promise 的 Promise.all() 和 Promise.race() 方法
Promise.all：接收一个 Promise 对象组成的数组作为参数，当这个数组所有的 Promise 对象状态都变成 resolved 或者 rejected 的时候，它才会去调用 then 方法。对应场景为：
  当有一个 ajax 请求，它的参数需要另外 2 个甚至更多请求都有返回结果之后才能确定，那么这个时候，就需要用到 Promise.all 来帮助我们应对这个场景。

Promise.race：也是接收一个 Promise 对象组成的数组作为参数，不同的是，只要当数组中的其中一个 Promise 状态变成 resolved 或 rejected 时，就可以调用 .then 方法了，而传递给then方法的值也会有所不同。

## 其它方法
### 1. Promise.prototype.catch()
catch 方法是 .then(null, rejection) 或 .then(undefined, rejection) 的别名，用于指定发生错误时的回调函数。
```
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```
then 方法指定的回调函数，如果运行中抛出错误，也会被 catch 方法捕获。

### 2. Promise.prototype.finally()
finally 不管 promise 最后的状态，在执行完 then 或 catch 指定的回调函数以后，都会执行 finally 方法指定的回调函数。
```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```


### 3. [Promise.all()](http://es6.ruanyifeng.com/#docs/promise#Promise-all)
Promise.all 方法看阮一峰的详解更好一些。
```
const p = Promise.all([p1, p2, p3]);
```
p 的状态由p1，p2，p3决定：

1. 只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。
2. 只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给p的回调函数。

但注意：如果作为参数的 Promise 实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发 Promise.all() 的 catch 方法。


### 4. Promise.race()
```
const p = Promise.race([p1, p2, p3]);
```
与 Promise.all() 不同的是，只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。


### 5. [Promise.resolve()](http://es6.ruanyifeng.com/#docs/promise#Promise-resolve)
该方法会返回一个新的 Promise 实例，该实例的状态为 resolved。
```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
Promise.resolve方法的参数分成四种情况：
1. 参数是一个 Promise 实例
如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。

2. 参数是一个 thenable 对象：thenable 对象指的是具有 then 方法的对象
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```

3. 参数不是具有then方法的对象，或根本就不是对象，then 方法的 resolve 回调接收的参数就是传入的 参数
```
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

4. 不带有任何参数
Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。
```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');
```

### 6. Promise.reject()
该方法会返回一个新的 Promise 实例，该实例的状态为rejected。
```
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```
注意：Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。这一点与Promise.resolve方法不一致。
```
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```

### 7. Promise.try()








# Promise 与[事件循环(Event Loop)](https://github.com/xingqiwu55555/web-html/tree/master/base-tech/javascript\&es6\&es7/event-loop.md)
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

# Promise 面试题
* Promise 解决的痛点还有其他方法可以解决吗？如果有，请列举。
* 如何确保一个变量是可信任的Promise（Promise.resolve方法传入不同值的不同处理有哪些）

* [执行顺序判断](https://juejin.im/post/5aa0a1475188255589495c20)
* [Promise 完成代码题](https://segmentfault.com/a/1190000016848192)
* [Promise 相关面试题](https://juejin.im/post/5ad3fa47518825619d4d3a11#heading-9)
* [常见 Promise 面试题](https://juejin.im/post/5b31a4b7f265da595725f322)
* [当面试官问你Promise的时候，他究竟想听到什么？](https://zhuanlan.zhihu.com/p/29235579)
* [网页中预加载20张图片资源问题](https://zhuanlan.zhihu.com/p/29792886)

## 什么是 Promise？

## 如果向Promise.all()和Promise.race()传递空数组，运行结果会有什么不同？

## 传统的回调式异步操作有什么缺点？（Promise是如何解决异步操作）

## Promise 中的异步模式有哪些？有什么区别？

## Promise 的业界实现都有哪些？

## Promise是如何捕获异常的？与传统的try/catch相比有什么优势？
传统的 try/catch 捕获异常方式是无法捕获异步的异常的，代码如下：
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

## 能不能手写一个 Promise 的 polyfill?


# 参考
- [JavaScript Promise迷你书（中文版](http://liubin.org/promises-book/#chapter1-what-is-promise)
- [JavaScript Promise：简介 | Web | Google Developers](https://developers.google.com/web/fundamentals/primers/promises?hl=zh-cn)
- [Promise 原理讲解 && 实现一个Promise对象 (遵循Promise/A+规范)](https://juejin.im/post/5aa7868b6fb9a028dd4de672#heading-10)
- [一步一步实现一个 Promise](https://juejin.im/post/5d59757f6fb9a06ae76405c6)
- [Promise 与事件循环](https://www.jianshu.com/p/559d25c88670)
- [前端碎碎念 之 nextTick, setTimeout 以及 setImmediate 三者的执行顺序](https://segmentfault.com/a/1190000008595101)
- [自测题](https://stackblitz.com/edit/js-promise2?file=index.js)