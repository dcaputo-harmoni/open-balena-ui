const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = {
  mode: 'development',
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'src/index.js'),
  ],
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html',
      favicon: 'src/favicon.ico',
      manifest: 'src/manifest.json',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      REACT_APP_OPEN_BALENA_UI_URL: process.env.REACT_APP_OPEN_BALENA_UI_URL,
      REACT_APP_OPEN_BALENA_POSTGREST_URL: process.env.REACT_APP_OPEN_BALENA_POSTGREST_URL,
      REACT_APP_OPEN_BALENA_REMOTE_URL: process.env.REACT_APP_OPEN_BALENA_REMOTE_URL,
      REACT_APP_OPEN_BALENA_API_URL: process.env.REACT_APP_OPEN_BALENA_API_URL,
      REACT_APP_OPEN_BALENA_API_VERSION: process.env.REACT_APP_OPEN_BALENA_API_VERSION,
    }),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  devtool: 'eval-source-map',
  target: 'web', 
  performance: {
    hints: false,
  },
}