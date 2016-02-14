import React from 'react';
import Gql from '../react-gql';

@Gql.Fragment({
  fragment: `
    fragment user on User {
      name, city, age
    }
  `
})
export default class User extends React.Component {
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
