import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import createLogger from 'redux-logger';
import Gql from '../react-gql';
import {genActionsAndReducers} from 'redux-lego';

import blog from './blog';

let logger = createLogger();
let createStoreWithMiddleware = applyMiddleware(
  Gql.connect,
  logger
)(createStore);

export const {actions, reducers} = genActionsAndReducers(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducers)
);
