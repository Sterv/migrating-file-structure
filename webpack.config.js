const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const VENDOR_LIBS = [
  'axios', 'lodash', 'react', 'react-dom', 'react-redux',
  'react-redux-multilingual', 'react-redux-toastr', 'react-router',
  'react-router-redux', 'redux', 'redux-auth-wrapper',
  'redux-devtools-extension', 'redux-form', 'redux-pack',
  'redux-promise-middleware', 'semantic-ui-react'
];

module.exports = {
  entry: {
    bundle: './client/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.CLOUD_NAME': JSON.stringify(process.env.CLOUD_NAME),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.UPLOAD_PRESET': JSON.stringify(process.env.UPLOAD_PRESET)
    }),
    new ExtractTextPlugin('styles.css')
  ]
};
