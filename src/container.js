import React from 'react';
const {fetch} = require('./fetch');
import {parse} from 'graphql/language';
import {register} from './middleware';

let store, actions;

// config store and actions
export function config(args) {
  store = args.store;
  actions = args.actions;
};

// wrap a smart react component with optional init query
export function branch(reactComponent, opts) {
  let Children;
  function connect(reactComponentInstance) {
    return function () {
      reactComponentInstance.setState(reactComponentInstance.getStoreData());
    };
  }
  return class DataHubBranchContainer extends React.Component {
    static getChildren() {
      return Children;
    };
    constructor() {
      super();
      this.state = this.getStoreData();
      register(connect(this));
    }
    getStoreData() {
      const {getState} = opts;
      return getState(store.getState());
    }
    componentDidMount() {
      if (!opts.init)
        return;
      const {action, query, variables} = opts.init;
      fetch(query, resolveMayBeFn(variables)).then(data => {
        store.dispatch(actions[action](data));
      });
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
      return fetch(query, variables).then(data => {
        store.dispatch(actions[action](data));
      });
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

// execute function and then return result
// or return origin value
function resolveMayBeFn(fn) {
  return typeof fn === 'function' ? fn() : fn;
}
