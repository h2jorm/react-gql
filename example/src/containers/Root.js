import React from 'react';

import List from '../components/List';
import User from '../components/User';

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <List />
        <User />
      </div>
    );
  }
}
