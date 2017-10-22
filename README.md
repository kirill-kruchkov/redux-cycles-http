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

Setup `redux-cycles` as usual along with Cycle.js HTTP driver and add `httpCycle` to your cycles:

```
import { createCycleMiddleware } from 'redux-cycles'
import { run } from '@cycle/run'
import { makeHTTPDriver } from '@cycle/http'
import { combineCycles } from 'redux-cycles'
import httpCycle from 'redux-cycles-http'

const cycleMiddleware = createCycleMiddleware()
const { makeActionDriver } = cycleMiddleware
const middlewares = [cycleMiddleware]

export const cycles = combineCycles(
  httpCycle
)

run(cycles, {
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

### Waiting for requests to finish

E.g. if you need it for server side rendering.

*NB!* This requires `redux-thunk` or similar middleware.

```
import { awaitable } from 'redux-cycles-http'

static async getInitialProps({ query, store, isServer }) {
  const { id } = query
  await store.dispatch(awaitable(somedataFetch(id)))
  return { isServer }
}

```

or


```
import { awaitable } from 'redux-cycles-http'

function getInitialActions() {
  const awaitableFetch = awaitable(somedataFetch())
  return store.dispatch(awaitableFetch).then(response => {
    console.log('My data:', response.body)
    return response
  })
}

```


