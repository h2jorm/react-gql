import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  Simulate,
} from 'react-addons-test-utils';

import {store} from './demo/store';
import {set} from '#/src';
import {
  prepare,
  resetStore,
} from './helper';

import {
  Post,
  fragmentOpts,
} from './demo/components/Post';

const postData = {
  id: '1',
  content: 'hello world',
  likes: 2
};

describe('Fragment', () => {

  let conf, post, postNode;
  beforeAll(prepare);
  beforeEach(() => {
    conf = {
      fetchAndDispatch: function () {}
    };
    spyOn(conf, 'fetchAndDispatch').and.callThrough();
    set({fetchAndDispatch: conf.fetchAndDispatch});
  });
  beforeEach(() => {
    resetStore();
    post = renderIntoDocument(
      <Post post={postData} />
    );
    postNode = ReactDOM.findDOMNode(post);
  });

  it('should be accessable to fragment content', () => {
    expect(Post.getFragment()).toBe('id,content,likes');
  });
  describe('children', () => {
    it('should have props `post`', () => {
      expect(Post.latestChildren().props.post).toEqual(postData);
    });
    it('should have props `mutations`', () => {
      const mutations = Post.latestChildren().props.mutations;
      expect(Object.keys(mutations)).toEqual(['like']);
    });
    it('should be able to dispatch `blogLike` mutation', () => {
      Simulate.click(postNode.querySelector('button'));
      const {action} = conf.fetchAndDispatch.calls.argsFor(0)[0];
      expect(action).toEqual(fragmentOpts.mutations.like.action);
    });
  });
});
