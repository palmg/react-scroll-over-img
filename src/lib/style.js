import {get} from './environment'

const options = get()

/**
 * 添加自定义的样式
 * @returns {*}
 */
export const addFilter = () => {
    const document = window && window.document,
        el = document && document.createElement('style')
    if (el && el.append) {
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