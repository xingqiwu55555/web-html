function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

/**
 * 将 action 与 dispatch 函数绑定，生成直接可以触发 action 的函数，
 * 可以将第一个参数对象中所有的 action 都直接生成可以直接触发 dispatch 的函数
 * 而不需要一个一个的 dispatch，生成后的方法对应原来 action 生成器的函数名
 **/
export default function bindActionCreators(actionCreators, dispatch) {
  // 
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }
  // actionCreators 必须为 object 类型
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` +
      `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]

    // 给 actionCreators 的每一个成员都绑定 dispatch 方法生成新的方法，
    // 然后注入新的对象中，新方法对应的 key 即为原来在 actionCreators 的名字
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

// 将 action 与 dispatch 函数绑定，生成直接可以触发 action 的函数。
