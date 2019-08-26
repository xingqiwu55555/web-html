import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

// mapStateToProps 
// 如果传入的是function， 返回一个wrapMapToPropsFunc调用mapStateToProps后的结果
// 如果没有传入，返回一个wrapMapToPropsConstant调用空方法后的结果
// 其它返回 undefined
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function'
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined
}

export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined
}

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]
