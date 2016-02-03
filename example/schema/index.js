const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require('graphql');

var posts = [
  {title: 'hello'},
  {title: 'world'}
];

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    title: {type: GraphQLString}
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
      }
    }),
  }),
});
