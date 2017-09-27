import React from 'react'
import Img from '../../lib/img'
import testRender from 'react-test-renderer'

test('img component', ()=>{//仅测试直接渲染
    const comp = testRender.create(<Img onOff={false} src="src" loadSrc="loadSrc" className="className"/>)
    expect(comp).toMatchSnapshot();
})