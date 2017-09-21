'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _environment = require('./lib/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//---处理区域滚动
var scrollData = null;
var setScreenScroll = function setScreenScroll() {
    var screenTop = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
        screenBottom = screenTop + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight);
    scrollData = {
        top: screenTop,
        bottom: screenBottom
    };
},


/**
 * 获取当前对象的全局位置高度
 * @param ref
 * @return {number}
 */
getDomTop = function getDomTop(ref) {
    return ref.getBoundingClientRect().top + window.document.documentElement.scrollTop + window.document.body.scrollTop;
};
setScreenScroll();
window.addEventListener('scroll', function () {
    setScreenScroll();
});
//-----


/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 * @param registerName 注册处理器的名称，默认为 'register'，调用props.registerScrollIn(Dom)，Dom表示真实Dom
 * @param removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 * @param emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * @returns {function(*=)}
 */
var scrollOver = function scrollOver() {
    var inOff = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var registerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'register';
    var removeName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'remove';
    var emitName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'over';

    return function (Comp) {
        var ScrollOver = function (_React$Component) {
            _inherits(ScrollOver, _React$Component);

            function ScrollOver() {
                var _ref;

                _classCallCheck(this, ScrollOver);

                for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                    props[_key] = arguments[_key];
                }

                var _this = _possibleConstructorReturn(this, (_ref = ScrollOver.__proto__ || Object.getPrototypeOf(ScrollOver)).call.apply(_ref, [this].concat(props)));

                _this.registerHandle = _this.registerHandle.bind(_this);
                _this.removeHandle = _this.removeHandle.bind(_this);
                _this.scrollHandle = _this.scrollHandle.bind(_this);
                _this.state = { over: false };
                return _this;
            }

            _createClass(ScrollOver, [{
                key: 'registerHandle',
                value: function registerHandle(dom) {
                    this.domTop = getDomTop(dom);
                    window.addEventListener('scroll', this.scrollHandle);
                    this.checkEmit();
                }
            }, {
                key: 'removeHandle',
                value: function removeHandle() {
                    window.removeEventListener('scroll', this.scrollHandle);
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    window.removeEventListener('scroll', this.scrollHandle);
                }
            }, {
                key: 'scrollHandle',
                value: function scrollHandle() {
                    this.checkEmit();
                }
            }, {
                key: 'checkEmit',
                value: function checkEmit() {
                    var _this2 = this;

                    this.domTop < scrollData.bottom && function () {
                        inOff && _this2.removeHandle();
                        _this2.setState({ over: true });
                    }();
                }
            }, {
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return 'all' === (0, _environment.get)().renderMode ? true : this.state !== nextState; //不允许外部props变更导致组件进行融合计算，只允许一次初始化
                }
            }, {
                key: 'render',
                value: function render() {
                    var screen = {};
                    screen[registerName] = this.registerHandle;
                    screen[removeName] = this.removeHandle;
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

var getComponentName = function getComponentName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

module.exports = scrollOver;
module.exports.default = module.exports;