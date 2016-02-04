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

export default Gql.Branch(Root, {
  getState: state => ({
    user: state.blog.user,
    posts: state.blog.posts,
  }),
  init: {
    query: `
      query {
        user {
          ${User.getFragment()}
        }
        posts {
          ${List.getFragment()}
        }
      }
    `,
    action: ['blogUserInfo', 'blogInit'],
  }
});
