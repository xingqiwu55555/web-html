React 官方教程把 State 和 Props 分开来讲解，这里为了方便理解放在一起来总结。

放上一张网上关于 React 组件定义的公式：
```
UI = Component(props, state)
```
从公式我们可以看出 React 组件的两个重要数据源是 props 和 state。

React 的核心思想是组件化，页面会被切分成一些独立的、可复用的组件。每个组件的 UI 呈现都由 state(状态数据) 和 props(外部参数) 决定。

React 非常鼓励无状态组件

## props(外部参数)
组件接受外部传入的参数作为输入值，这个参数就是 props，所以 props 理解为外部参数。由于 React 是单向数据流，所以 props 是从父组件向子组件传递的数据。 

### 特点
1. props 是组件的只读属性，组件内不能直接修改 props。除非父组件主动传入新的 props，否则 props 永远保持不变；
2. 可设置 defaultProps(默认参数);

## state(状态数据)
组件内可以保存、控制、修改自己的可变状态，可以认为这部分可变的状态是局部的，只能被组件自身控制的数据源。

### 特点
1. state 是通过 this.setState 方法进行更新，setState 会导致组件的重新渲染；
2. state 的更新可能是异步的；
3. state 的更新是一个浅合并的过程；

### 数据类型
1. 状态的类型是不可变类型(Number，String，Boolean，Null， Undefined)；
2. 状态的类型是数组；
3. 状态的类型是简单对象(Plain Object)

### state 更新可能是异步的




















