## js知识代码考察题
#### 1. 手写promise

## js代码题
#### 1. 综合考察js题
- [详细](http://www.cnblogs.com/xxcanghai/p/5189353.html)
```
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

//请写出以下输出结果：
Foo.getName();       //2
getName();           //4
Foo().getName();     //1
getName();           //1
new Foo.getName();   //2
new Foo().getName(); //3
new new Foo().getName();  //3
```

#### 2. 经典JS闭包面试题
- [详细](http://www.cnblogs.com/xxcanghai/p/4991870.html)
```
function fun(n,o) {
  console.log(o)
  return {
    fun:function(m){
      return fun(m,n);
    }
  };
}
var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3);//undefined,?,?,?
var b = fun(0).fun(1).fun(2).fun(3);//undefined,?,?,?
var c = fun(0).fun(1);  c.fun(2);  c.fun(3);//undefined,?,?,?

//a: undefined,0,0,0
//b: undefined,0,1,2
//c: undefined,0,1,1
```

#### 3. 连等符号
- [详细](http://www.iteye.com/topic/785445)
```
// a
var a = {n:1};  
a.x = a = {n:2};  
alert(a.x);  // --> undefined 

// b
var a = {n:1};  
var b = a;  // 持有a，以回查  
a.x = a = {n:2};  
alert(a.x);   // --> undefined  
alert(b.x);   // --> [object Object]  

// c
function fun(){  
    var a = b = 5;  
}  
fun();  
alert(typeof a);   // --> undefined  
alert(typeof b);   // --> number  
```

#### 4. 闭包
```
function Foo() {
    var i = 0;
    return function() {
        console.log(i++);
    }
}
 
var f1 = Foo(),
    f2 = Foo();
f1();   //0
f1();   //1
f2();   //0
```

#### 5. 布尔类型
```
console.log(([])?true:false);          //t
console.log(([]==false?true:false));   //t
console.log(({}==false)?true:false);   //f
tips：
1. 布尔类型里只有以下参数返回false，其它都为true：
Boolean(undefined)
Boolean(null)
Boolean(0)
Boolean(NaN)
Boolean('')

2. 布尔类型与其它任何类型进行比较，布尔类型会转换为number类型：
Number([]) => 0
Number转换类型的参数如果为对象返回的就是NaN
```

#### 6. 原型
```
var A = {n: 4399};
var B = function(){this.n = 9999;};
var C = function(){var n = 8888;};
B.prototype = A;
C.prototype = A;
var b = new B();
var c = new C();
A.n++;
console.log(b.n);   // 9999
console.log(c.n);   // 4400

tips:
new运算的具体执行过程：
1)创建一个空对象
2)把这个空对象的__proto__指向构造函数的prototype
3)把这个空对象赋值给this
4)执行构造函数内的代码，注意此时的this指向新对象，this.n=9999 等价于b.n=9999;
然后访问b.n，存在，直接输出b.n。
再去访问c.n，不存在，通过原型链__proto__向上寻找，c.__proto__指向C.prototype也就是A，所以就是输出A.n
```

#### 7. 预解析
[详情](https://mp.weixin.qq.com/s/jpBKsPIOcm5_Db9OWMJkzg)
```
alert(a)    //打印函数
a();
var a=3;
function a(){
    alert(10)
}   
alert(a)
a=6;
a();  
/********************/
alert(a)
a();
var a=3;
var a=function(){
    alert(10)
}   
alert(a)
a=6;
a(); 
tips：预解析是把带有var和function关键字的事先声明，但不会赋值；函数声明优先变量声明。
```