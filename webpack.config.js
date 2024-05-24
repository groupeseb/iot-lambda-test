const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const {TsconfigPathsPlugin} = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  mode: 'development',
  externals: [nodeExternals()],
  target: 'node',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.yml'],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, slsw.lib.serverless.configurationInput.custom.webpack.compileDir),
          path.resolve(__dirname, 'common')
        ],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2021'],
        }
      },
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, slsw.lib.serverless.configurationInput.custom.webpack.compileDir),
          path.resolve(__dirname, 'common')
        ],
        exclude: /(node_modules)/,
        loader: 'ts-loader',
      },
      {
        test: /\.yml$/,
        include: [
          path.resolve(__dirname, slsw.lib.serverless.configurationInput.custom.webpack.compileDir),
        ],
        exclude: /(node_modules)/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }

    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(),
  ]
};
