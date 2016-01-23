import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
} from 'react-addons-test-utils';

const Post = require('./helper/components/post').Post;

describe('PostFragmentContainer', () => {
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
});
