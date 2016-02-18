# connect
`Gql.connect` is a redux middleware responsible for updating state when store changes. Compared with the implementation of `react-redux`, it is more convenient to add a middleware when creating a store.

When a `GqlRootContainer` `componentDidMount`, a connection function will be registered in the middleware. Every time store changes, all registered connection functions will be executed one by one. When `componentWillUnmount`, the connection function will be canceled.

```js
import React from 'react';
import {connect} from 'react-gql';
import {
  createStore,
  applyMiddleware,
} from 'redux';

let createStoreWithMiddleware = applyMiddleware(
  connect
)(createStore);

export const store = createStoreWithMiddleware(
  reducer
);
```
