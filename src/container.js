import React from 'react';
import {register} from './middleware';
import {getFragment} from './fragmentParser';
import logger from './logger';

let store;
let fetchAndDispatch = function () {};
let isLogger = false;

export function set(opts) {
  if (opts.store)
    store = opts.store;
  if (opts.fetchAndDispatch && typeof opts.fetchAndDispatch === 'function')
    fetchAndDispatch = function (...args) {
      return opts.fetchAndDispatch(...args);
    };
  if (opts.logger)
    isLogger = !!opts.logger;
};

// wrap a smart react component with optional init query
export function Root(opts = {}) {
  return function (reactComponent) {
    let latestChildren;
    function connect(reactComponentInstance) {
      return function (store) {
        reactComponentInstance.setState(reactComponentInstance.getStoreData(store));
      };
    }
    return class GqlRoot extends React.Component {
      static latestChildren() {
        return latestChildren;
      };
      constructor() {
        super();
        this.state = this.getStoreData(store);
      }
      getStoreData(store) {
        const {getState = () => ({})} = opts;
        return getState(store.getState());
      }
      // connect component state with store
      componentWillMount() {
        this.disconnect = register(connect(this));
      }
      // initial query
      componentDidMount() {
        if (!opts.init)
          return;
        parseGqlUnit(opts.init)();
      }
      // disconnect component state with store
      componentWillUnmount() {
        const {disconnect} = this;
        if (disconnect && typeof disconnect === 'function')
          disconnect();
      }
      render() {
        const {mutations, getProps} = opts;
        const props = Object.assign({}, this.props, this.state);
        if (mutations) {
          Object.assign(props, {
            mutations: getMutations(mutations)
          });
        }
        return latestChildren = React.createElement(reactComponent, props);
      }
    };
  };
}

// wrap a dummy react component with fragment definition
export function Fragment(opts = {}) {
  return function (reactComponent) {
    let latestChildren;
    return class GqlFragment extends React.Component {
      static getFragment() {
        return getFragment(opts.fragment);
      };
      static latestChildren() {
        return latestChildren;
      };
      render() {
        const {mutations} = opts;
        const props = {
          ...this.props,
          mutations: getMutations(mutations)
        };
        return latestChildren = React.createElement(reactComponent, props);
      }
    };
  };
}

/**
 * @description transform an object of mutation config to an object of mutation function
 * @param gqlUnits {Object<query: QLString, action: ReduxActionString, variables: Object|Function>}
 * @return mutations {Object<Function>}
 */
function getMutations(gqlUnits = {}) {
  let result = {};
  Object.keys(gqlUnits).forEach(name => {
    result[name] = parseGqlUnit(
      Object.assign(gqlUnits[name], {
        type: 'mutation'
      })
    );
  });
  return result;
}

function parseGqlUnit(opts) {
  const {query, action, type} = opts;
  let {variables} = opts;
  return (inputVariables) => {
    variables = inputVariables || variables || null;
    if (isLogger)
      logger(Object.assign(opts, {variables}));
    return fetchAndDispatch({
      query,
      variables,
      action,
    });
  };
}
