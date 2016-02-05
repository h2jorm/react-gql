const path = require('path');
const webpack = require('webpack');

const output = {
  path: path.join(__dirname, 'build'),
  filename: 'bundle.js',
};

const loaders = [
  {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      plugins: ['transform-runtime'],
      presets: ['react', 'es2015', 'stage-0']
    },
  }
];

const plugins = [
  new webpack.ProvidePlugin({
    _: 'lodash'
  })
];

module.exports = {
  entry: './src/index',
  output,
  module: {loaders},
  plugins,
  devtool: '#source-map',
};
