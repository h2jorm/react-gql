const path = require('path');
const koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const route = require('koa-route');
const send = require('koa-send');

const schema = require('./schema');
const app = koa();

app.use(mount('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
})));

app.use(route.get('/bundle.js', function *() {
  yield send(this, 'build/bundle.js', {root: __dirname});
}));

app.use(route.get('/bundle.js.map', function *() {
  yield send(this, 'build/bundle.js.map', {root: __dirname});
}));

app.use(function *() {
  yield send(this, 'index.html', {root: __dirname});
});

module.exports = app;
