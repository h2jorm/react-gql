import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  Simulate,
} from 'react-addons-test-utils';

import {store, actions} from './demo/store';
import {set} from '#/src';
import {
  prepare,
  resetStore,
} from './helper';

import {
  List,
  branchOpts,
} from './demo/components/list';


const getPosts = () => ([
  {id: '1', content: 'hello world', likes: 1},
  {id: '2', content: 'hello react', likes: 2},
  {id: '3', content: 'hello graphql', likes: 3}
]);

describe('ListBranch', () => {
  let conf, list, listNode;
  beforeAll(prepare);
  beforeEach(() => {
    conf = {
      fetchAndDispatch: function ({query, action, variables}) {
        if (query === branchOpts.init.query) {
          return store.dispatch(actions[action]({posts: getPosts()}));
        }
        if (query === branchOpts.mutations.likeAll.query) {
          return store.dispatch(actions[action](null));
        }
      }
    };
    spyOn(conf, 'fetchAndDispatch').and.callThrough();
    set({fetchAndDispatch: conf.fetchAndDispatch});
  });
  beforeEach(() => {
    resetStore();
    list = renderIntoDocument(
      <List />
    );
    listNode = ReactDOM.findDOMNode(list);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(listNode.parentNode);
  });
  it('should have props `posts`', () => {
    expect(List.latestChildren().props.posts).toEqual(getPosts());
  });
  it('should have props `mutations`', () => {
    const mutations = List.latestChildren().props.mutations;
    expect(Object.keys(mutations)).toEqual(['likeAll']);
  });
  it('should trigger likeAll mutation', () => {
    clickLikeAllBtn();
    expect(pickLikeNums()).toEqual(['2', '3', '4']);
    clickLikeAllBtn();
    expect(pickLikeNums()).toEqual(['3', '4', '5']);
  });

  function pickLikeNums() {
    const likes = [];
    _.forEach(listNode.querySelectorAll('li'), li => {
      likes.push(li.lastElementChild.textContent);
    });
    return likes;
  }
  function clickLikeAllBtn() {
    const btns = listNode.querySelectorAll('button');
    let likeAllBtn = _.find(btns, btn => {
      return btn.textContent === 'like all';
    });
    Simulate.click(likeAllBtn);
  }
  function clickResetBtn() {
    const btns = listNode.querySelectorAll('button');
    let resetBtn = _.find(btns, btn => {
      return btn.textContent === 'reset';
    });
    Simulate.click(resetBtn);
  }
});
