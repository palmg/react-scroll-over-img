'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _environment = require('./lib/environment');

var _style = require('./lib/style');

var _scrollOver = require('./scrollOver');

var _scrollOver2 = _interopRequireDefault(_scrollOver);

var _flow = require('./lib/flow');

var _flow2 = _interopRequireDefault(_flow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var options = (0, _environment.get)(),
    extAttribute = ['loadSrc', 'onOff', 'loadClassName', 'register', 'remove', 'over'],
    removeAttribute = function removeAttribute(params) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = extAttribute[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            delete params[name];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};
/**
 * 图片滚动加载组件，当图片滚动进入浏览器的显示区域时会出发显示
 * @param onOff: 图片延迟加载的开关，默认会使用全局的onOff配置参数
 * @param loadSrc: 图片未滚入显示区域时异步加载图片地址,应该是一个很小切易于快速加载的图片，大小建议小于2KB，默认为一张空图片。
 * @param loadClassName: 图片异步加载时的样式
 * @param src: 图片滚入显示区域时显示的图片地址
 * @param className: 图片默认样式，在加载时会和loadClass叠加
 */
var Img = (0, _scrollOver2.default)()(function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        var _ref;

        _classCallCheck(this, _class);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(props)));

        var _this$props = _this.props,
            src = _this$props.src,
            onOff = _this$props.onOff,
            className = _this$props.className;

        _this.state = {
            className: className,
            src: onOff ? options.empty : src
        };
        _this.loadedHandle = _this.loadedHandle.bind(_this);
        return _this;
    }

    _createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            //初始化加载
            var _props = this.props,
                onOff = _props.onOff,
                register = _props.register;

            onOff && register(this.img); //需要获取到真实的dom，用于确定其是否滚入可视区域
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.over) {
                var _props2 = this.props,
                    loadClassName = _props2.loadClassName,
                    className = _props2.className,
                    loadSrc = _props2.loadSrc,
                    src = _props2.src;

                this.setState({
                    className: loadClassName + ' ' + (className ? className : ''),
                    src: loadSrc
                });
                (0, _flow2.default)(src, new Image(), this.loadedHandle);
            }
        }
    }, {
        key: 'loadedHandle',
        value: function loadedHandle(result) {
            result && result.suc && this.setState({
                src: result.src,
                className: this.props.className
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var params = Object.assign({}, this.props),
                _state = this.state,
                src = _state.src,
                className = _state.className;

            if (src) {
                params.src = src;
            } else {
                delete params.src;
            }
            params.className = className;
            removeAttribute(params);
            return _react2.default.createElement('img', _extends({ ref: function ref(_ref2) {
                    _this2.img = _ref2;
                } }, params));
        }
    }]);

    return _class;
}(_react2.default.Component));

Img.defaultProps = {
    loadSrc: options.empty,
    onOff: options.onOff,
    loadClassName: (0, _style.addFilter)()
};

module.exports = Img;
module.exports.default = Img;