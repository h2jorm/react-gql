import React from 'react';
import {Post} from './post';
import {branch} from '../../../src';

class OriginList extends React.Component {
  static defaultProps = {
    posts: []
  };
  likeAll() {
    this.props.mutations.likeAll();
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

export const List = branch(OriginList, branchOpts);
