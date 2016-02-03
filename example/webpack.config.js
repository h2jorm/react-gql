const path = require('path');

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
]

module.exports = {
  entry: './src/index',
  output,
  module: {loaders},
  devtool: '#source-map',
};
