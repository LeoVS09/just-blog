var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    poststylus = require('poststylus'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: "bundle-[hash].js",
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
                    ]
                })
            },
            {
                test: /\.(gif|png|svg|jpe?g)$/i,
                loaders: [
                    'file-loader?name=./images/[hash].[ext]',
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
        new HtmlWebpackPlugin({template: './src/index.pug'}), //inject: "head"
        new ExtractTextPlugin('styles-[contenthash].css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer'])]
                }
            }
        })
    ]
};