# Decorator Support
`Gql.Root` and `Gql.Fragment` support decorator syntax.

```js
import React from 'react';
import actions from './actions';

@Gql.Root(
  getState: state => ({
    name: state.user.name,
  }),
  init: {
    query: `
      {
        user {
          name,
        }
      }
    `,
    action: actions.initUserInfo
  }
)
export class Hello extends React.Component {
  render() {
    return (
      <div>Hello, {this.props.name}</div>
    );
  }
}

```
