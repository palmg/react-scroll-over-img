import {get} from '../environment'

const options = get()

/**
 * 添加自定义的样式
 * @returns {*}
 */
export const addFilter = () => {
    if (typeof global !== 'object' && global.global !== global) {
        const document = window.document,
            el = document.createElement('style')
        el.setAttribute('type', 'text/css')
        el.append(`.${options.filterName}{${options.filter}}`)
        document.head.appendChild(el)
        return options.filterName
    } else {
        return false
    }
}

export default {
    addFilter
}