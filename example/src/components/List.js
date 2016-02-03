import React from 'react';
import Gql from '../react-gql';

class List extends React.Component {
  render() {
    return (
      <ul>
        {this.props.posts.map((post, index) =>
          <li key={index}>{post.title}</li>
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
        posts {title}
      }
    `,
    action: 'blogInit'
  }
});
