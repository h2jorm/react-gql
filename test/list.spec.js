import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  Simulate,
} from 'react-addons-test-utils';
import {
  List,
  branchOpts,
} from './helper/components/list';

import {config} from '../src';
import {store, actions} from './helper/store';

let conf;
const posts = [
  {id: '1', content: 'hello world', likes: 1},
  {id: '2', content: 'hello react', likes: 2},
  {id: '3', content: 'hello graphql', likes: 3}
];
beforeEach(() => {
  conf = {
    communicate: function ({query, action, variables}) {
      if (query === branchOpts.init.query)
        return store.dispatch(actions[action]({posts}));
    }
  };
  spyOn(conf, 'communicate').and.callThrough();
  config({store, actions, communicate: conf.communicate});
});

describe('ListBranch', () => {
  let list, listNode;
  beforeEach(() => {
    list = renderIntoDocument(
      <List />
    );
    listNode = ReactDOM.findDOMNode(list);
  });
  it('should have props `posts`', () => {
    expect(List.getChildren().props.posts).toEqual(posts);
  });
  it('should have props `mutations`', () => {
    const mutations = List.getChildren().props.mutations;
    expect(Object.keys(mutations)).toEqual(['likeAll']);
  });
  it('should trigger likeAll mutation', () => {
    const btns = listNode.querySelectorAll('button');
    let likeAllBtn = _.find(btns, btn => {
      return btn.textContent === 'like all'
    });
    Simulate.click(likeAllBtn);
    const args = Object.assign({variables: null}, branchOpts.mutations.likeAll);
    expect(conf.communicate.calls.argsFor(1)).toEqual([args]);
  });
});
