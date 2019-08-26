### react-redux：

1. 提供一个provider组件，同时此组件经由React.createContext()方法把组件state里的值存放在context中，state里的值通过props.store获得，以及组件里每次store的更新处理；
```
// redux 中创建的store: { getState, dispatch, subscribe, ... }
<Provider store={store}></Provider>
```

2. 提供connect方法，准确地说是一个高阶函数，第一次调用传入mapStateToProps/mapDispatchToProps等参数，常用的是这两个参数，connect内部会对这些传入的参数做一些处理，处理后的参数放入return中返回一个高阶组件，此组件接收一个组件，也就是我们第二次调用传入的参数...好吧，这里说复杂了，其实这里主要做了一件事，虽然混用了很多高阶函数，但其实质是实现了一个高阶组件，传入的组件经由Provider里生成的context，变成类似这样的组件： <Context.Consumer>{(value) => <WrapComponent ...handleValue />}</Context.Consumer>，把value处理一下全部通过props传给传入的组件；
```
const mapStateToProps=(state)=>({
    count: state.count
});

const mapDispatchToProps = (dispatch) => ({refactorDis: dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentComponent);
```

### 收获
1. [React.createContext()](https://reactjs.org/docs/context.html#when-to-use-context)的使用，这里有一个很好的实现是，把<Context.Provider value={state}></Context.Provider>中需要控制value变化的值存储在Provider组件的state中，组件内又利用生命周期的方法来update组件的state值。

2. 