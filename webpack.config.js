var webpack = require('webpack');
module.exports = {
  entry: "./app/scripts/main.jsx",
  output: {
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    {
      test: /\.svg|\.png|\.ttf|\.woff|\.eot|\.woff2$/,
      loader: 'file'
    }]
  },
  plugins: []
};
