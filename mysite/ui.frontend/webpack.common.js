'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const ESLintPlugin = require('eslint-webpack-plugin');
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

const SOURCE_ROOT = __dirname + '/src/main/webpack';

const resolve = {
    extensions: ['.js', '.ts'],
    plugins: [new TSConfigPathsPlugin({
        configFile: './tsconfig.json'
    })]
};

module.exports = {
    resolve: resolve,
    entry: {
        site: SOURCE_ROOT + '/site/main.ts',
		web: SOURCE_ROOT + '/site/web.js'
    },
    output: {
        filename: (chunkData) => {
			console.log("chunkData", chunkData);
            return chunkData.chunk.name === 'dependencies' ? 'clientlib-dependencies/[name].js' : 'clientlib-[name]/[name].js';
        },
        path: path.resolve(__dirname, 'dist'),
		//publicPath: 'auto',
		chunkFilename: 'clientlib-dynamic-modules/resources/[name].js',
		publicPath: '/etc.clientlibs/mysite/clientlibs/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'glob-import-loader',
                        options: {
                            resolve: resolve
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                    },
                    {
                        loader: 'glob-import-loader',
                        options: {
                            resolve: resolve
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'glob-import-loader',
                        options: {
                            resolve: resolve
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx']
        }),
        new MiniCssExtractPlugin({
            filename: 'clientlib-[name]/[name].css',
			chunkFilename: 'clientlib-dynamic-modules/resources/[name].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './clientlib-site/' },
				{ from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './clientlib-web/' }
            ]
        }),
		new ModuleFederationPlugin({
			name: 'app',
			filename: 'clientlib-dynamic-modules/remoteEntry.js',
			remotes: {
				//app: "app@http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js"
				app: "app@[globalModuleAppUrl]"
			},
			exposes: {
				'./helloworld': SOURCE_ROOT + '/components/_mfehelloworld.js',
				'./prime': SOURCE_ROOT + '/site/index.js',
				'./data': SOURCE_ROOT + '/site/data.js'
			}
		}),
		new ExternalTemplateRemotesPlugin()
    ],
    stats: {
        assetsSort: 'chunks',
        builtAt: true,
        children: false,
        chunkGroups: true,
        chunkOrigins: true,
        colors: false,
        errors: true,
        errorDetails: true,
        env: true,
        modules: false,
        performance: true,
        providedExports: false,
        source: false,
        warnings: true
    }
};
