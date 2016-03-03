import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import createLogger from 'redux-logger';
import Gql from '../react-gql';
import {build} from 'redux-brick';

import blog from './blog';

let logger = createLogger();
let createStoreWithMiddleware = applyMiddleware(
  Gql.connect,
  logger
)(createStore);

export const {actionCreators, reducers} = build(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducers)
);
