'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollOver = exports.bind = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _environment = require('./environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Scroll() {
    this.scrollEl = false; //要监控的滚动对象
    this.preScrollEl = false; //前元素
    this.scrollData = false; //界面滚动数据
    this.disableHandleCount = 0;
    this.handleList = [];
}

//接口1，设定当前要滚动监控的对象
Scroll.prototype.setElement = function (el) {
    var _this = this;

    var scrollEl = 'object' === (typeof el === 'undefined' ? 'undefined' : _typeof(el)) ? el : document.getElementById(el);
    !scrollEl && function () {
        scrollEl = window.document.body;
    }();
    scrollEl.addEventListener('scroll', function () {
        _this.setScreenScroll();
    });
    this.preScrollEl = this.scrollEl;
    this.scrollEl = scrollEl;
    this.handleList.forEach(function (i) {
        return i.act && i.cb(scrollEl);
    });
};
//获取某个界面元素的位置
Scroll.prototype.getElementTop = function (el) {
    return el.getBoundingClientRect().top + window.document.documentElement.scrollTop + this.scrollEl.scrollTop;
};
Scroll.prototype.setScreenScroll = function () {
    var screenTop = window.pageYOffset ? window.pageYOffset : this.scrollEl.scrollTop,
        screenBottom = screenTop + Number(window.innerHeight ? window.innerHeight : this.scrollEl.clientHeight);
    this.scrollData = {
        top: screenTop,
        bottom: screenBottom
    };
};
Scroll.prototype.addElModifyHandle = function (cb) {
    var id = this.handleList.length;
    this.handleList.push({ act: true, cb: cb });
    return id;
};
Scroll.prototype.removeElModifyHandle = function (id) {
    this.handleList[id].act = false;
    return this;
};

var scroll = new Scroll();
scroll.setElement((0, _environment.get)().scrollDom);
scroll.setScreenScroll();

var getComponentName = function getComponentName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

var bind = exports.bind = function bind(dom) {
    scroll.setElement(dom);
};
/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 * @param registerName 注册处理器的名称，默认为 'register'，调用props.registerScrollIn(Dom)，Dom表示真实Dom
 * @param removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 * @param emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * @returns {function(*=)}
 */
var scrollOver = exports.scrollOver = function scrollOver() {
    var inOff = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var registerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'register';
    var removeName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'remove';
    var emitName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'over';

    //扩展变量
    var extParams = [].concat((0, _environment.get)().extParams),
        screen = {};
    extParams.push(registerName);
    extParams.push(removeName);
    extParams.push(emitName);
    screen['extParams'] = extParams;
    return function (Comp) {
        var ScrollOver = function (_React$Component) {
            _inherits(ScrollOver, _React$Component);

            function ScrollOver() {
                var _ref;

                _classCallCheck(this, ScrollOver);

                for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                    props[_key] = arguments[_key];
                }

                var _this2 = _possibleConstructorReturn(this, (_ref = ScrollOver.__proto__ || Object.getPrototypeOf(ScrollOver)).call.apply(_ref, [this].concat(props)));

                _this2.domTop = false; //当前被包装img的顶点位置
                _this2.registerHandle = _this2.registerHandle.bind(_this2);
                _this2.removeHandle = _this2.removeHandle.bind(_this2);
                _this2.elModifyHandle = _this2.elModifyHandle.bind(_this2);
                _this2.checkEmit = _this2.checkEmit.bind(_this2);
                screen[registerName] = _this2.registerHandle;
                screen[removeName] = _this2.removeHandle;
                _this2.state = { over: false };
                return _this2;
            }

            _createClass(ScrollOver, [{
                key: 'elModifyHandle',
                value: function elModifyHandle() {
                    scroll.preScrollEl.removeEventListener('scroll', this.checkEmit);
                    scroll.scrollEl.addEventListener('scroll', this.checkEmit);
                }
            }, {
                key: 'registerHandle',
                value: function registerHandle(dom) {
                    this.domTop = scroll.getElementTop(dom);
                    this.handleId = scroll.addElModifyHandle(this.elModifyHandle);
                    scroll.scrollEl.addEventListener('scroll', this.checkEmit);
                    this.checkEmit();
                }
            }, {
                key: 'removeHandle',
                value: function removeHandle() {
                    scroll.removeElModifyHandle(this.handleId);
                    scroll.scrollEl.removeEventListener('scroll', this.checkEmit);
                }
            }, {
                key: 'checkEmit',
                value: function checkEmit() {
                    var _this3 = this;

                    this.domTop < scroll.scrollData.bottom && function () {
                        inOff && _this3.removeHandle();
                        _this3.setState({ over: true });
                    }();
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    scroll.removeElModifyHandle(this.handleId);
                    scroll.scrollEl.removeHandle('scroll', this.checkEmit);
                }
            }, {
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return 'all' === (0, _environment.get)().renderMode ? true : this.state !== nextState; //不允许外部props变更导致组件进行融合计算，只允许一次初始化
                }
            }, {
                key: 'render',
                value: function render() {
                    screen[emitName] = this.state.over;
                    var props = Object.assign({}, this.props, screen);
                    return _react2.default.createElement(Comp, props);
                }
            }]);

            return ScrollOver;
        }(_react2.default.Component);

        ScrollOver.displayName = 'scrollOver(' + getComponentName(Comp) + ')';
        return ScrollOver;
    };
};