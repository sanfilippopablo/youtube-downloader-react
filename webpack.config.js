var webpack = require('webpack');
module.exports = {
  devtool: 'source-map',
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
      loader: 'babel-loader',
      exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
    },
    {
      test: /\.svg|\.png|\.ttf|\.woff|\.eot|\.woff2$/,
      loader: 'file'
    }]
  },
  plugins: []
};
