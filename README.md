# redux-cycles-http

Default HTTP flow cycle to use with [redux-cycles](https://github.com/cyclejs-community/redux-cycles).

## Installation

```
yarn add redux-cycles-http
```

or

```
npm install --save redux-cycles-http
```

## Usage

### Setup

Setup `redux-cycles` as usual along with Cycle.js HTTP driver:

```
import { createCycleMiddleware } from 'redux-cycles'
import { run } from '@cycle/run'
import { makeHTTPDriver } from '@cycle/http'

const cycleMiddleware = createCycleMiddleware()
const { makeActionDriver } = cycleMiddleware
const middlewares = [cycleMiddleware]

run(main, {
  ACTION: makeActionDriver(),
  HTTP: makeHTTPDriver(),
})
```

### Dispatch actions

```
import { httpAction } from 'redux-cycles-http'

export function somedataFetch(id) {
  return httpAction(ACTION_TYPE, {
    url: `${API_ENDPOINT}/path/${encodeURIComponent(id)}`,
    method: 'GET',
  })
}

```

### Match it in reducer

```
import { httpAction } from 'redux-cycles-http'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case success(ACTION_TYPE):
      return {
        ...state,
        response: action.payload,
      }
    default:
      return state
  }
}
```
