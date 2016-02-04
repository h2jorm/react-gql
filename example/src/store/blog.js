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
    dislike: function *() {
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
    }
  }
};
