const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

export const success = type => `${type}_${SUCCESS}`

export const error = type => `${type}_${ERROR}`

export default function httpCycle(sources) {
  const request$ = sources.ACTION.filter(isHttpAction).map(action => ({
    ...action.request,
    category: action,
  }))

  const action$ = sources.HTTP.select()
    .flatten() // auto cancels prev of simultaneous reqs to same source
    .map(response => {
      const { type, completed, request, payload } = response.request.category
      if (typeof completed === 'function') {
        setTimeout(completed.bind(null, response), 0)
      }
      return {
        type: success(type),
        payload: {
          data: response.body,
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
  return action.request && typeof action.request === 'object'
}
