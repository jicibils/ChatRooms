const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtract = require('mini-css-extract-plugin');

const basePath = __dirname;
const distPath = 'dist';

const indextInput = './public/index.html';
const indexOutput = 'index.html';

function webpackConfigGenerator(env) {
  const sourcemaps = !!env.development;

  const webpackInitConfig = {
    resolve: {
      extensions: ['.js']
    },
    entry: {
      app: ['@babel/polyfill', './src/index.js']
    },
    output: {
      path: path.join(basePath, distPath),
      // // filename: '[chunkhash][name].js',
      // // filename: mode === 'production' ? '[name].[chunkhash].js' : '[name].[hash].js',
      // filename: '[name].[hash].js',
      filename: 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css/,
          // exclude: /node_modules/,
          use: [
            MiniCSSExtract.loader,
            { loader: 'css-loader', options: { sourceMap: sourcemaps } },
            { loader: 'postcss-loader', options: { sourceMap: sourcemaps } }
          ]
        },
        {
          test: /\.scss/,
          exclude: /node_modules/,
          use: [
            MiniCSSExtract.loader,
            { loader: 'css-loader', options: { sourceMap: sourcemaps } },
            { loader: 'postcss-loader', options: { sourceMap: sourcemaps } },
            { loader: 'sass-loader', options: { sourceMap: sourcemaps } }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                // outputPath: 'assets/img/',
                // publicPath: 'assets/img/'
              }
            }
          ]
        }
      ]
    },
    devServer: {
      // historyApiFallback: true,
      historyApiFallback: {
        disableDotRule: true
      },
      port: 3000,
      open: true,
      contentBase: './',
      hot: true
      // proxy: {
      //   '/api': 'http://localhost:8888'
      //    '/graphql': 'http://localhost:8080'
      // }
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: indexOutput,
        template: indextInput
      }),
      new MiniCSSExtract({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env)
      })
    ]
  };
  return webpackInitConfig;
}
module.exports = webpackConfigGenerator;
