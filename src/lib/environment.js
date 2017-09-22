/**
 * 全局设置入口
 * @param options
 */
'use strict';
export const get = () => {
    initValue()
    return defines
}
/**
 * 运行时动态设置options，Img组件相关的defaultProps参数无法在运行时配置[]
 * @param options
 */
const set = (options) => {
    options && Object.keys(defines).forEach(i=>{
        const option = options[i]
        'undefined' !== typeof option && (defines[i] = option)
    })
}
const initValue = () => {
        !hasInit && (()=>{
            try{
                set(__scrollOverImgOptions)
            }catch(error){}
            hasInit = true
        })()
    },
    defines = {
        renderMode: 'all', //渲染模式。['all'|'none'], all表示父组件任何渲染都会导致img直接渲染，none表示父组件发生任何渲染都不会引起内部渲染，默认为all。设置为node可以明显提升渲染效率
        onOff: true, //全局图片延迟加载开关[true|false]。设置为true时图片滚动进入浏览区域后加载，设置为false时候组件一生成就加载
        flowDelay: 10, //图片处理流水线启动时间,ms。
        flowNUmber: 2,//流水线个数
        empty: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==', //空白图片
        filterName: 'react-scroll-over-img-filter', //过滤样式名称
        filter: 'filter: blur(.5rem);filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);', //加载页面的毛玻璃效果
        extParams : ['onOff', 'loadSrc', 'loadClassName', 'extParams'] // Img组件的扩展组件 ，除此之外还有'register', 'remove', 'over'，名称有scrollOver组件内部决定
    }
let hasInit = false