const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const common = {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.ts']
    },
    node: {
        Buffer: false
    },
    output: {
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
        },{
            test: /\.scss$/,
            use: [{
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

module.exports = [
    merge.smart(common, {
        entry: {
            client: path.resolve(__dirname, './client/src/app/app.element.ts')
        },
        output: {
            filename: 'assets/client.[chunkhash].js',
            chunkFilename: 'assets/[name].[chunkhash].js',
        },
        module: {
            rules: [{
                test: /\.(ts|tsx)?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            sourceMap: true
                        }
                    }
                }]
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './client/src/index.ejs'),
                chunksSortMode: 'none',
                inject: false,
                sw: true
            }),
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, './client/src/assets'),
                to: 'assets'
            }])
        ]
    }),
    merge.smart(common, {
        target: 'node',
        entry: path.resolve(__dirname, './server/src/app.ts'),
        externals: [nodeExternals()],
        node: {
            __filename: true,
            __dirname: false
        },
        output: {
            filename: 'server.js'
        },
        devtool: "inline-source-map",
        module: {
            exprContextRegExp: /^\.\/.*$/,
            unknownContextRegExp: /^\.\/.*$/,
            rules: [{
                test: /\.(ts|tsx)?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            sourceMap: true
                        }
                    }
                }]
            }]
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ]
    })
];