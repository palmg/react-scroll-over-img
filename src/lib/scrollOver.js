'use strict';
import React from 'react'
import {get} from './environment'

const __element = get().scrollDom,
    __offsetY = get().scrollOffset

function Scroll() {
    const _this = this
    this.scrollEl = false//要监控的滚动对象
    this.preScrollEl = false//前滚动对象
    this.handleList = []
    this.bodyElement = 'undefined' !== typeof window ? window.document.body : {clientHeight: 0} //当前浏览器的视口高度
}

Scroll.prototype.setElement = function (el) {
    let scrollEl = 'object' === typeof el ? el : document.getElementById(el)
    !scrollEl && (() => {
        scrollEl = this.bodyElement
    })()
    this.preScrollEl = this.scrollEl
    this.scrollEl = scrollEl
    this.handleList.forEach(i => i.act && i.cb(scrollEl))
}
/**
 * 判断指定元素是否进入视口（用户可视区域）
 * @param el
 * @returns {boolean}
 */
Scroll.prototype.elementInView = function (el) {
    const scrollEl = this.scrollEl,
        height = scrollEl.tagName ? scrollEl.clientHeight : scrollEl.innerHeight,
        top = el.getBoundingClientRect().top;
    return __offsetY < height - top;
}
/**
 * 设定当滚动元素变更时触发的回调函数
 * @param cb
 * @returns {Number}
 */
Scroll.prototype.addElModifyHandle = function (cb) {
    const id = this.handleList.length
    this.handleList.push({act: true, cb})
    return id
}
/**
 * 移除回调函数
 * @param id
 * @returns {Scroll}
 */
Scroll.prototype.removeElModifyHandle = function (id) {
    id && (this.handleList[id].act = false)
    return this
}
/**
 * 注册滚动监听回调
 * @param cb
 */
Scroll.prototype.addListener = function (cb) {
    this.scrollEl && this.scrollEl.addEventListener('scroll', cb)
}
/**
 * 移除滚动监听回调
 * @param cb
 */
Scroll.prototype.removeListener = function (cb) {
    this.scrollEl && this.scrollEl.removeEventListener('scroll', cb)
}
/**
 * 重设滚动监听回调
 * @param cb
 */
Scroll.prototype.setListener = function (cb) {
    this.preScrollEl && this.preScrollEl.removeEventListener('scroll', cb)
    this.scrollEl && this.scrollEl.addEventListener('scroll', cb)
}

const scroll = new Scroll()
scroll.setElement(__element)
const getComponentName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const bind = (dom) => {
    scroll.setElement(dom)
}
const _default_ = {
    renderMode: 'none',
    inOff: true,
    registerName: 'register',
    removeName: 'remove',
    emitName: 'over'
}, setDefault = (options) => {
    if (options) {
        return Object.keys(_default_).map(k => {
            const v = options[k]
            return 'undefined' === typeof v ? _default_[k] : k
        })
    } else {
        return _default_
    }
}

/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param {object} opt {
 *  {string} renderMode 单个组件的重复渲染模式。[all|none]：all——任何变更都会导致重复渲染，none——不会发生重复渲染。
 *  {boolean} inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 *  {string} registerName 例如将其设定为myRegister,那么在子元素中使用props.myRegister(element)设定要监控滚入的元素。
 *  {string} removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 *  {string} emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * }
 * @returns {function(*=)}
 */
export const scrollOver = (opt) => {
    const options = setDefault(opt)
    //扩展变量
    const extParams = [].concat(get().extParams), screen = {}
    extParams.push(options.registerName)
    extParams.push(options.removeName)
    extParams.push(options.emitName)
    screen['extParams'] = extParams
    return (Comp) => {
        class ScrollOver extends React.Component {
            constructor(...props) {
                super(...props)
                this.element = false //监控的img元素
                this.registerHandle = this.registerHandle.bind(this)
                this.removeHandle = this.removeHandle.bind(this)
                this.elModifyHandle = this.elModifyHandle.bind(this)
                this.checkEmit = this.checkEmit.bind(this)
                screen[options.registerName] = this.registerHandle
                screen[options.removeName] = this.removeHandle
                this.state = {over: false}
            }

            elModifyHandle() {
                scroll.setListener(this.checkEmit)
            }

            registerHandle(el) {
                this.element = el
                this.handleId = scroll.addElModifyHandle(this.elModifyHandle)
                scroll.addListener(this.checkEmit)
                this.checkEmit();
            }

            removeHandle() {
                if (this.handleId) {
                    scroll.removeElModifyHandle(this.handleId)
                    scroll.removeListener(this.checkEmit)
                }
            }

            checkEmit() {
                scroll.elementInView(this.element) && (() => {
                    options.inOff && this.removeHandle()
                    this.setState({over: true})
                })();
            }

            componentWillUnmount() {
                this.removeHandle()
            }

            shouldComponentUpdate(nextProps, nextState) {
                return 'all' === options.renderMode ? true : ('all' === get().renderMode ? true : this.state !== nextState)
            }

            render() {
                screen[options.emitName] = this.state.over
                const props = Object.assign({}, this.props, screen);
                return <Comp {...props} />
            }
        }

        ScrollOver.displayName = `scrollOver(${getComponentName(Comp)})`;
        return ScrollOver;
    }
};