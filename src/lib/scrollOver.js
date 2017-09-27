'use strict';
import React from 'react'
import {get} from './environment'

function Scroll() {
    this.scrollEl = false//要监控的滚动对象
    this.preScrollEl = false//前元素
    this.scrollData = false//界面滚动数据
    this.disableHandleCount = 0
    this.handleList = []
}

//接口1，设定当前要滚动监控的对象
Scroll.prototype.setElement = function (el) {
    let scrollEl = 'object' === typeof el ? el : document.getElementById(el)
    !scrollEl && (() => {
        scrollEl = window.document.body
    })()
    scrollEl.addEventListener('scroll', () => {
        this.setScreenScroll();
    });
    this.preScrollEl = this.scrollEl
    this.scrollEl = scrollEl
    this.handleList.forEach(i=>i.act && i.cb(scrollEl))
}
//获取某个界面元素的位置
Scroll.prototype.getElementTop = function (el) {
    return el.getBoundingClientRect().top + window.document.documentElement.scrollTop + this.scrollEl.scrollTop;
}
Scroll.prototype.setScreenScroll = function () {
    const screenTop = window.pageYOffset ? window.pageYOffset : this.scrollEl.scrollTop,
        screenBottom = screenTop + Number(window.innerHeight ? window.innerHeight : this.scrollEl.clientHeight);
    this.scrollData = {
        top: screenTop,
        bottom: screenBottom
    }
}
Scroll.prototype.addElModifyHandle = function (cb) {
    const id = this.handleList.length
    this.handleList.push({act: true, cb})
    return id
}
Scroll.prototype.removeElModifyHandle = function (id) {
    this.handleList[id].act = false
    return this
}


const scroll = new Scroll()
scroll.setElement(get().scrollDom)
scroll.setScreenScroll()

const getComponentName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const bind = (dom) => {
    scroll.setElement(dom)
}
/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 * @param registerName 注册处理器的名称，默认为 'register'，调用props.registerScrollIn(Dom)，Dom表示真实Dom
 * @param removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 * @param emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * @returns {function(*=)}
 */
export const scrollOver = (inOff = true, registerName = 'register', removeName = 'remove', emitName = 'over') => {
    //扩展变量
    const extParams = [].concat(get().extParams), screen = {}
    extParams.push(registerName)
    extParams.push(removeName)
    extParams.push(emitName)
    screen['extParams'] = extParams
    return (Comp) => {
        class ScrollOver extends React.Component {
            constructor(...props) {
                super(...props)
                this.domTop = false //当前被包装img的顶点位置
                this.registerHandle = this.registerHandle.bind(this)
                this.removeHandle = this.removeHandle.bind(this)
                this.elModifyHandle = this.elModifyHandle.bind(this)
                this.checkEmit = this.checkEmit.bind(this)
                screen[registerName] = this.registerHandle
                screen[removeName] = this.removeHandle
                this.state = {over: false}
            }

            elModifyHandle(){
                scroll.preScrollEl.removeEventListener('scroll', this.checkEmit)
                scroll.scrollEl.addEventListener('scroll', this.checkEmit)
            }

            registerHandle(dom) {
                this.domTop = scroll.getElementTop(dom)
                this.handleId = scroll.addElModifyHandle(this.elModifyHandle)
                scroll.scrollEl.addEventListener('scroll', this.checkEmit)
                this.checkEmit();
            }

            removeHandle() {
                scroll.removeElModifyHandle(this.handleId)
                scroll.scrollEl.removeEventListener('scroll', this.checkEmit)
            }

            checkEmit() {
                this.domTop < scroll.scrollData.bottom && (() => {
                    inOff && this.removeHandle()
                    this.setState({over: true})
                })();
            }

            componentWillUnmount() {
                scroll.removeElModifyHandle(this.handleId)
                scroll.scrollEl.removeHandle('scroll', this.checkEmit)
            }


            shouldComponentUpdate(nextProps, nextState) {
                return 'all' === get().renderMode ? true : this.state !== nextState//不允许外部props变更导致组件进行融合计算，只允许一次初始化
            }

            render() {
                screen[emitName] = this.state.over
                const props = Object.assign({}, this.props, screen);
                return <Comp {...props} />
            }
        }

        ScrollOver.displayName = `scrollOver(${getComponentName(Comp)})`;
        return ScrollOver;
    }
};