# Typed Redux Kit

Toolkit for Redux with Typescript

## What the heck is this?

In this package, you can find several neat tricks.

- [Base](./packages/base) : Basic usage of redux
- [Mapped Reducer](./packages/mapped-reducer) : Reducer with ES6Map for efficient switching and scalability.
- [Batch Enhancer](./packages/batch-enhancer) : Allows dispatch array of actions. Also it support redux-saga.
- [Trackable](./packages/trackable) : Allows mutable change to deal with deep state.

[basic-usage.spec.ts](./packages/typed-redux-kit/src/specs/basic-usage.spec.ts) presents how to combine all of toolkit.

## Install

```sh
npm i typed-redux-kit
```

## Authors

- [Stuart Schechter](https://github.com/UppaJung)
- [Junyoung Choi](https://github.com/rokt33r) : Maintainer
- [Joseph Stein](https://github.com/josephstein)

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
