import React from 'react';
import {register} from './middleware';
import {getFragment} from './fragmentParser';

let store;
let fetchAndDispatch = function () {};

export function set(opts) {
  if (opts.store)
    store = opts.store;
  if (opts.fetchAndDispatch && typeof opts.fetchAndDispatch === 'function')
    fetchAndDispatch = function (...args) {
      return opts.fetchAndDispatch(...args);
    };
};

// wrap a smart react component with optional init query
export function Branch(reactComponent, opts) {
  let latestChildren;
  function connect(reactComponentInstance) {
    return function (store) {
      reactComponentInstance.setState(reactComponentInstance.getStoreData(store));
    };
  }
  return class GqlBranchContainer extends React.Component {
    static latestChildren() {
      return latestChildren;
    };
    constructor() {
      super();
      this.state = this.getStoreData(store);
    }
    getStoreData(store) {
      const {getState} = opts;
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
      const {mutations} = opts;
      if (mutations) {
        Object.assign(this.state, {
          mutations: getMutations(mutations)
        });
      }
      return latestChildren = React.createElement(reactComponent, this.state);
    }
  };
};

// wrap a dummy react component with fragment definition
export function Fragment(reactComponent, opts) {
  let latestChildren;
  return class GqlFragmentContainer extends React.Component {
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

/**
 * @description transform an object of mutation config to an object of mutation function
 * @param gqlUnits {Object<query: QLString, action: ReduxActionString, variables: Object|Function>}
 * @return mutations {Object<Function>}
 */
function getMutations(gqlUnits) {
  let result = {};
  Object.keys(gqlUnits).forEach(name => {
    result[name] = parseGqlUnit(gqlUnits[name]);
  });
  return result;
}

function parseGqlUnit({query, variables, action}) {
  return (inputVariables) => {
    return fetchAndDispatch({
      query,
      variables: inputVariables || variables || null,
      action,
    });
  };
}
