const _ = require('lodash');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} = require('graphql');

var posts = [
  {id: '1', title: 'hello', type: 'economy', likes: 0},
  {id: '2', title: 'world', type: 'economy', likes: 1},
  {id: '3', title: 'bye', type: 'politics', likes: 2}
];

var user = {
  name: 'anonymous',
  city: 'Shanghai',
  age: 20,
};

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    type: {type: GraphQLString},
    likes: {type: GraphQLInt},
  })
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: {type: GraphQLString},
    city: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      posts: {
        type: new GraphQLList(Post),
        args: {
          type: {type: GraphQLString},
        },
        resolve: (root, args) => {
          return _.filter(posts, post => post.type === args.type);
        }
      },
      user: {
        type: User,
        resolve: (root, args) => user,
      }
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      likePost: {
        type: Post,
        args: {
          id: {type: GraphQLID}
        },
        resolve: (root, args) => {
          for (let i = 0, j = posts.length; i < j; i++) {
            if (posts[i].id === args.id) {
              posts[i].likes++;
              return posts[i];
            }
          }
          return null;
        }
      },
      dislikePost: {
        type: Post,
        args: {
          id: {type: GraphQLID}
        },
        resolve: (root, args) => {
          for (let i = 0, j = posts.length; i < j; i++) {
            if (posts[i].id === args.id) {
              if (posts[i].likes > 0)
                posts[i].likes--;
              return posts[i];
            }
          }
          return null;
        }
      },
    }),
  }),
});
