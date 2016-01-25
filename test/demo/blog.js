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
    },
    like: function *() {
      yield type => {
        return ({likePost}) => {
          return {type, id: likePost.id};
        };
      };
      yield (state, action) => {
        const {id} = action;
        const post = _.find(state.posts, function (post) {
          return post.id === id;
        });
        post.likes = post.likes + 1;
        return Object.assign({}, state, {
          posts: state.posts
        });
      };
    },
    likeAll: function *() {
      yield type => {
        return data => {
          return {type};
        };
      };
      yield (state, action) => {
        // console.log('reducer:likeAll', state.posts);
        let posts = [];
        state.posts.map(post => {
          post.likes = ++post.likes;
          posts.push(post);
        });
        return Object.assign({}, state, {posts});
      };
    },
    reset: function *() {
      yield type => () => ({type});
      yield (state, action) => {
        // console.log('reducer:reset', state.posts);
        return {
          posts: []
        };
      };
    }
  }
};
