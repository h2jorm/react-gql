# Fragment
Components wrapped by `Gql.Root` is considered smart components. They sync states with redux store.

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

const fragmentConfig = {
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
};

export const PostFragment = Gql.Fragment(fragmentConfig)(Post);

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

const rootConfig = {
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
};

export const ListRoot = Gql.Root(rootConfig)(List);
```
