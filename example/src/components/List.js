import React from 'react';
import Gql from '../react-gql';

import Post from './Post';

class List extends React.Component {
  render() {
    return (
      <ul>
        {this.props.posts.map((post, index) =>
          <Post key={index} post={post} />
        )}
      </ul>
    );
  }
}

export default Gql.Branch(List, {
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
    action: 'blogInit'
  }
});
