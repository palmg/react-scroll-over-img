import {get} from '../../lib/environment'

test('environment default values', () => {
    //测试默认值，如果有调整需要在这里修改
    expect(get()).toEqual({
        renderMode: 'all',
        onOff: true,
        flowDelay: 10,
        flowNUmber: 2,
        empty: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
        filterName:'react-scroll-over-img-filter', //过滤样式名称
        filter:'filter: blur(.5rem);filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);',
        extParams : ['onOff', 'loadSrc', 'loadClassName', 'extParams']
    })
})

/*
test('setting & getting environment options', () => {
    //测试设置之后的值
    env.set({onOff: false, empty: ''})
    expect(env.get()).toEqual({
        renderMode: 'all',
        isUnitTest: false,
        onOff: false,
        flowDelay: 10,
        flowNUmber: 2,
        empty: '',
        filterName:'react-scroll-over-img-filter', //过滤样式名称
        filter:'filter: blur(.5rem);filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);'
    })
})*/
