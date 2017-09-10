# Batch Enhancer - Typed Redux Kit

Let's dispatch array of actions!

## Example

```ts
const sagaMiddleware = createSagaMiddleware()
const middlewareEnhancer = applyMiddleware(sampleMiddleware)
// Compose enhancer. You probably need this if you're using other middlewares like Redux Logger.
const enhancer = compose<Redux.StoreEnhancerStoreCreator<State>>(
  middlewareEnhancer,
  // If you're using saga, you must provide it to `batchEnhancer` rather than `applyMiddleware`
  batchEnhancer(sagaMiddleware),
  // Otherwise, just call it without argument
  // batchEnhancer(),
)
// Apply enhancer when
const store = createStore(myReducer, enhancer)

// Now you can dispatch array of actions
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

// Also you can do it inside of saga generator too
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

Each dispatch, all components connected with Redux(`connect`) are re-rendered.

For reusability, you want to have lots of atomic actions which does one thing well and reliably. Then, this make you have to dispatch series of actions.

Here comes the problem. Since each dispatch causes re-rendering, if you're app grows bigger, this problem becomes a disaster.

With Batch Enhancer, you can control the timing of re-render. If you dispatch an array of actions, BatchEnhancer passes the all actions to reducer and resolves the final result.

So, if you dispatch like the below example:

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

Your state will be reduced 3 times. But, connected components will be re-rendered only one time.

## APIs

Batch Enhancer has only one API, itself.

### `batchEnhancer(sagaMiddleware?: SagaMiddleware): Redux.GenericStoreEnhancer`

Create batch enhancer with Saga middleware.

## Author & Maintainer

- [Stuart Schechter](https://github.com/UppaJung) : Author
- [Junyoung Choi](https://github.com/rokt33r) : Author & Maintainer

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
