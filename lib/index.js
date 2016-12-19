'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('regenerator-runtime/runtime');

var _vdux = require('vdux');

var _vduxUi = require('vdux-ui');

var _vduxContainers = require('vdux-containers');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var relativePositionDecoder = (0, _vdux.decoder)(function (e) {
	return e.offsetX / e.target.getBoundingClientRect().width;
});

var roundToStep = function roundToStep(step) {
	return function (num) {
		return Math.round(num / step) * step;
	};
};

exports.default = (0, _vdux.component)({
	render: function render(_ref) {
		var props = _ref.props,
		    state = _ref.state,
		    actions = _ref.actions;

		var _props$w = props.w,
		    w = _props$w === undefined ? '300px' : _props$w,
		    _props$bgColor = props.bgColor,
		    bgColor = _props$bgColor === undefined ? 'blue' : _props$bgColor,
		    _props$max = props.max,
		    max = _props$max === undefined ? 100 : _props$max,
		    name = props.name,
		    _props$step = props.step,
		    step = _props$step === undefined ? 1 : _props$step,
		    restProps = _objectWithoutProperties(props, ['w', 'bgColor', 'max', 'name', 'step']);

		var _state$value = state.value,
		    value = _state$value === undefined ? 0 : _state$value,
		    active = state.active;


		var percentage = value / max * 100;
		var rounder = roundToStep(step);

		return (0, _vdux.element)(
			_vdux.Window,
			{ onMouseUp: actions.setActive(false) },
			(0, _vdux.element)(
				_vduxUi.Block,
				{ px: '10px' },
				(0, _vdux.element)(
					_vduxUi.Block,
					_extends({
						py: '10px',
						cursor: 'move',
						onMouseDown: relativePositionDecoder(function (x) {
							return actions.toggleActive(rounder(x * max));
						}),
						onMouseMove: active && relativePositionDecoder(function (x) {
							return actions.drag(rounder(x * max));
						}),
						onMouseUp: actions.setActive(false),
						w: w,
						relative: true
					}, restProps),
					(0, _vdux.element)(_vduxUi.Block, { pointerEvents: 'none', wide: true, h: '2px', bgColor: 'darkgray' }),
					(0, _vdux.element)(_vduxUi.Block, { pointerEvents: 'none', zIndex: '1', h: '2px', top: '10px', absolute: true, w: percentage + '%', bgColor: bgColor }),
					(0, _vdux.element)(_vduxUi.Block, {
						pointerEvents: 'none',
						zIndex: '2',
						left: 'calc(' + percentage + '% - 3px)',
						top: '5px',
						absolute: true,
						circle: '12px',
						transform: active ? 'scale(1.5)' : '',
						transition: 'transform .2s ease-in-out',
						bgColor: bgColor }),
					(0, _vdux.element)(_vduxContainers.Input, { h: '0', visibility: 'hidden', name: name, value: value })
				)
			)
		);
	},
	onCreate: function onCreate(_ref2) {
		var props = _ref2.props;

		if (!props.name) {
			throw new Error('Missing `name` prop');
		}
	},

	controller: {
		drag: regeneratorRuntime.mark(function drag(_ref3, x) {
			var props = _ref3.props,
			    actions = _ref3.actions,
			    state = _ref3.state;

			var _props$max2, max;

			return regeneratorRuntime.wrap(function drag$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!state.active) {
								_context.next = 14;
								break;
							}

							_props$max2 = props.max, max = _props$max2 === undefined ? '100' : _props$max2;

							if (!(x > max)) {
								_context.next = 7;
								break;
							}

							_context.next = 5;
							return actions.setValue(max);

						case 5:
							_context.next = 14;
							break;

						case 7:
							if (!(x < 0)) {
								_context.next = 12;
								break;
							}

							_context.next = 10;
							return actions.setValue(0);

						case 10:
							_context.next = 14;
							break;

						case 12:
							_context.next = 14;
							return actions.setValue(x);

						case 14:
						case 'end':
							return _context.stop();
					}
				}
			}, drag, this);
		})
	},
	reducer: {
		setValue: function setValue(state, payload) {
			return _extends({}, state, { value: payload });
		},
		toggleActive: function toggleActive(state, payload) {
			return _extends({}, state, { active: !state.active, value: payload });
		},
		setActive: function setActive(state, payload) {
			return _extends({}, state, { active: payload });
		}
	}
});