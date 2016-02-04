import React from 'react';
import Gql from '../react-gql';

class Post extends React.Component {
  render() {
    return (
      <li>
        {this.props.post.title}
      </li>
    );
  }
}

export default Gql.Fragment(Post, {
  fragment: `
    fragment post on Post {
      title
    }
  `
});
