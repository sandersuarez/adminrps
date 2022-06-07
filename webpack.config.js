const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')
const { DefinePlugin } = require('webpack')

dotenv.config()

module.exports = {
  entry: path.resolve('./src-js/index'),
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
  },

  mode: process.env.NODE_ENV || 'development',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('./src-js/index.html'),
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    })
  ],

  devServer: {
    allowedHosts: ['lozandyloz.duckdns.org'],
    port: process.env.DEV_SERVER_PORT,
    proxy: {
      '/api': process.env.DEV_SERVER_PUBLIC_URL,
    },
  },
}
