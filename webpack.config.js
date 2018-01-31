var webpack = require('webpack');
var path = require('path');

var config = {
  entry: __dirname + '/src/index.js',
  output: {
    path:__dirname + '/build',
    filename: 'main.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : __dirname + '/src',
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;
