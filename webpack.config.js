const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

const isDevelopment = process.env.NODE_ENV === 'development';

console.log(`isDevelopment: ${isDevelopment}`);

const ReactRefreshWebpackPlugin = isDevelopment ? require('@pmmmwh/react-refresh-webpack-plugin') : null;

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: [path.join(process.cwd(), 'src/index.js')],
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true, // Automatically clean the output directory before each build
  },
  optimization: {
    moduleIds: 'deterministic', // Enable consistent hashing for long term caching
    runtimeChunk: 'single', // Create a runtime file to be shared for all generated chunks
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset', // Use asset module type for SVG
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource', // Use asset module type for images
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }

    ],
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html',
      favicon: 'src/favicon.ico',
      manifest: 'src/manifest.json',
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin([
      'REACT_APP_OPEN_BALENA_UI_URL',
      'REACT_APP_OPEN_BALENA_POSTGREST_URL',
      'REACT_APP_OPEN_BALENA_REMOTE_URL',
      'REACT_APP_OPEN_BALENA_API_URL',
      'REACT_APP_OPEN_BALENA_API_VERSION',
      'REACT_APP_BANNER_IMAGE',
    ]),
  ].filter(Boolean),
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'module', 'main'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm : false
    },
  },
  devtool: 'eval-cheap-module-source-map',
  target: ['web', 'es5'],
  performance: {
    hints: false,
  },
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
};
