# react-scroll-over-img

处理滚动加载的Img组件。

## 安装

`npm install react-scroll-over-img`
### sass-node安装异常
 当nodejs版本较低时，安装node-sass会出现异常，请使用cnpm执行：
 ```bash
 $ npm rm node-sass
 $ cnpm install node-sass
 ```
详情请查看：https://github.com/sass/node-sass/issues/468
## 使用说明
在文档布局中处理图片的异步加载，提供当图片滚入可视区域时才加载的图片的效果。
`<Img>`组件使用方法和普通的**HTML**`<img>`标签一模一样，支持所有`<img>`属性。
使用方法：
```JavaScript
import React from 'react'
import {render} from 'react-dom'
import Img from 'react-scroll-over-img'

render(<Img src="http[s]://domain[:port]/path"/>
    ,document.getElementById('root'))
```
可以运行源码中的example了解如何使用：`npm run example`
***`<Img>`参数说明***：
除了`<img>`源生属性,还提供一下参数接口。

接口 | 类型 | 说明
---- | ---- | ----
onOff | boolean | 延迟加载的开关。默认为true。设定为fasle后会关闭延迟加载的功能。可以通过环境参数全局设置。
loadSrc | string | 当图片进入浏览器可视区域时，会有一个预加载效果。这里可以指定预加载时要显示的图片。建议图片不超过2KB或已经缓存。原始图片加载完成后会被移除。
loadClassName | string | 图片异步加载时显示的样式。加载完成后会被移除。默认是毛玻璃效果样式。
***滚动元素设定***
默认情况下，`Img`组件会根据`window.document.body`元素的滚动事件来判断某个元素是否进入可视窗口。但是并不是所有的页面使用body滚动。组件提供一个`bind`方法用于绑定滚动元素。如果滚动元素发生变更，可以重复调用bind方法设定。
```JavaScript
import React from 'react'
import {render} from 'react-dom'
import Img from 'react-scroll-over-img'
import bind from 'react-scroll-over-img/bind'
class App extends React.Component {
    constructor(...props) {
        super(...props)
    }

    componentDidMount(){
        bind(this.el)
    }

    render(){
        return(
            <div style={{overflowY: 'scroll', height: '100%'}} ref={el=>{this.el = el}}>
                <Img src="img-URL"/>
            </div>
        )
    }
}
render(<App />, document.getElementById('root'))
```
> 如果滚动元素不是通过React装载的，默认`HTML`文本中已经包含，可以通过**全局环境变量**来设置

***全局环境设置***
可以使用webpack的`DefinePlugin`插件设定全局参数：
```JavaScript
{
    plugins: [
        new webpack.DefinePlugin({
            __scrollOverImgOptions: '{"onOff": true, "scrollDom": "box-1"}'
        })
    ]
}
```
参数说明：

参数 | 类型 | 说明
---- | ---- | ----
renderMode | string | 渲染模式。可选值：`all`、`none`,默认值为`all`。`all`表示父组件任何渲染都会导致`<Img>`组件直接渲染，`none`表示父组件发生任何渲染都不会引起内部渲染。如果图片只渲染一次到页面上，建议设定为`none`。
onOff | boolean | 全局图片延迟加载开关。设置为`true`时图片滚动进入浏览区域后加载，设置为`false`时候组件装载到DOM就加载。
flowDelay | number | 加载启动延迟。当多个图片需要加载时，我们使用流水线的方式保证图片逐一加载，而不是全部阻塞在一起。这个值用用于设定流水线启动的延迟。默认10MS。
empty | string | 默认加载图片，当没有为`<Img>`组件设定loadSrc时，会使用这个参数指定的图片，默认为一个1像素的空白gif。
filter | string | 图片加载时的效果，默认为毛玻璃。当没有为`<Img>`组件设定loadClassName时生效。
scrollDom | string/object | 设定滚动元素。默认情况下，组件会根据`window.document.body`的滚动事件来判断图片是否移入可视区域。可以通过这个参数指定。当设定为字符串时，组件会通过元素ID查找。
scrollOffset | number | 图片滚动加载的偏移量，单位px。负数表示向上偏移，此时向下滚动图片会被更早加载。整数表示向下偏移，会被更晚加载。默认为-25。

***判断元素滚动的高阶组件`scroll`***
除了图片之外，其实所有的元素都可以用于判断是否被滚入可视区域。
```JavaScript
import React from 'react'
import ReactDOM from 'react-dom'
import {scroll} from './scroll'
const MyComponent = scroll(/*options*/)(class extends React.Component {
    constructor(...props) {
        super(...props)
    }
    componentDidMount() {
        //向高阶组件注册真实document元素
        this.props.register(ReactDOM.findDOMNode(this.refs.element))
    }

    render(){
        //当元素进入浏览器可视区域时，高阶组件会将props.over属性修改为 true
        const {over} = this.props
        return(<div ref='element'>Element is {over?'over':'leave'} client view</div>)
    }
})
```
options模式情况下可以不必设置。设置后会导致某些默认行为变更。
参数说明：

参数 | 类型 | 说明
---- | ---- | ----
inOff | boolean | 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
registerName | string | 注册处理器的名称，默认为 `'register'`。例如将其设定为myRegister,那么在子元素中使用props.myRegister(element)设定要监控滚入的元素。
removeName | string | 移除处理器名称，默认为'remove'，调用方式props.remove()。
emitName | string | 元素所处范围的属性名称，默认为'over'。通过props.over获取，当元素滚入屏幕时，会被设置为ture,未滚入时为false。


