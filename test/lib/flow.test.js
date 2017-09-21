import flowList from '../../lib/flow'
import {set} from '../../src/lib/environment'

const Defined_Src = 'define src path'
test('flow process error', done => {
    const img = new Image()
    flowList(Defined_Src, img, (result) => {
        expect(result).toEqual({suc: false, src: 'NONE'})
        done()
    })
    const timer = setTimeout(()=>{
        img.onerror()
        clearTimeout(timer)
    },500)
})

test('flow process abort', done => {
    const img = new Image()
    flowList(Defined_Src, img, (result) => {
        expect(result).toEqual({suc: false, src: 'NONE'})
        done()
    })
    const timer = setTimeout(()=>{
        img.onabort()
        clearTimeout(timer)
    },500)
})

test('flow process success', done => {
    const img = new Image()
    flowList(Defined_Src, img, (result) => {
        expect(result).toEqual({suc: true, src: Defined_Src})
        done()
    })
    const timer = setTimeout(()=>{
        img.onload()
        clearTimeout(timer)
    },500)
})