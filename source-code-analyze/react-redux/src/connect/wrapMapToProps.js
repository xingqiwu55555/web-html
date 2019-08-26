import verifyPlainObject from '../utils/verifyPlainObject'

export function wrapMapToPropsConstant(getConstant) {
  // 空函数返回的结果 getConstan = () => ({})
  return function initConstantSelector(dispatch, options) {
    const constant = getConstant(dispatch, options)

    function constantSelector() {
      return constant
    }
    constantSelector.dependsOnOwnProps = false
    return constantSelector // { dependsOnOwnProps: false }
  }
}

export function getDependsOnOwnProps(mapToProps) {
  /*
    mapToProps.length !== 1
  */
  return mapToProps.dependsOnOwnProps !== null &&
    mapToProps.dependsOnOwnProps !== undefined
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1
}

// 使用：wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
export function wrapMapToPropsFunc(mapToProps, methodName) {
  // 
  return function initProxySelector(dispatch, { displayName }) {
    /*
      proxy 是一个函数，它有属性：dependsOnOwnProps(boolean)/mapToProps(function)。同时最后被return出去了；
      执行proxy，return 根据 dependsOnOwnProps 传入不同参数的 mapToProps函数 执行的结果；
    */
    const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }

    proxy.dependsOnOwnProps = true

    proxy.mapToProps = function detectFactoryAndVerify(
      stateOrDispatch,
      ownProps
    ) {
      proxy.mapToProps = mapToProps
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps)
      let props = proxy(stateOrDispatch, ownProps)

      if (typeof props === 'function') {
        proxy.mapToProps = props
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props)
        props = proxy(stateOrDispatch, ownProps)
      }

      if (process.env.NODE_ENV !== 'production')
        verifyPlainObject(props, displayName, methodName)

      return props
    }

    return proxy
  }
}
