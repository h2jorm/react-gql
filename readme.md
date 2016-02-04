# react-gql [![Build Status](https://travis-ci.org/leeching/react-gql.svg)](https://travis-ci.org/leeching/react-gql) [![npm version](https://badge.fury.io/js/react-gql.svg)](https://badge.fury.io/js/react-gql)
Here is a collection of helper functions to build a react app with redux and graphql.

Different from `react-relay`, `react-gql` is not a full-featured framework but a flyweight library providing several helper functions to combine react, redux and graphql together. As a result, `react-gql` leaves the control of application to developers and only handles dirty and unpleasant works.

## Providing
`react-gql` does not take care of:

* writing action creator functions, reducer and creating store
* dispatching redux actions
* communication with graphql server

`react-gql` takes care of:

* declaring data structure of a react component
* declaring graphql mutations
* updating component state when `store` changes

## Api

### set
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
      store.dispatch(action(data.data));
    });
  });
};
```

### Branch
`Gql.Branch` method takes a `ReactClass` and returns a new `ReactClass` that contains the original one. The original `ReactClass` will receive props provided from the new one.

```js
import React from 'react';
import Gql from 'react-gql';
import actions from './actions';

class List extends React.Component {
  static defaultProps = {
    posts: []
  };
  likeAll(event) {
    event.preventDefault();
    this.props.mutations.likeAll();
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.props.posts.map(post =>
              <li key={post.id}>
                <span>{post.content}</span>
                <span>{post.likes}</span>
              </li>
            )
          }
        </ul>
        <button onClick={::this.likeAll}>like all</button>
      </div>
    );
  }
}

export const ListBranch = Gql.Branch(List, {
  // connect data from store to `this.props` of `List`
  getState: state => ({
    post: state.posts
  }),
  // `init' is a gql unit
  // When `componentDidMount`, `fetchAndDispatch` function will be executed with this gql unit.
  // `init` is optional
  init: {
    query: `
      query($date: String!) {
        posts(data: $date) {id, content, likes}
      }
    `,
    variables: {
      date: '20160101'
    },
    // assume `actions.init` is an action creator function
    action: actions.init
  },
  // `mutations` contains a collection of gql units
  // `this.props.mutations` is available to `List`
  mutations: {
    likeAll: {
      query: `
        mutation likeAll {
          likeAllPosts {
            ${Post.getFragment()}
          }
        }
      `,
      // assume `actions.likeAllPosts` is an action creator function
      action: actions.likeAllPosts
    }
  }
});
```

### Fragment
Components wrapped by `Gql.Branch` is considered smart components. They sync states with redux store.

However, components wrapped by `Gql.Fragment` is considered dummy components. They are able to declare data structure but receive data only from `props`.

```js
// src/components/Post.js
import React from 'react';
import Gql from 'react-gql';
import actions from './actions';

class Post extends React.Component {
  static defaultProps = {
    post: {
      content: '',
      likes: 0
    }
  };
  likePost(event) {
    event.preventDefault();
    // It is permitted to pass `variables` when executing mutation function
    this.props.mutations.like({
      id: this.props.post.id
    });
  }
  render() {
    return (
      <li>
        <span>
          {this.props.post.content}
        </span>
        <button onClick={::this.likePost}>like</button>
        <span>
          {this.props.post.likes}
        </span>
      </li>
    );
  }
}

export const PostFragment = Gql.Fragment(Post, {
  fragment: `
    fragment post on Post {
      id, content, likes
    }
  `,
  // `mutations` is same as that of `gql.branch`
  mutations: {
    like: {
      query: `
        mutation likePost($id: ID) {
          likePost(id: $id) {
            id, content, likes
          }
        }
      `,
      // assume `actions.blogLike` is an action creator function
      action: actions.blogLike,
    }
  }
});

// src/components/List.js
import React from 'react';
import Gql from 'react-gql';
import actions from './actions';

import PostFragment from './Post';

class List extends React.Component {
  static defaultProps = {
    posts: []
  };
  render() {
    return (
      <ul>
        {
          this.props.posts.map(post =>
            <Post key={post.id} post={post} />
          )
        }
      </ul>
    );
  }
}

export const ListBranch = Gql.Branch(List, {
  getState: state => ({
    posts: state.blog.posts
  }),
  init: {
    // `Post.getFragment()` will be `id,content,likes`
    query: `
      query {
        posts {
          ${Post.getFragment()}
        }
      }
    `,
    action: actions.blogInit,
  }
});
```

### connect
`Gql.connect` is a redux middleware responsible for updating state when store changes. Compared with the implementation of `react-redux`, it is more convenient to add a middleware when creating a store.

When a `GqlBranchContainer` `componentDidMount`, a connection function will be registered in the middleware. Every time store changes, all registered connection functions will be executed one by one. When `componentWillUnmount`, the connection function will be canceled.

```js
import React from 'react';
import {connect} from 'react-gql';
import {
  createStore,
  applyMiddleware,
} from 'redux';

let createStoreWithMiddleware = applyMiddleware(
  connect
)(createStore);

export const store = createStoreWithMiddleware(
  reducer
);
```

## Advanced

### Nested fragment
`Gql.Fragment` supports nested fragment declare.

```js
import Gql from 'react-gql';
import Post from './Post';// Post is a `ReactClass`

Post = Gql.Fragment(Post, {
  fragment: `
    fragment post on Post {
      id,
      content,
      likes,
      editor {
        ...Editor
      }
    }
    fragment editor on Editor {
      id, name
    }
  `
});

Post.getFragment(); // 'id,content,likes,editor{id,name}'
Post.getFragment('post'); // 'id,content,likes,editor{id,name}'
Post.getFragment('editor'); // 'id,name'
```

### Deliver props
It is possible to deliver props from `Branch` component to wrapped component.

```js
import {
  renderIntoDocument,
} from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Gql from 'react-gql';
class Hello extends React.Component {
  render() {
    return (
      <div>Hello, {this.props.name}</div>
    );
  }
}
Hello = Gql.Branch(Hello, {
  getProps: props => {
    const {name} = props;
    return {name};
  }
});
const hello = renderIntoDocument(
  <Hello name="world" />
);
const helloNode = ReactDOM.findDOMNode(hello);
expect(helloNode.textContent).toBe('Hello, world'); // true
```
