'use strict';
import React from 'react'
import {get} from './lib/environment'

//---处理区域滚动
let scrollData = null;
const setScreenScroll = ()=> {
        const screenTop = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
            screenBottom = screenTop + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight);
        scrollData = {
            top: screenTop,
            bottom: screenBottom
        }
    },

    /**
     * 获取当前对象的全局位置高度
     * @param ref
     * @return {number}
     */
    getDomTop = (ref) => {
        return ref.getBoundingClientRect().top + window.document.documentElement.scrollTop + window.document.body.scrollTop;
    };
setScreenScroll();
window.addEventListener('scroll', ()=> {
    setScreenScroll();
});
//-----


/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 * @param registerName 注册处理器的名称，默认为 'register'，调用props.registerScrollIn(Dom)，Dom表示真实Dom
 * @param removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 * @param emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * @returns {function(*=)}
 */
const scrollOver = (inOff = true, registerName = 'register', removeName = 'remove', emitName = 'over') => {
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
                this.registerHandle = this.registerHandle.bind(this)
                this.removeHandle = this.removeHandle.bind(this)
                this.scrollHandle = this.scrollHandle.bind(this)
                screen[registerName] = this.registerHandle
                screen[removeName] = this.removeHandle
                this.state = {over: false}
            }

            registerHandle(dom) {
                this.domTop = getDomTop(dom)
                window.addEventListener('scroll', this.scrollHandle)
                this.checkEmit();
            }

            removeHandle() {
                window.removeEventListener('scroll', this.scrollHandle)
            }

            componentWillUnmount() {
                window.removeEventListener('scroll', this.scrollHandle)
            }

            scrollHandle() {
                this.checkEmit()
            }

            checkEmit() {
                this.domTop < scrollData.bottom && (() => {
                    inOff && this.removeHandle()
                    this.setState({over: true})
                })();
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

const getComponentName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = scrollOver
module.exports.default = module.exports