const webpack = require("webpack")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
  mode:'production',
  entry: {
    bundle: [
      "@babel/polyfill", 
      "./src/index"
    ],
    vendor: [
      "react", 
      "react-dom", 
      "react-router-dom",
      'mobx',
      'mobx-react',
    ],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: "/",
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].js"
  },
  // devtool: 'source-map',
  optimization:{
    minimizer:[
      new TerserPlugin({
        // sourceMap: true,
        // parallel: 8,
      }),
      new OptimizeCssAssetsPlugin()
    ],
    // runtimeChunk: {
    //   name: 'manifest'
    // },
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -20,
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'all',
          enforce: true
        }
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              // minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              plugins() {
                return [autoprefixer('last 2 version')];
              }
            }
          },
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[hash:base64:5]",
              sourceMap: false,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
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
      minify: { 
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      },
      // filename: "./index.html"
    }),
    new InlineManifestWebpackPlugin(),
    new MiniCssExtractPlugin({ 
      filename: 'assets/[name].[chunkhash:8].css', 
      // chunkFilename: "[id].css"
      // allChunks: true 
    }),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/public`,
        to: `${__dirname}/dist`
      },
    ]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn/),
  ],
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
      '@less': `${__dirname}/src/themes`
    }
  }
};