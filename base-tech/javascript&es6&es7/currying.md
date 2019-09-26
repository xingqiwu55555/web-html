# 柯里化

先上写好的示例：
```
function currying(fn){
    var allArgs = [];

    function next(){
        var args = [].slice.call(arguments);
        allArgs = allArgs.concat(args);
        return next;
    }
    // 字符类型
    next.toString = function(){
        return fn.apply(null, allArgs);
    };
    // 数值类型
    next.valueOf = function(){
        return fn.apply(null, allArgs);
    }

    return next;
}
var add = currying(function(){
    var sum = 0;
    for(var i = 0; i < arguments.length; i++){
        sum += arguments[i];
    }
    return sum;
});

console.log(add(1, 2, 3, 4, 5));
console.log(add(1, 2)(3, 4))
console.log(add(1)(2)(4)(4))
```


# 概念
柯里化（英语：Currying），又称为部分求值，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回一个新的函数的技术，新函数接受余下参数并返回运算结果。特点：

* 接收单一参数，将更多的参数通过回调函数来搞定；
* 返回一个新函数，用于处理所有的想要传入的参数；
* 需要利用 call/apply 与 arguments 对象收集参数；
* 返回的这个函数正是用来处理收集起来的参数；


# 相关知识点
1. 闭包
2. 递归
3. 函数的隐式转换
4. call/apply


## 参考
- [JS 函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch4.html#%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E5%8F%8C%E5%85%B3%E8%AF%AD%E5%92%96%E5%96%B1)
- [Understanding Currying in JavaScript](https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339)
- [波神 前端基础进阶系列之柯里化](https://www.jianshu.com/p/5e1899fe7d6b)














