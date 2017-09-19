/**
 * 全局设置入口
 * @param options
 */
'use strict';

var setting = function setting(options) {
    naming.forEach(function (i) {
        var option = options[i];
        option && (defines[i] = option);
    });
},
    getting = function getting() {
    return options;
},
    naming = ['onOff', 'maskStyle'],
    defines = {
    onOff: true, //全局图片延迟加载开关[true|false]。设置为true时图片滚动进入浏览区域后加载，设置为false时候组件一生成就加载
    maskStyle: {
        filter: 'blur(.5rem)'
    }
};

module.exports = setting;
module.exports.default = module.exports;
module.exports.getting = getting;