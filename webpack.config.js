var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HtmlWebpackPugPlugin = require('html-webpack-pug-plugin'),
    poststylus = require('poststylus'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill','./src/index.js'],
    output: {
        filename: "assets/js/bundle-[hash].js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: [/node_modules/, /build/]
            },
            {
                test: /\.(jade|pug)$/,
                use: ["pug-loader"],
                exclude: [/node_modules/]
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?importLoaders=1',
                        'stylus-loader'
                    ],
                    publicPath: '../../'
                })
            },
            {
                test: /\.(gif|png|svg|jpe?g)$/i,
                loaders: [
                    'file-loader?name=assets/images/[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            progressive: true,
                            optimizationLevel: 7,
                            interlaced: false,
                            pngquant: {
                                quality: '30-50',
                                speed: 5
                            },
                            mozjpeg: {
                                quality: 90
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            favicon: './src/favicon.ico',
            // filename: 'index.pug',
            // filetype: 'pug'
        }), //inject: "head"
        // new HtmlWebpackPlugin({
        //     template: './src/lol.pug',
        //     favicon: './src/favicon.ico',
        //     filename: 'lol.pug',
        //     filetype: 'pug'
        // }), //inject: "head"
        // new HtmlWebpackPugPlugin(),
        new ExtractTextPlugin('assets/stylesheet/styles-[contenthash].css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer'])]
                }
            }
        })
    ]
};