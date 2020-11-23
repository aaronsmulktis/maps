/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const fg = require('fast-glob');
const CopyPlugin = require('copy-webpack-plugin');

const ROOT = path.join(__dirname, '..');
const isLocalBuild = process.env.LOCAL === 'true';
const envPath = fg.sync(
  [
    `.env${isLocalBuild ? '.local' : ''}`,
    `.env.${process.env.NODE_ENV}${isLocalBuild ? '.local' : ''}`,
    `.env.${process.env.NODE_ENV}`,
    '.env'
  ],
  {
    dot: true,
    cwd: ROOT,
    deep: 0
  }
)[0];
const env = require('dotenv').config({ path: envPath });

const ssrHtmlPath = path.join(ROOT, 'public/index-ssr.html');
const ssrHtmlExists = fs.existsSync(ssrHtmlPath);
const entry = fg.sync('src/index.[tj]s', { absolute: true });

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  entry,
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    modules: ['src', 'node_modules']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        oneOf: [
          {
            test: /^(?!.*\.test\.(j|t)sx?$).*\.m?(j|t)sx?$/,
            exclude: /node_modules\/(?!(@carvana)\/).*/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: !isProd
                }
              }
            ]
          },
          {
            test: [/\.css$/],
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.(png|jpe?g|gif)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  fallback: 'file-loader',
                  name: 'images/[name].[hash].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  disable: isLocalBuild,
                  mozjpeg: {
                    progressive: true,
                    quality: 65
                  },
                  pngquant: {
                    quality: [0.65, 0.9],
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: false
                  }
                }
              }
            ]
          },
          {
            test: /\.html$/,
            exclude: /(node_modules|vendor)/,
            loader: 'html-loader',
            options: {
              attrs: [
                'img:src',
                'img:ng-src',
                'use:xlink:href',
                'use:href',
                'object:data',
                'link:href'
              ]
            }
          },
          {
            test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[ext]'
                }
              }
            ]
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  svgoConfig: {
                    plugins: {
                      removeViewBox: false
                    }
                  }
                }
              }
            ]
          },
          {
            exclude: [/\.(js|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.svg$/],
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                fallback: 'file-loader',
                name: 'static/[name].[hash].[ext]'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([{ from: 'public', to: '.' }], {
      context: ROOT,
      ignore: ['*.html', '*.js']
    }),
    new HtmlWebpackPlugin({
      template: path.join(ROOT, 'public/index.html'),
      filename: './index.html'
    }),
    ssrHtmlExists
      ? new HtmlWebpackPlugin({
          template: ssrHtmlPath,
          filename: './index-ssr.html'
        })
      : false,
    new PreloadWebpackPlugin({
      fileWhitelist: [/\.otf/],
      rel: 'preload',
      as: 'font',
      include: 'allAssets'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      ...(!env.error &&
        Object.keys(env.parsed).reduce((acc, x) => {
          acc[`process.env.${x}`] = JSON.stringify(env.parsed[x]);
          return acc;
        }, {}))
    }),
    !env.error && new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.parsed),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/])
  ].filter(Boolean)
};
