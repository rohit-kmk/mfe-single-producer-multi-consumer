'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

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
        /** The key should be named theme **/
        /** to match the name AEM is expecting for the JS file **/
        theme: SOURCE_ROOT + '/site/main.js'
    },
    output: {
        /** Based on the key above this will be theme.js **/
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
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
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer",
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
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
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx']
        }),
        new MiniCssExtractPlugin({
            /** The *.css filename with be theme.css **/
            filename: '[name].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                /** Resources will be moved to a folder name theme rather than clientlibs **/
                { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './theme' }
            ]
        }),
        new HtmlWebpackPlugin({  // <-- Add the HtmlWebpackPlugin here
            template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html'),  // Path to your HTML template
            filename: 'index.html',  // Output file name in the dist folder
            inject: 'body',  // Automatically inject the bundled JS file at the end of the body
        }),
		new ModuleFederationPlugin({
			name: 'main',
			filename: 'remoteEntry.js',
			remotes: {
				//app: "app@http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js"
				//app: "app@[globalModuleAppUrl]"
				app: `promise new Promise(resolve => {
						  //const urlParams = new URLSearchParams(window.location.search)
						  //const version = urlParams.get('app1VersionParam')
						  console.log('Building module url');
						  // This part depends on how you plan on hosting and versioning your federated modules
						  const remoteUrlWithVersion = 'http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js'
						  const script = document.createElement('script')
						  script.src = remoteUrlWithVersion
						  script.onload = () => {
							// the injected script has loaded and is available on window
							// we can now resolve this Promise
							const proxy = {
							  get: (request) => window.app.get(request),
							  init: (...arg) => {
								try {
								  return window.app.init(...arg)
								} catch(e) {
								  console.log('remote container already initialized')
								}
							  }
							}
							resolve(proxy)
						  }
						  // inject this script with the src set to the versioned remoteEntry.js
						  document.head.appendChild(script);
						})
					`,
			},
			exposes: {
			}
		}),
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
    },
	devServer: {
		proxy: [
			{
				context: ['/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules'],
				target: 'http://localhost:4502',
			},
		],
		headers: {
        'Access-Control-Allow-Origin': '*',  // Allow requests from any origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',  // Allow specific HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',  // Specific allowed headers
		},
	}
};
