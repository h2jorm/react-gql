import React from 'react';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import Gql from '../react-gql';
import {genActionsAndReducers} from 'redux-lego';

import blog from './blog';

let createStoreWithMiddleware = applyMiddleware(
  Gql.connect
)(createStore);

export const {actions, reducers} = genActionsAndReducers(
  blog
);

export const store = createStoreWithMiddleware(
  combineReducers(reducers)
);
