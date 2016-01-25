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
  OriginPost,
  Post,
  fragmentOpts,
} from './demo/components/post';

const postData = {
  id: '1',
  content: 'hello world',
  likes: 2
};

describe('PostFragment', () => {
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
  it('should have props `post`', () => {
    expect(Post.getChildren().props.post).toEqual(postData);
  });
  it('should have props `mutations`', () => {
    const mutations = Post.getChildren().props.mutations;
    expect(Object.keys(mutations)).toEqual(['like']);
  });
  it('should trigger like mutation', () => {
    Simulate.click(postNode.querySelector('button'));
    const args = Object.assign({}, fragmentOpts.mutations.like, {
      variables: {id: '1'}
    });
    expect(conf.fetchAndDispatch).toHaveBeenCalledWith(args);
  });
});
