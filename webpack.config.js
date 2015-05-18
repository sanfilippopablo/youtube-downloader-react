var webpack = require('webpack');
module.exports = {
  entry: "./app/scripts/main.jsx",
  output: {
    path: __dirname + '/app',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: "style!css!sass"
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
};
