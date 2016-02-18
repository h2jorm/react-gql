# set
Set `store` and `fetchAndDispatch` before rendering react components. It is assumed that a redux store is ready.

```js
import Gql from 'react-gql';
import {store} from './store';
import fetch from 'isomorphic-fetch';

Gql.set({
  store,
  fetchAndDispatch,
});

// This function has two responsibilities:
// 1. take care of ajax with graphql server
// 2. dispatch an action after receiving data
//
// argument of `fetchAndDispatch`  is a plain object called `gql unit`
// `gql unit` will be declared when writing components.
// Here is an example:
// {
//   query: `
//     query($date: String!) {
//       posts(data: $date) {id, content, likes}
//     }
//   `,
//   variables: {
//     date: '20160101'
//   },
//   action: posts => ({type: 'init', posts})
// }
function fetchAndDispatch({query, variables = null, action}) {
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
      if (action)
        store.dispatch(action(data.data));
    });
  });
};
```
