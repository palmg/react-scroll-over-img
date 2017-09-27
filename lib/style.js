'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addFilter = undefined;

var _environment = require('./environment');

var options = (0, _environment.get)();

/**
 * 添加自定义的样式
 * @returns {*}
 */
var addFilter = exports.addFilter = function addFilter() {
    var document = 'undefined' !== typeof window && window.document,
        el = document && document.createElement('style');
    if (el && el.append) {
        el.setAttribute('type', 'text/css');
        el.append('.' + options.filterName + '{' + options.filter + '}');
        document.head.appendChild(el);
        return options.filterName;
    } else {
        return false;
    }
};

exports.default = {
    addFilter: addFilter
};