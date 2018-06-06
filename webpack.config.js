'use strict';

const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyWebpackPluginConfig = new CopyWebpackPlugin([{from: 'sounds/**'}]);
const ExtractTextPluginConfig = new ExtractTextPlugin({filename: 'main.css'});
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body',
});
const NamedModulesPlugin = new webpack.NamedModulesPlugin();

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['babel-polyfill', 'react-hot-loader/patch', './src/index'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  plugins: [
    NamedModulesPlugin,
    ExtractTextPluginConfig,
    HTMLWebpackPluginConfig,
    CopyWebpackPluginConfig,
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname + '/src',
        use: ['babel-loader'],
      },
      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'img/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
