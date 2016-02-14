import React from 'react';
import Gql from '../react-gql';

import Post from './Post';

@Gql.Fragment({
  // Fragment name `Posts` is not declared in server.
  // However, it will not be validated.
  fragment: `
    fragment posts on Posts {
      ${Post.getFragment()}
    }
  `
})
export default class List extends React.Component {
  render() {
    const {posts} = this.props;
    return (
      <div>
        {posts.map((post, index) =>
          <Post key={index} post={post} />
        )}
      </div>
    );
  }
}
