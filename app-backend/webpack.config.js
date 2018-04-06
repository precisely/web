const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: process.env.NODE_ENV=='production' ? 'production' : 'development',
  externals: ['pg-native', 'tedious', 'sqlite3', 'mysql2'],
  plugins: [
    new webpack.ContextReplacementPlugin(
            /sequelize(\\|\/)/,
            path.resolve(__dirname, '../src')
    )
  ],
  resolve: {
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx',
      '.graphql',
      '.gql'
    ],
    plugins: [ new TsConfigPathsPlugin() ],
    enforceExtension: false
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        options: {configFile: 'tsconfig.build.json'}
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      }
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
