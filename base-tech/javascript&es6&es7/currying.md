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