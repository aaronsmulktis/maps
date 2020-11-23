/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const { homepage: appName } = require('../package.json');

const chunksGroupOptions = {
  chunks: 'all',
  minSize: 0,
  minChunks: 1,
  reuseExistingChunk: true,
  enforce: true
};

const ROOT = path.join(__dirname, '..');
const outputPath = path.join(ROOT, `build/${appName}`);
const assetsUrl =
  process.env.CVNA_APP_PUBLIC_URL || process.env.CARVANA_APP_PUBLIC_URL;

module.exports = merge(common, {
  bail: true,
  devtool: 'source-map',
  mode: 'production',
  performance: {
    hints: false
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: outputPath,
    publicPath: `${assetsUrl}/`
  },
  optimization: {
    noEmitOnErrors: true,
    namedModules: true,
    runtimeChunk: 'single',
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](!@carvana)[\\/]/,
          name: 'vendors',
          ...chunksGroupOptions
        },
        common: {
          test: /[\\/]node_modules[\\/](@carvana)[\\/]/,
          name: 'common',
          ...chunksGroupOptions
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin(),
    new ManifestPlugin({ fileName: 'assets-manifest.json' })
  ].concat(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : [])
});
