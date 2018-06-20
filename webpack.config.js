const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const autoprefixer = require('autoprefixer')

module.exports = {
  mode:'development',
  // devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: `${__dirname}/dist`,
    publicPath: "/",
    filename: "main.js",
  },
  devServer:{
    hot: true,
    contentBase: `${__dirname}/public`,// path.resolve(__dirname, 'public'),
    port: 4120,
    host: '0.0.0.0',
    publicPath: '/',
    historyApiFallback: true,
    disableHostCheck: true,
    proxy: {
      '/v1': {
        target: 'http://localhost:1337',
        secure: false
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins() {
                return [autoprefixer('last 2 version')];
              }
            }
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'less-loader?sourceMap'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    optipng: {
                        optimizationLevel: 7,
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    }
                }
            }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: false,
      template: './src/index.ejs',
      // filename: "./index.html"
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn/),
  ],
  resolve: {
    alias: {
      '@less': `${__dirname}/src/themes`,
      components: `${__dirname}/src/components`,
      utils: `${__dirname}/src/utils`,
      config: `${__dirname}/src/utils/config`,
    }
  }
};