const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// Setting NODE_PATH to current working directory to support absolute imports
process.env.NODE_PATH = './';

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    modules: [
      "node_modules",
      resolveApp('node_modules')
    ].concat(process.env.NODE_PATH.split(path.delimiter).filter(Boolean)),
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
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
      { test: /\.graphql|gql?$/, loader: 'webpack-graphql-loader' }
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
