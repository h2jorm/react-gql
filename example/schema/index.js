const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} = require('graphql');

var posts = [
  {id: '1', title: 'hello', likes: 0},
  {id: '2', title: 'world', likes: 1}
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
        resolve: (root, args) => {
          return posts;
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
        type: new GraphQLList(Post),
        args: {
          id: {type: GraphQLID}
        },
        resolve: (root, args) => {
          for (let i = 0, j = posts.length; i < j; i++) {
            if (posts[i].id === args.id) {
              posts[i].likes++;
              return posts;
            }
          }
          return posts;
        }
      },
      dislikePost: {
        type: new GraphQLList(Post),
        args: {
          id: {type: GraphQLID}
        },
        resolve: (root, args) => {
          for (let i = 0, j = posts.length; i < j; i++) {
            if (posts[i].id === args.id) {
              if (posts[i].likes > 0)
                posts[i].likes--;
              return posts;
            }
          }
          return posts;
        }
      },
    }),
  }),
});
