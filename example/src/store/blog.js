module.exports = {
  name: 'blog',
  defaultState: {
    posts: []
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
    }
  }
};
