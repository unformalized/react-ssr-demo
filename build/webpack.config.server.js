const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const dependencies = require('../package.json').dependencies;

const config = webpackMerge(baseConfig, {
  mode: 'development',
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  externals: Object.keys(dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3033"'
    })
  ]
});

module.exports = config;
