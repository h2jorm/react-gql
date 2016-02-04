import React from 'react';
import Gql from '../react-gql';

class User extends React.Component {
  render() {
    return (
      <dl>
        <dt>name</dt>
        <dd>{this.props.user.name}</dd>
        <dt>city</dt>
        <dd>{this.props.user.city}</dd>
        <dt>age</dt>
        <dd>{this.props.user.age}</dd>
      </dl>
    );
  }
}

export default Gql.Branch(User, {
  getState: state => ({
    user: state.blog.user
  }),
  init: {
    query: `
      query {
        user {name, city, age}
      }
    `,
    action: 'blogUserInfo'
  },
});
