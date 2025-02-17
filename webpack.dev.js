const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

require('dotenv').config();

const devConfigOverwrite = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['react-refresh/babel']
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin([
      'REACT_APP_OPEN_BALENA_UI_URL',
      'REACT_APP_OPEN_BALENA_POSTGREST_URL',
      'REACT_APP_OPEN_BALENA_REMOTE_URL',
      'REACT_APP_OPEN_BALENA_API_URL',
      'REACT_APP_OPEN_BALENA_API_VERSION',
      'REACT_APP_BANNER_IMAGE',
    ]),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // Path to serve static files from
    },
    compress: false, // Enable gzip compression
    historyApiFallback: true, // Fallback to /index.html for Single Page Applications
    open: true, // Open the browser after server has been started
    hot: true, // Enable Hot Module Replacement
    port: process.env.PORT || 3000,
  },
  devtool: 'eval-cheap-module-source-map',
};

const devConfig = mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: {
        loader: "match",
        options: "replace",
      },
    },
  },
})(common, devConfigOverwrite);

module.exports = devConfig;