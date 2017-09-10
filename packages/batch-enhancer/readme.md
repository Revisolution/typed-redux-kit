# Batch Enhancer - Typed Redux Kit

Let's dispatch an array of actions!

## Install

```sh
npm i typed-redux-kit.batch-enhancer

# Or install typed-redux-kit
npm i typed-redux-kit
```

## Example

```ts
import { createStore, Action, StoreCreator, Store, StoreEnhancer, compose, applyMiddleware } from 'redux'
import * as Redux from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { fork, take, put } from 'redux-saga/effects'
import batchEnhancer from 'typed-redux-kit.batch-enhancer'

const sagaMiddleware = createSagaMiddleware()
const middlewareEnhancer = applyMiddleware(sampleMiddleware)
// Compose enhancer. You probably need this if you're using other middlewares like Redux Logger.
const enhancer = compose<Redux.StoreEnhancerStoreCreator<State>>(
  middlewareEnhancer,
  // If you're using saga, you must provide it to `batchEnhancer` rather than `applyMiddleware`
  batchEnhancer(sagaMiddleware),
  // Otherwise, just call it without an argument
  // batchEnhancer(),
)
// Apply enhancer when
const store = createStore(myReducer, enhancer)

// Now you can dispatch an array of actions
store.dispatch([
  {
    type: 'SayHello',
  },
  {
    type: 'SayHello',
  },
  {
    type: 'SayHello',
  },
])

// You can do it inside of saga generator too
function * saga () {
  while (true) {
    yield take('SayHello')
    yield put([
      {
        type: 'SayBye',
      },
      {
        type: 'SayBye',
      },
      {
        type: 'SayBye',
      },
    ])
  }
}
```

## Why?

With every dispatch, all components connected with Redux(`connect`) are re-rendered.

For reusability, you want to have lots of atomic actions which does one thing well and reliably. This forces you to dispatch a series of actions.

Here comes the problem. Since each dispatch causes a render, when your app grows bigger, it triggers a bunch of unnecessary renders.

With Batch Enhancer, you can delay the rendering. If you dispatch an array of actions, BatchEnhancer passes the all actions to the reducer and renders on the final one.

So, if you dispatch like the example below:

```ts
store.dispatch([
  {
    type: 'SayHello',
  },
  {
    type: 'SayHello',
  },
  {
    type: 'SayHello',
  },
])
```

Your state will be reduced 3 times but connected components will be re-rendered only one time.

## APIs

Batch Enhancer has only one API, itself.

### `batchEnhancer(sagaMiddleware?: SagaMiddleware): Redux.GenericStoreEnhancer`

Create batch enhancer with Saga middleware.

## Authors

- [Stuart Schechter](https://github.com/UppaJung)
- [Junyoung Choi](https://github.com/rokt33r) : Maintainer
- [Joseph Stein](https://github.com/josephstein)

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
