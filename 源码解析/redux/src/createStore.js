import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'

// redux自己创建的action，用来初始化状态树和reducer改变后初始化状态树
export const ActionTypes = {
  INIT: '@@redux/INIT'
}

export default function createStore(reducer, preloadedState, enhancer) {
  // 如果第二个参数为方法且第三个参数为空，则将两个参数交换
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  // enhancer和reducer必须为function类型
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    // 将enhancer包装一次createStore方法，再调用无enhancer的createStore方法
    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer    // 当前的reducer函数
  let currentState = preloadedState   // 当前的state树
  let currentListeners = []         // 监听函数列表
  let nextListeners = currentListeners    // 监听列表的一个引用
  let isDispatching = false            // 是否正在dispatch

  function ensureCanMutateNextListeners() {
    // 判断 nextListeners 和 currentListeners 是同一个引用
    if (nextListeners === currentListeners) {
      // 通过数组的 slice 方法,复制出一个 listeners ,赋值给 nextListeners
      nextListeners = currentListeners.slice()
    }
  }
// 下面的函数被return出去，函数作为返回值，则形成了闭包，currentState等状态会被保存
  // 返回当前state值
  function getState() {
    return currentState
  }

  // 添加一个注册函数，返回一个可以取消这个注册函数的方法
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true
    // 保存一份快照
    ensureCanMutateNextListeners()
    // 添加一个订阅函数
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }
      // 标记现在没有一个订阅的 listener
      isSubscribed = false
      // 保存一下订阅快照
      ensureCanMutateNextListeners()
      // 找到当前的 listener
      const index = nextListeners.indexOf(listener)
      // 移除当前的 listener
      nextListeners.splice(index, 1)
    }
  }

  
  function dispatch(action) {
    // action必须是一个包含type的对象
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      // 标记 dispatch 正在运行
      isDispatching = true
      // 调用reducer方法的地方，返回一个新的state作为currentState
      currentState = currentReducer(currentState, action)
    } finally { 
      // 标记 dispatch 没有在运行
      isDispatching = false
    }
    // 所有的的监听函数赋值给 listeners
    const listeners = currentListeners = nextListeners
    // 遍历所有的监听函数
    for (let i = 0; i < listeners.length; i++) {
      // 执行每一个监听函数
      const listener = listeners[i]
      listener()
    }
    // 返回传入的 action 对象
    return action
  }
  
  // 替换当前的reducer
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }
    // 替换reducer之后重新初始化状态树
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  // 观察者
  function observable() {
    // 订阅方法赋值给变量 outerSubscribe
    const outerSubscribe = subscribe
    return {
      subscribe(observer) {
        // 判断 observer 是一个对象
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }
        // 获取观察者的状态
        function observeState() {
          // 观察者模式的链式结构，传入当前的state
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        // 返回一个取消订阅的方法
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },
      // 对象的私有属性，暂时不知道有什么用途
      [$$observable]() {
        return this
      }
    }
  }
  // 当store被创建的时候，初始化状态树
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,     // 唯一一个可以改变state的
    subscribe,    // 给store的状态树添加监听函数，一旦dispatch被调用，所有的监听函数就会被执行
    getState,     // 获取store里的state
    replaceReducer,   // Redux热加载的时候可以替换Reducer
    [$$observable]: observable  // 对象的私有属性，供内部使用
  }
}
