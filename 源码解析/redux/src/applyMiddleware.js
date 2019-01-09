import compose from './compose'

export default function applyMiddleware(...middlewares) {
  // 结合createStore方法一开始的判断来看
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch
    let chain = []
    // 暴露两个方法给外部函数
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    // 传入middlewareAPI参数并执行每一个外部函数，返回结果汇聚成数组
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
