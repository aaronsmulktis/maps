/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const common = require('./webpack.common.js');
const { homepage: appName } = require('../package.json');

const ROOT = path.join(__dirname, '..');

const rootUrl = `${process.env.CVNA_APP_PUBLIC_URL || process.env.CARVANA_APP_PUBLIC_URL}`.replace(/[/\\\\]/, '');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: `${rootUrl}/js/[name].js`,
    pathinfo: true,
    path: path.join(ROOT, `build/${appName}`),
    publicPath: '/'
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  devServer: {
    open: true,
    port: 3000,
    contentBase: path.join(ROOT, 'build'),
    historyApiFallback: {
      index: '/'
    },
    disableHostCheck: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
