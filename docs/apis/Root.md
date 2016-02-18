# Root
`Gql.Root` method takes a `ReactClass` and returns a new `ReactClass` that contains the original one. The original `ReactClass` will receive props provided from the new one.

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

const rootConfig = {
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
};

export const ListRoot = Gql.Root(rootConfig)(List);
```
