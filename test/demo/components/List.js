import React from 'react';
import {Post} from './Post';
import Gql from '#/src';
import {store, actions} from '../store';

export const rootOpts = {
  getState: state => ({
    posts: state.blog.posts
  }),
  init: {
    query: `
      query {
        posts {
          ${Post.getFragment()}
        }
      }
    `,
    action: 'blogInit',
  },
  mutations: {
    likeAll: {
      query: `
        mutation likeAll {
          likeAllPosts {
            ${Post.getFragment()}
          }
        }
      `,
      action: 'blogLikeAll'
    }
  }
};

@Gql.Root(rootOpts)
export class List extends React.Component {
  static defaultProps = {
    posts: []
  };
  likeAll() {
    this.props.mutations.likeAll();
  }
  reset() {
    store.dispatch(actions.blogReset());
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.props.posts.map(post =>
              <Post key={post.id} post={post} />
            )
          }
        </ul>
        <button onClick={::this.likeAll}>like all</button>
        <button onClick={::this.reset}>reset</button>
      </div>
    );
  }
}
