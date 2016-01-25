import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import {connect} from '#/src';
import {compose} from 'redux-lego';

import blog from './blog';

let createStoreWithMiddleware = applyMiddleware(
  connect,
)(createStore);

export const {actions, reducer} = compose(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducer)
);
