## 知识点梳理
### 一、Object.getPrototypeOf(obj)
1. 参数必须是object，如果不是，则将引发TypeError异常；
2. 返回值是obj参数的原型，原型也是对象；


## 
### 一. jQuery.fn.extend(object)和jQuery.extend(object)
1. jQuery.fn.extend(object)
- 概述：扩展jquery对象添加新的方法（通常用来制作插件）；
- 原理：jquery源码中有jQuery.fn = jQuery.prototype，所以jQuery.fn.extend(object)是对jQuery.prototype进得扩展，就是为jQuery类添加“成员函数”。jQuery类的实例可以使用这个“成员函数”。
```
jQuery.fn.extend({
  check: function() {
    return this.each(function() { this.checked = true; });
  },
  uncheck: function() {
    return this.each(function() { this.checked = false; });
  }
});
/*--------------------*/
$("input[type=checkbox]").check();
$("input[type=radio]").uncheck();
```
2. jQuery.extend(object)
- 概述：扩展jquery类本身，为类添加新的方法，用来在jquery命名空间上增加新函数；
- 原理：
```
jQuery.extend({
  min: function(a, b) { return a < b ? a : b; },
  max: function(a, b) { return a > b ? a : b; }
});
/*--------------------*/
jQuery.min(2,3); // => 2
jQuery.max(4,5); // => 5
```
