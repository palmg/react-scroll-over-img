'use strict';

/**
 * 流水线加载工具，实现一次只加载一张图片，阻止并发。
 * ---------------------------------------
 * 工具类只提供一个外部接口：
 * registerFLow(src, callback)
 * src：用于指定要加载图片的地址。
 * callback：图片加载完成的回调。加载完成后回执行callback({suc:[boolean],src:[string]})。出现错误时，会在console输出错误信息。
 * ---------------------------------------
 * 全局配置
 * 可以通过 environment.set(options)方法全局配置流水线延迟启动时间和并行加载个数。
 * import env from 'react-scroll-over-img'
 * env.set({
 *     flowDelay: 10,
 *     flowNumber: 2
 * })
 * flowDelay：延迟启动时间，单位毫秒。设置得越长，启动时间越慢，但是会等待更多的图片一次性加入到队列中。默认10Ms
 * flowNumber：流水线，可以同时加载的图片数。
 */

import {get} from './environment'

const environment = get()

/**
 * 图片流水线，在动态渲染时，所有的图片都会添加到流水线上，然后逐一渲染
 * @type {Array}
 */
const flowList = [];
let isStop = true, //处理标记，表示当前流水线是否处于处理中
    timerId; //时间计时器对象

/**
 * (接口)注册一个加载原图回调，向流水线增加一个处理节点
 * @param {string} src 原始图片路径
 * @param {object} img 对象，可以通过new Image创建
 * @param {function} callback 回调函数 (src)=>{}
 */
const registerFLow = (src, img, callback) => {
        //向流水线队尾部增加对象
        flowList.push({src, img, callback});
        isStop && (() => {
            timerId && clearTimeout(timerId);
            timerId = setTimeout(loadOneStream(), environment.flowDelay);
        })()
    },

    /**
     * 运行流水线
     */
    loadOneStream = () => {
        isStop = false;
        const item = flowList.pop();//处理队列头部对象
        item ? loadImg(item) : isStop = true;
    },

    /**
     * 加载完成处理
     * @param cb
     * @param src
     */
    resultHandle = (cb, src) => {
        cb({suc: 'NONE' !== src, src})
        loadOneStream()
    },

    /**
     * 加载单个图片
     * --------------
     * 使用jest单元测试时，Image对象的onerror、onabort、onload句柄均不会执行。
     * 因此会将environment.isUnitTest设置为true用于进行相关操作。
     * 当该参数存在值时候，会直接返回一个img对象。在src参数中
     * --------------
     * @param item
     */
    loadImg = (item) => {
        const {src, img, callback} = item
        img.src = src
        img.onerror = img.onabort = () =>
            resultHandle(callback, 'NONE')
        if (img.complete) {
            resultHandle(callback, src)
        } else {
            img.onload = () =>
                resultHandle(callback, src)
        }
    };

module.exports = registerFLow
module.exports.default = module.exports