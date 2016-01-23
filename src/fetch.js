import fetch from 'isomorphic-fetch';

exports.fetch = function (query, variables = null) {
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
    return res.json().then(data => data.data);
  });
};
