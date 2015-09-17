'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var identity = function identity(id) {
  return id;
};

/*
 * Trampoline, base middleware that ensure result is resolved.
 * @private
 * @param {generator function} next step
 */
function* trampoline(next) {
  this.result = this.result ? this.result : {};
  yield next;
  this.resolve(this.result);
}

/*
 * Composition
 * @public
 * @param {function} transformer
 * @param {generator function} middlewares
 * @return {function} callback
 */

exports['default'] = function () {
  for (var _len = arguments.length, middlewares = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    middlewares[_key - 1] = arguments[_key];
  }

  var xf = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];

  var fn = _co2['default'].wrap((0, _koaCompose2['default'])([trampoline].concat(middlewares)));
  return function () {
    var task = xf.apply(undefined, arguments);
    return fn.call(task)['catch'](function (e) {
      if (task && typeof task.reject === 'function') {
        task.reject(e);
      }
    });
  };
};

module.exports = exports['default'];
