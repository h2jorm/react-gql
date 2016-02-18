import React from 'react';
import Gql from '../react-gql';

@Gql.Fragment({
  fragment: `
    fragment post on Post {
      id, title, likes
    }
  `,
  mutations: {
    like: {
      query: `
        mutation ($id: ID!) {
          post: likePost (id: $id) {
            id, title, likes
          }
        }
      `,
      action: actions => actions.blog.like,
    },
    dislike: {
      query: `
        mutation ($id: ID!) {
          post: dislikePost (id: $id) {
            id, title, likes
          }
        }
      `,
      action: actions => actions.blog.dislike,
    },
  }
})
export default class Post extends React.Component {
  like(id) {
    return () => {
      this.props.mutations.like({id});
    };
  }
  dislike(id) {
    return () => {
      this.props.mutations.dislike({id});
    };
  }
  render() {
    const {id, title, likes} = this.props.post;
    return (
      <div>
        <dl>
          <dt>Title</dt>
          <dd>{title}</dd>
          <dt>Likes</dt>
          <dd>{likes}</dd>
        </dl>
        <button onClick={::this.like(id)}>like</button>
        <button onClick={::this.dislike(id)}>dislike</button>
      </div>
    );
  }
}
