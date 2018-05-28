# jquery源码分析

## 知识点

## 代码
### 立即调用表达式
1. js中，任何库和框架设计的第一要点就是，解决命名空间与变量污染的问题；立即调用表达式便是来解决这个问题的；
```
// 写法1 --- 单例的jquery类
(function(window, factory) {
  factory(window);
})(this, function() {
  return function() {
    // jquery的调用
  }
})

// 写法2 ---工厂方法模式
var factory = function(){
  return function(){
    // 执行方法
  }
}
var jquery = factory();

// 写法3
(function(window, undefined) {
  var jquery = function(){}
  // ...
  window.jquery = window.$ = jquery;
})(window);
```

### ready与load事件
1. ready先执行，load后执行；
2. DOM文档加载的步骤，ready在第4步完成之后执行，但load要在第6步完成之后才执行：
- (1) 解析HTML结构；
- (2) 加载外部脚本和样式表文件；
- (3) 解析并执行脚本代码；
- (4) 构造HTML DOM模型
- (5) 加载图片等外部文件；
- (6) 页面加载完毕；




(function(){})()