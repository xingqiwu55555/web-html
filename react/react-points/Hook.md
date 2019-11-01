# Hook
[例子](https://stackblitz.com/edit/react-hook-examples)

## 动机
1. 在组件之间复用状态逻辑很难，hooks 出现之前，通过高阶组件和 render props实现，但容易形成嵌套地狱；
2. 复杂组件变得难以理解，按照生命周期强制划分、状态逻辑无处不在导致组件不可能拆分为更小的粒度；
3. 难以理解的 class，学习难度大和在某些场景下的性能无法保障；

## 概念
1. Hook 是什么？ Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，useState 是允许你在 React 函数组件中添加 state 的 Hook。

2. 什么时候我会用 Hook？ 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以在现有的函数组件中使用 Hook。

## 坑点
1. const [state, setState] = useState(0)，中setState每次调用，会重新渲染组件；
2. useEffect 在每次渲染的时候都会执行，且会在执行当前 effect 之前对上一个 effect 进行清除，如果effect只执行一次(第二参数为[])，它对应的清除函数会在组件卸载时执行(这里的应用和 class 组件的 componentDidMount、componentWillUnMount 有相同点)；


