const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const distPath = path.join(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';
const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

const getEntries = (enableHotReloading) => {
  if (!enableHotReloading) {
    return {
      app: ['./src/index.js']
    };
  }

  return [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ];
};

const getLoaders = (enableHotReloading) => {
  const hotLoaderPrefix = enableHotReloading ? 'react-hot!' : '';

  return [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: `${hotLoaderPrefix}babel`
    },
    {
      test: /\.(css|scss)$/,
      loader: `style!css?modules&localIdentName=[local]--[hash:base64:5]!sass` // note: css modules is enabled
    },
    {
      test: /\.json$/,
      loader: 'json'
    }
  ]
};

const getPlugins = (isDevServer, isProduction) => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './src/index.template.html',
      filename: './index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: './assets'
    }], {
      ignore: ['.DS_Store', '.gitempty']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
  ];

  if (!isDevServer) {
    plugins.push(
      new CleanWebpackPlugin([distPath]),
      new webpack.optimize.CommonsChunkPlugin('common.[hash].js'),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    );
  }

  return plugins;
};

module.exports = {
  entry: getEntries(isDevServer),
  output: {
    path: distPath,
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    loaders: getLoaders(isDevServer)
  },
  plugins: getPlugins(isDevServer, isProduction)
};
