import xs from 'xstream'

const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

export const success = type => `http/${type}_${SUCCESS}`

export const error = type => `http/${type}_${ERROR}`

export default function httpCycle({ ACTION, HTTP }) {
  const request$ = ACTION.filter(isHttpAction).map(action => ({
    ...action.request,
    category: action,
  }))

  const action$ = HTTP.select()
    .map(response$ => response$.replaceError(err => xs.of(err)))
    .flatten()
    .map(response => {
      const { type, completed, request, payload } =
        (response && response.request && response.request.category) || {}
      if (typeof completed === 'function') {
        setTimeout(completed.bind(null, response), 0)
      }
      if (typeof type === 'undefined') {
        return {
          type: `http/${ERROR}`,
          payload: response,
        }
      }
      if (!response.ok) {
        return {
          type: error(type),
          payload: {
            data: response.body,
            headers: response.headers,
            request,
            initial: payload,
          },
        }
      }
      return {
        type: success(type),
        payload: {
          data: response.body,
          headers: response.headers,
          request,
          initial: payload,
        },
      }
    })

  return {
    ACTION: action$,
    HTTP: request$,
  }
}

export const awaitable = action => dispatch =>
  new Promise(resolve =>
    dispatch({
      ...action,
      completed: resolve,
    })
  )

function isHttpAction(action) {
  return Boolean(action.request && typeof action.request === 'object')
}
