import flowList from '../../lib/flow'
import env from '../../environment'

const Defined_Src = 'define src path'
test('flow process error', done => {
    env.set({isUnitTest: true})
    flowList(Defined_Src, (result) => {
        const src = result.src
        'string' === typeof src ? (() => {
            expect(result).toEqual({suc: false, src: 'NONE'})
            done()
        })() : (() => { //由于在jest中，Image对于的各种句柄不会直接执行，需要添加一个标识让其异步执行
            src.onerror()
        })()
    })
})

test('flow process abort', done => {
    env.set({isUnitTest: true})
    flowList(Defined_Src, (result) => {
        const src = result.src
        'string' === typeof src ? (() => {
            expect(result).toEqual({suc: false, src: 'NONE'})
            done()
        })() : (() => {
            src.onabort()
        })()
    })
})

test('flow process success', done => {
    env.set({isUnitTest: true})
    flowList(Defined_Src, (result) => {
        const src = result.src
        'string' === typeof src ? (() => {
            expect(result).toEqual({suc: true, src: Defined_Src})
            done()
        })() : (() => {
            src.onload()
        })()
    })
})