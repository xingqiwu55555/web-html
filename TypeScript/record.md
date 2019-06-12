# typescript #
### 基本类型 --- Basic Types
### 变量声明 --- Variable Declarations
### 接口 --- Interfaces
### 类 --- Classes
### 函数 --- Functions
### 泛型 --- Generics
### 枚举 --- Enums
### 类型推论 --- Type Inference
### 类型兼容性 --- Type Compatibility
### 高级类型 --- Advanced Types
### Symbols
### 迭代器和生成器 --- Iterators and Generators
### 模块 --- Modules
### 命名空间 --- Namespaces
### 命名空间和模块 --- Namespaces and Modules
### 模块解析 --- Module Resolution
### 声明合并 --- Declaration Merging
### JSX
### 装饰器 --- Decorators
### Mixins
### 三斜线指令 --- Triple Slash Directives
### 键入检查JavaScript文件 --- Type Checking JavaScript


# 泛型

1. 常用场景：当返回值的类型与传入参数的类型是相同时；
2. 定义了泛型函数后的使用：
```
function identity<T>(arg: T): T {
  return arg;
}

// expmle1: 传入所有的参数，包含类型参数
let output = identity<string>("myString");

// expmle2: 利用了类型推论 --- 即编译器会根据传入的参数自动地帮助我们确定T的类型
let output = identity("myString");
```

### 泛型变量
```
// expmle1
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);   // Error: T doesn't have .length
  return arg;
}

// expmle2.1
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}

// expmle2.2
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}
```

### 泛型类型
```
// exmple1: 泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

// exmple2: 不同的泛型参数名，只要在数量上和使用方式上能对应上就可以
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity; 

// exmple3: 带有调用签名的对象字面量来定义泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

### 泛型接口
我们把上例3的对象字面量拿出来做为一个接口
```
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```
把泛型参数当做整个接口的一个参数，我们不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。
```
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 泛型类
泛型类使用<>括起泛型类型，跟在类名后面
类有两部分：静态部分和实例部分，泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。
```
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

let stringNumeric = new GenericNumber<string>();
stringNumberic.zeroValue = "";
stringNumberic.add = function(x, y) { return x + y; };
```

### 泛型约束
```
// 前提
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);   // Error
  return arg;
}

// exmple 1
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```
在泛型约束中使用类型参数
```
function getProperty(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, 'a');
getProperty(x, 'm');
```
#### 在泛型里使用类类型
在ts使用泛型创建工厂函数时，需要引用构造函数的类类型，比如
```
function create<T>(c: { new(): T; }): T {
  return new c();
}
```
一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系
```
class BeeKeeper {
  hasMask: boolean;
}

class ZooKeeper {
  nametag: string;
}

class Animal {
  numLegs: number;
}

class Bee extends Animal {
  keeper: BeeKeeper;
}

class Lion extends Animal {
  keeper: ZooKeeper;
}

function creeateInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```


# important points
### 类型别名 - type VS 接口 - interface 
[参考](https://juejin.im/post/5c14bb21f265da61417176d4)，总结：
- 类型别名 能像interface一样，但是他们有三个重要的区别（联合类型，声明合并）
- 使用适合你或者你团队的东西，但是要保持一致
- 当你写个库或者定义第三方环境类型的时候，在公开的API中总是使用interface
- 在你的React组件的state/props中考虑使用类型别名
