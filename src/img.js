'use strict';
import React from 'react'
import {get} from './environment'
import {addFilter} from './lib/style'
import scrollOver from './scrollOver'
import registerFlow from './lib/flow'

const options = get()
/**
 * 图片滚动加载组件，当图片滚动进入浏览器的显示区域时会出发显示
 * @param onOff: 图片延迟加载的开关，默认会使用全局的onOff配置参数
 * @param loadSrc: 图片未滚入显示区域时异步加载图片地址,应该是一个很小切易于快速加载的图片，大小建议小于2KB，默认为一张空图片。
 * @param loadClassName: 图片异步加载时的样式
 * @param src: 图片滚入显示区域时显示的图片地址
 * @param className: 图片默认样式，在加载时会和loadClass叠加
 */
const Img = scrollOver()(class extends React.Component {
    constructor(...props) {
        super(...props)
        const {src, onOff, className} = this.props
        this.state = {
            className: className,
            src: onOff ? res.empty : src
        }
        this.loadedHandle = this.loadedHandle.bind(this)
    }

    componentDidMount() {//初始化加载
        const {onOff, register} = this.props
        onOff && register(this.img)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.over) {
            const {loadClassName, className, loadSrc, src} = this.props
            this.setState({
                className: `${loadClassName} ${className}`,
                src: loadSrc
            })
            registerFlow(src, this.loadedHandle)
        }
    }

    loadedHandle(src) {
        this.setState({
            src,
            className: this.props.className
        })
    }

    render() {
        const params = Object.assign({}, this.props),
            {src, className} = this.state
        if (src) {
            params.src = src
        } else {
            delete params.src
        }
        params.className = className
        return (
            <img ref={ref => {
                this.img = ref
            }} {...params}/>
        )
    }
})

Img.defaultProps = {
    loadSrc: options.empty,
    onOff: options.onOff,
    loadClassName: addFilter()
}

module.exports = Img
module.exports.default = Img