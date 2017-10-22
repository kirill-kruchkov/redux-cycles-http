'use strict'

exports.__esModule = true

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
var SUCCESS = 'SUCCESS'
var ERROR = 'ERROR'

var success = (exports.success = function success(type) {
  return type + '_' + SUCCESS
})

var error = (exports.error = function error(type) {
  return type + '_' + ERROR
})

function httpCycle(sources) {
  var request$ = sources.ACTION.filter(isHttpAction).map(function(action) {
    return Object.assign({}, action.request, {
      category: action,
    })
  })

  var action$ = sources.HTTP
    .select()
    .flatten() // auto cancels prev of simultaneous reqs to same source
    .map(function(response) {
      var _response$request$cat = response.request.category,
        type = _response$request$cat.type,
        completed = _response$request$cat.completed,
        request = _response$request$cat.request,
        payload = _response$request$cat.payload

      if (typeof completed === 'function') {
        setTimeout(completed.bind(null, response), 0)
      }
      return {
        type: success(type),
        payload: {
          data: response.body,
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
  return action.request && _typeof(action.request) === 'object'
}
