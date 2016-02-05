import React from 'react';
import Gql from '../react-gql';

import List from '../components/List';
import User from '../components/User';

class Root extends React.Component {
  render() {
    const {posts, user} = this.props;
    return (
      <div>
        <List posts={posts} />
        <User user={user} />
      </div>
    );
  }
}

export default Gql.Root(Root, {
  getState: state => ({
    user: state.blog.user,
    posts: state.blog.posts,
  }),
  init: {
    query: `
      query ($type: String) {
        user {
          ${User.getFragment()}
        }
        posts (type: $type) {
          ${List.getFragment()}
        }
      }
    `,
    action: ['blogUserInfo', 'blogInit'],
    variables: {
      type: 'economy'
    }
  },
});
