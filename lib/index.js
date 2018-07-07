'use strict'

exports.__esModule = true
exports.awaitable = exports.error = exports.success = undefined

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

exports.default = httpCycle

var _xstream = require('xstream')

var _xstream2 = _interopRequireDefault(_xstream)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var SUCCESS = 'SUCCESS'
var ERROR = 'ERROR'

var success = (exports.success = function success(type) {
  return 'http/' + type + '_' + SUCCESS
})

var error = (exports.error = function error(type) {
  return 'http/' + type + '_' + ERROR
})

function httpCycle(_ref) {
  var ACTION = _ref.ACTION,
    HTTP = _ref.HTTP

  var request$ = ACTION.filter(isHttpAction).map(function(action) {
    return Object.assign({}, action.request, {
      category: action,
    })
  })

  var action$ = HTTP.select()
    .map(function(response$) {
      return response$.replaceError(function(err) {
        return _xstream2.default.of(err)
      })
    })
    .flatten()
    .map(function(result) {
      var response = result.response || result

      var _ref2 =
          (response && response.request && response.request.category) || {},
        type = _ref2.type,
        completed = _ref2.completed,
        request = _ref2.request,
        payload = _ref2.payload

      if (typeof completed === 'function') {
        setTimeout(completed.bind(null, response), 0)
      }
      if (typeof type === 'undefined') {
        return {
          type: 'http/' + ERROR,
          payload: response,
        }
      }
      if (!response.ok) {
        return {
          type: error(type),
          payload: {
            data: response.body,
            headers: response.headers,
            request: request,
            initial: payload,
          },
        }
      }
      return {
        type: success(type),
        payload: {
          data: response.body,
          headers: response.headers,
          request: request,
          initial: payload,
        },
      }
    })

  return {
    ACTION: action$,
    HTTP: request$,
  }
}

var awaitable = (exports.awaitable = function awaitable(action) {
  return function(dispatch) {
    return new Promise(function(resolve) {
      return dispatch(
        Object.assign({}, action, {
          completed: resolve,
        })
      )
    })
  }
})

function isHttpAction(action) {
  return Boolean(action.request && _typeof(action.request) === 'object')
}
