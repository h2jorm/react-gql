const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

var posts = [
  {title: 'hello'},
  {title: 'world'}
];

var user = {
  name: 'anonymous',
  city: 'Shanghai',
  age: 20,
};

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    title: {type: GraphQLString}
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
});
