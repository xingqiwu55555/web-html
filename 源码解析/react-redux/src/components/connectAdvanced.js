import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'
import React, { Component, PureComponent } from 'react'
import { isValidElementType } from 'react-is'

/*
  hoistStatics 将WrappedComponent中的非React特定的静态属性(例如propTypes就是React的特定静态属性)赋值到Connect。
  作用有点类似于Object.assign，但是仅复制非React特定的静态属性

  ----------------------------------------------------------------------------

  invariant(someTruthyVal, 'This will not throw');
  // No errors
  
  invariant(someFalseyVal, 'This will throw an error with this message');
  // Error: Invariant Violation: This will throw an error with this message
*/

import { ReactReduxContext } from './Context'

const stringifyComponent = Comp => {
  try {
    return JSON.stringify(Comp)
  } catch (err) {
    return String(Comp)
  }
}
/*
{
  methodName: 'connect',
  getDisplayName: name => `Connect(${name})`,
  shouldHandleStateChanges: Boolean(mapStateToProps),
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  pure,
  areStatesEqual,
  areOwnPropsEqual,
  areStatePropsEqual,
  areMergedPropsEqual,
  ...extraOptions
}
*/

export default function connectAdvanced(
  selectorFactory,
  {
    getDisplayName = name => `ConnectAdvanced(${name})`,

    methodName = 'connectAdvanced',

    renderCountProp = undefined,

    shouldHandleStateChanges = true,

    storeKey = 'store',

    withRef = false,

    forwardRef = false,

    context = ReactReduxContext,

    ...connectOptions
  } = {}
) {
/*---------------------------------ignore---------------------------------------*/
  invariant(
    renderCountProp === undefined,
    `renderCountProp is removed. render counting is built into the latest React dev tools profiling extension`
  )

  invariant(
    !withRef,
    'withRef is removed. To access the wrapped instance, use a ref on the connected component'
  )

  const customStoreWarningMessage =
    'To use a custom Redux store for specific components,  create a custom React context with ' +
    "React.createContext(), and pass the context object to React Redux's Provider and specific components" +
    ' like:  <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. ' +
    'You may also pass a {context : MyContext} option to connect'

  invariant(
    storeKey === 'store',
    'storeKey has been removed and does not do anything. ' +
      customStoreWarningMessage
  )
/*----------------------------------ignore--------------------------------------*/
  const Context = context
  // 接收组件
  return function wrapWithConnect(WrappedComponent) {
    if (process.env.NODE_ENV !== 'production') {
      invariant(
        isValidElementType(WrappedComponent),
        `You must pass a component to the function returned by ` +
          `${methodName}. Instead received ${stringifyComponent(
            WrappedComponent
          )}`
      )
    }

    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    
    // `ConnectAdvanced(${wrappedComponentName})`
    const displayName = getDisplayName(wrappedComponentName)

    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent
    }

    const { pure } = connectOptions

    let OuterBaseComponent = Component
    let FinalWrappedComponent = WrappedComponent

    if (pure) {
      OuterBaseComponent = PureComponent
    }

    function makeDerivedPropsSelector() {
      let lastProps
      let lastState
      let lastDerivedProps
      let lastStore
      let sourceSelector

      return function selectDerivedProps(state, props, store) {
        if (pure && lastProps === props && lastState === state) {
          return lastDerivedProps
        }

        if (store !== lastStore) {
          lastStore = store
          sourceSelector = selectorFactory(
            store.dispatch,
            selectorFactoryOptions
          )
        }

        lastProps = props
        lastState = state
        // 对应selectorFactory中的 pureFinalPropsSelector(nextState, nextOwnProps)
        const nextProps = sourceSelector(state, props)

        lastDerivedProps = nextProps
        return lastDerivedProps
      }
    }

    function makeChildElementSelector() {
      // 闭包 缓存上一次的所有 props、 ref、 component
      // 判断是否变化， 未变化返回上一次的component
      let lastChildProps, lastForwardRef, lastChildElement

      // childProps这里是处理过的所有 props
      return function selectChildElement(childProps, forwardRef) {
        if (childProps !== lastChildProps || forwardRef !== lastForwardRef) {
          lastChildProps = childProps
          lastForwardRef = forwardRef
          lastChildElement = (
            <FinalWrappedComponent {...childProps} ref={forwardRef} />
          )
        }

        return lastChildElement
      }
    }

    class Connect extends OuterBaseComponent {
      constructor(props) {
        super(props)
        invariant(
          forwardRef ? !props.wrapperProps[storeKey] : !props[storeKey],
          'Passing redux store in props has been removed and does not do anything. ' +
            customStoreWarningMessage
        )
        // 两个make函数 闭包 缓存上一次的所有 数据 优化
        this.selectDerivedProps = makeDerivedPropsSelector()
        this.selectChildElement = makeChildElementSelector()
        this.renderWrappedComponent = this.renderWrappedComponent.bind(this)
      }
      // 从context里返回的值处理函数
      renderWrappedComponent(value) {
        // 没有value返回时error message
        invariant(
          value,
          `Could not find "store" in the context of ` +
            `"${displayName}". Either wrap the root component in a <Provider>, ` +
            `or pass a custom React context provider to <Provider> and the corresponding ` +
            `React context consumer to ${displayName} in connect options.`
        )
        const { storeState, store } = value
        // hoistStatics(Connect, WrappedComponent)处理后，这里的this.props 是WrappedComponent 组件自有的props
        let wrapperProps = this.props
        let forwardedRef
        // 对应下面 if (forwardRef) 的处理
        if (forwardRef) {
          wrapperProps = this.props.wrapperProps
          forwardedRef = this.props.forwardedRef
        }
        // 结合所有props
        let derivedProps = this.selectDerivedProps(
          storeState,
          wrapperProps,
          store
        )

        return this.selectChildElement(derivedProps, forwardedRef)
      }

      render() {
        const ContextToUse = this.props.context || Context

        return (
          <ContextToUse.Consumer>
            {this.renderWrappedComponent}
          </ContextToUse.Consumer>
        )
      }
    }

    Connect.WrappedComponent = WrappedComponent
    Connect.displayName = displayName

    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref
      ) {
        return <Connect wrapperProps={props} forwardedRef={ref} />
      })

      forwarded.displayName = displayName
      forwarded.WrappedComponent = WrappedComponent
      return hoistStatics(forwarded, WrappedComponent)
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
