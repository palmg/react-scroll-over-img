/**
 * 全局设置入口
 * @param options
 */
'use strict';
/**
 * 设置环境参数。
 * @param {object} options　{
 *    renderMode:渲染模式。['all'|'none'], all表示父组件任何渲染都会导致img直接渲染，none表示父组件发生任何渲染都不会引起内部渲染，默认为all。设置为node可以明显提升渲染效率
 *    onOff: 设置全局图片滚动加载开关，如果设置为false则Img组件一装载就会加载
 * }
 */
const set = options => {
    Object.keys(defines).forEach(i => {
        const option = options[i]
        'undefined' !== typeof option && (defines[i] = option)
    })
}
export const get = () => defines
const defines = {
    renderMode: 'all', //渲染模式。['all'|'none'], all表示父组件任何渲染都会导致img直接渲染，none表示父组件发生任何渲染都不会引起内部渲染，默认为all。设置为node可以明显提升渲染效率
    isUnitTest: false, //标记当前是否在执行单元测试。
    onOff: true, //全局图片延迟加载开关[true|false]。设置为true时图片滚动进入浏览区域后加载，设置为false时候组件一生成就加载
    flowDelay: 10, //图片处理流水线启动时间,ms。
    flowNUmber: 2,//流水线个数
    empty:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==', //空白图片
    filterName:'react-scroll-over-img-filter', //过滤样式名称
    filter:'filter: blur(.5rem);filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);' //加载页面的毛玻璃效果
}
module.exports = {set, get}
module.exports.default = module.exports