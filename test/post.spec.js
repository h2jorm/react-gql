import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  Simulate,
} from 'react-addons-test-utils';
import {
  OriginPost,
  Post,
  fragmentOpts,
} from './helper/components/post';

import {config} from '../src';
import {store, actions} from './helper/store';

let conf;
beforeEach(() => {
  conf = {
    communicate: function () {}
  };
  spyOn(conf, 'communicate').and.callThrough();
  config({store, actions, communicate: conf.communicate});
});

describe('PostFragment', () => {
  let postData, post, postNode;
  beforeEach(() => {
    postData = {
      id: '1',
      content: 'hello world',
      likes: 2
    };
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
    expect(conf.communicate).toHaveBeenCalledWith(args);
  });
});
