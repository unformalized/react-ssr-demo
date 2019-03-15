const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/index.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/index.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common'
    }
  }
});

if (isDev) {
  config.devtool = '#@cheap-module-eval-source-map';
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/index.js')
    ]
  };
  config.devServer = {
    host: '0.0.0.0',
    port: 8888,
    // contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3033'
    }
  };
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
