import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import {connect} from '#/src';
import {genActionsAndReducers} from 'redux-lego';

import blog from './blog';

let createStoreWithMiddleware = applyMiddleware(
  connect,
)(createStore);

export const {actions, reducers} = genActionsAndReducers(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducers)
);
