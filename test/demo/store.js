import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
// import thunk from 'redux-thunk';
import {connect} from '../../src/middleware';
import {compose} from 'redux-lego';

import blog from './blog';

let createStoreWithMiddleware = applyMiddleware(
  connect,
  // thunk,
)(createStore);

export const {actions, reducer} = compose(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducer)
);
