module.exports = {
  name: 'blog',
  defaultState: {
    posts: [],
    user: {}
  },
  mutation: {
    init: function *() {
      yield type => {
        return ({posts}) => {
          return {type, posts};
        };
      };
      yield (state, action) => {
        return Object.assign({}, state, {
          posts: action.posts
        });
      };
    },
    userInfo: function *() {
      yield type => {
        return ({user}) => {
          return {type, user};
        };
      };
      yield (state, action) => {
        return Object.assign({}, state, {
          user: action.user
        });
      };
    },
    like: function *() {
      yield type => {
        return ({post}) => {
          return {type, post};
        };
      };
      yield (state, action) => {
        const index = _.findIndex(state.posts, post => post.id === action.post.id);
        return Object.assign({}, state, {
          posts: [
            ...state.posts.slice(0, index),
            action.post,
            ...state.posts.slice(index + 1)
          ]
        });
      };
    },
    dislike: function *() {
      yield type => {
        return ({post}) => {
          return {type, post};
        };
      };
      yield (state, action) => {
        const index = _.findIndex(state.posts, post => post.id === action.post.id);
        return Object.assign({}, state, {
          posts: [
            ...state.posts.slice(0, index),
            action.post,
            ...state.posts.slice(index + 1)
          ]
        });
      };
    }
  }
};
