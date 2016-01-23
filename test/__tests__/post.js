jest.dontMock('../post');

import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
} from 'react-addons-test-utils';

require('../helper/root');
const Post = require('../post').Post;

describe('PostFragmentContainer', () => {
  let post, postNode;
  beforeEach(() => {
    const _post = {
      id: '1',
      content: 'hello world',
      likes: 2
    };
    post = renderIntoDocument(
      <Post post={_post} />
    );
    postNode = ReactDOM.findDOMNode(post);
  });
  it('should contains like button', () => {
    expect(postNode.querySelector('button').textContent).toBe('like');
  });
});
