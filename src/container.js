import React from 'react';
import {parse} from 'graphql/language';
import {register} from './middleware';

let store;
let communicate = function () {};

export function set(opts) {
  if (opts.store)
    store = opts.store;
  if (opts.communicate && typeof opts.communicate === 'function')
    communicate = function (...args) {
      return opts.communicate(...args);
    };
};

// wrap a smart react component with optional init query
export function branch(reactComponent, opts) {
  let Children;
  function connect(reactComponentInstance) {
    return function (store) {
      // console.log('connect', store.getState().blog.posts)
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
      communicate(opts.init);
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
 * @param mutations {Object<query: QLString, action: ReduxActionString>}
 * @return mutations {Object<Function>}
 */
function getMutations(mutations) {
  let result = {};
  Object.keys(mutations).forEach(name => {
    result[name] = (variables = null) => {
      const {query, action} = mutations[name];
      return communicate({query, variables, action});
    };
  });
  return result;
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
