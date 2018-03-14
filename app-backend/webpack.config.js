const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: ['pg-native', 'tedious', 'sqlite3', 'mysql2'],
  plugins: [
    new webpack.ContextReplacementPlugin(
            /sequelize(\\|\/)/,
            path.resolve(__dirname, '../src'
          )
  )],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ],
    enforceExtension: false
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        options: {configFile: 'tsconfig.build.json'}
      },
      {
        test: /\.graphql|gql?$/,
        loader: 'webpack-graphql-loader'
      }
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
