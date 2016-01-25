import fetch from 'isomorphic-fetch';
import {store} from './store';
import {set} from '#/src';

Gql.set({
  store,
  communicate,
});

// custom communication strategy
function communicate({query, variables = null, action}) {
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
      store.dispatch(action(data.data));
    });
  });
};

// execute function and then return result
// or return origin value
function resolveMayBeFn(fn) {
  return typeof fn === 'function' ? fn() : fn;
}
