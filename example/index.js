import React from 'react'
import {render} from 'react-dom'
import Img from '../index'

render(<div>
    <Img
        loadSrc="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_1Q"
        src="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_80Q"/>
    <div style={{width: '200px', height: '500px', backgroundColor: 'red'}}>占位置</div>
    <Img
        src="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_80Q"/>
    <div style={{width: '200px', height: '500px', backgroundColor: 'red'}}>占位置</div>
    <Img
        loadSrc="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_1Q"
        src="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_80Q"/>
</div>, document.getElementById('root'))