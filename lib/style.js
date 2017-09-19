'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addFilter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _environment = require('../environment');

var options = (0, _environment.get)();

/**
 * 添加自定义的样式
 * @returns {*}
 */
var addFilter = exports.addFilter = function addFilter() {
    if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) !== 'object' && global.global !== global) {
        var document = window.document,
            el = document.createElement('style');
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