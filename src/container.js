import React from 'react';
import {parse} from 'graphql/language';
import {register} from './middleware';

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
export function branch(reactComponent, opts) {
  let Children;
  function connect(reactComponentInstance) {
    return function (store) {
      reactComponentInstance.setState(reactComponentInstance.getStoreData(store));
    };
  }
  return class DataHubBranchContainer extends React.Component {
    static getChildren() {
      return Children;
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
      return Children = React.createElement(reactComponent, this.state);
    }
  };
};

// wrap a dummy react component with fragment definition
export function fragment(reactComponent, opts) {
  let Children;
  return class DataHubFragmentContainer extends React.Component {
    static getFragment() {
      return unpackFragment(opts.fragment);
    };
    static getChildren() {
      return Children;
    };
    render() {
      const {mutations} = opts;
      const props = {
        ...this.props,
        mutations: getMutations(mutations)
      };
      return Children = React.createElement(reactComponent, props);
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

/**
 * @description parse a graphql fragment
 * @param fragment {String}
 * @return fragmentContent {String}
 * @example
 * ```js
 * const fragment = `
 *   fragment post on Post {
 *     id, content, likes
 *   }
 * `;
 * expect(unpackFragment(fragment)).toBe('id, content, likes');// true
 * ```
 */
function unpackFragment(fragment) {
  const documentAST = parse(fragment);
  let result = [];
  documentAST.definitions[0].selectionSet.selections.forEach(selection => {
    result.push(selection.name.value);
  });
  return result.join();
}
