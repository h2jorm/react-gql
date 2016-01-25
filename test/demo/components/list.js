import React from 'react';
import {Post} from './post';
import {branch} from '#/src';
import {store, actions} from '../store';

class OriginList extends React.Component {
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

export const branchOpts = {
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
    action: actions.blogInit,
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
      action: actions.blogLikeAll
    }
  }
};

export const List = branch(OriginList, branchOpts);