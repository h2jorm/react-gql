import fetch from 'isomorphic-fetch';
import {store, actions} from './store';
import Gql from './react-gql';

Gql.set({
  store,
  fetchAndDispatch,
  logger: true,
});

// custom communication strategy
function fetchAndDispatch({query, variables = null, action}) {
  variables = resolveMayBeFn(variables);
  return fetch('/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query, variables
    }),
  }).then(res => {
    return res.json().then(data => {
      resolveMayBeArray(action, function (action) {
        store.dispatch(actions[action](data.data));
      });
    });
  });
};

// execute function and then return result
// or return origin value
function resolveMayBeFn(fn) {
  return typeof fn === 'function' ? fn() : fn;
}

function resolveMayBeArray(array, fn) {
  if (!Array.isArray(array))
    array = [array];
  array.forEach(item => fn(item));
}
