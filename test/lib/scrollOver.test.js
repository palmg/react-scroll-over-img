import React from 'react'
import {scrollOver} from '../../lib/scrollOver'
import testRender from 'react-test-renderer'

test('scrollOver component', ()=>{
    const Wrapper = props =>
        <div>测试数据</div>
    const Comp = scrollOver()(Wrapper)
    const result = testRender.create(<Comp />)
    let tree = result.toJSON()
    expect(tree).toMatchSnapshot();
})