const babel = require('babel-core');

module.exports = {
  process: function (src, filename) {
    if (filename.indexOf('node_modules') === -1)
      return babel.transform(src, {
        filename: filename,
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['transform-runtime'],
        retainLines: true
      }).code;
    return src;
  }
};
