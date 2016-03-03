import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import {connect} from '#/src';
import {build} from 'redux-brick';

import blog from './blog';

let createStoreWithMiddleware = applyMiddleware(
  connect,
)(createStore);

export const {actionCreators, reducers} = build(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducers)
);
