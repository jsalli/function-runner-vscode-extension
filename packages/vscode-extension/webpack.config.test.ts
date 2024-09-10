//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @typedef {import('webpack').NormalModule} NormalModule **/

const { spawnSync } = require('child_process');
var fs = require('fs');
var glob = require('glob');
const path = require('path');
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const esbuild = require('esbuild');
const JSON5 = require('json5');
// const { DefinePlugin } = require('webpack');
const WebpackObfuscator = require('webpack-obfuscator');

const obfuscatorOptions = {
	compact: true,
	controlFlowFlattening: false,
	deadCodeInjection: true,
	deadCodeInjectionThreshold: 0.4,
	debugProtection: true,
	debugProtectionInterval: 0,
	disableConsoleOutput: true,
	identifierNamesGenerator: 'hexadecimal',
	log: false,
	numbersToExpressions: true,
	renameGlobals: false,
	selfDefending: false,
	simplify: true,
	splitStrings: true,
	stringArray: true,
	stringArrayCallsTransform: true,
	stringArrayEncoding: ['base64'],
	stringArrayIndexShift: true,
	stringArrayRotate: true,
	stringArrayShuffle: true,
	stringArrayWrappersCount: 2,
	stringArrayWrappersChainedCalls: true,
	stringArrayWrappersParametersMaxCount: 4,
	stringArrayWrappersType: 'function',
	stringArrayThreshold: 0.75,
	unicodeEscapeSequence: false,
};

const verdorChunkName = 'verdor';

/**
 * @param { string } pathToTest
 * @returns { string }
 */
function parseProjectNameFromTestPath(pathToTest) {
	const matchResults = pathToTest.match(
		new RegExp('testProjectFixtures/(.*)/suite'),
	);
	if (matchResults == null) {
		throw new Error(`Could not parse projectName from string: "${pathToTest}"`);
	}
	const projectName = matchResults[1];
	return projectName;
}

module.exports =
	/**
	 * @param {{ useEsbuild?: boolean; obfuscate?: boolean; } | undefined } env
	 * @param {{ mode: 'production' | 'development' | 'none' | undefined }} argv
	 * @returns { WebpackConfig[] }
	 */
	function (env, argv) {
		env = {
			useEsbuild: false,
			obfuscate: false,
			...env,
		};

		return [getExtensionConfig('node', env)];
	};

/**
 * @param { 'node' | 'webworker' } target
 * @param {{ analyzeBundle?: boolean; analyzeDeps?: boolean; useEsbuild?: boolean;  obfuscate?: boolean; squoosh?: boolean } } env
 * @returns { WebpackConfig }
 */
function getExtensionConfig(target, env) {
	/**
	 * @type WebpackConfig['plugins'] | any
	 */
	const plugins = [
		new CleanPlugin({ cleanOnceBeforeBuildPatterns: ['out/**'] }),
		// new ForkTsCheckerPlugin({
		// 	async: false,
		// 	// eslint: {
		// 	// 	enabled: true,
		// 	// 	files: 'src/**/*.ts',
		// 	// 	options: {
		// 	// 		// cache: true,
		// 	// 		cacheLocation: path.join(
		// 	// 			__dirname,
		// 	// 			target === 'webworker' ? '.eslintcache.browser' : '.eslintcache',
		// 	// 		),
		// 	// 		overrideConfigFile: path.join(
		// 	// 			__dirname,
		// 	// 			target === 'webworker' ? '.eslintrc.browser.json' : '.eslintrc.json',
		// 	// 		),
		// 	// 	},
		// 	// },
		// 	formatter: 'basic',
		// 	typescript: {
		// 		configFile: path.join(
		// 			__dirname,
		// 			target === 'webworker'
		// 				? 'tsconfig.test.browser.json'
		// 				: 'tsconfig.test.json',
		// 		),
		// 	},
		// }),
		// ,
	];

	if (env.obfuscate) {
		plugins.unshift(
			new WebpackObfuscator(obfuscatorOptions, [`*${verdorChunkName}*`]),
		);
	}

	return {
		name: `tests:${target}`,
		entry: {
			runTestForMultipleSetups: './src/test/runTestForMultipleSetups.ts',
			runTest: './src/test/runTest.ts',
			mochaRun: './src/test/mochaRun.ts',
			// ...glob
			// 	.sync('./src/test/testProjectFixtures/**/suite/index.ts')
			// 	.reduce(function (obj, e) {
			// 		const projectName = parseProjectNameFromTestPath(e);
			// 		obj[`suite/${projectName}/index`] = e;
			// 		return obj;
			// 	}, {}),
			...glob
				.sync('./src/test/testProjectFixtures/**/suite/**/*.test.ts')
				.reduce(function (obj, e) {
					const projectName = parseProjectNameFromTestPath(e);
					obj[`suite/${projectName}/${path.parse(e).name}`] = e;
					return obj;
				}, {}),
		},
		mode: 'development',
		target: target,
		devtool: 'source-map',
		output: {
			path:
				target === 'webworker'
					? path.join(__dirname, 'out', 'test', 'browser')
					: path.join(__dirname, 'out', 'test'),
			filename: '[name].js',
			libraryTarget: 'commonjs2',
			chunkFilename: '[id].[chunkhash].js',
			sourceMapFilename: '[name].js.map',
		},
		externals: [
			{ vscode: 'commonjs vscode' },
			{ mocha: 'commonjs mocha' },
			// { 'find-up': 'commonjs find-up' },
			{ typescript: 'commonjs typescript' },
			// applicationinsights-native-metrics is not present for @vscode/extension-telemetry.
			// Without this line a warning is given when bundling the VSCode extension
			// https://github.com/microsoft/vscode-extension-telemetry/issues/41
			{
				'applicationinsights-native-metrics':
					'commonjs applicationinsights-native-metrics',
			},
		],
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendorChunk: {
						test(
							/**
							 * @type NormalModule
							 */ module,
						) {
							if (module.resource && module.resource.match('find-up')) {
								return true;
							} else if (
								module.resource &&
								module.resource.match(/[\\/]node_modules[\\/]/)
							) {
								return true;
							}
							return false;
						},
						name: verdorChunkName,
						chunks: 'all',
					},
				},
			},
		},
		module: {
			rules: [
				// {
				// 	test: /\.ts$/,
				// 	exclude: [
				// 		path.resolve(
				// 			__dirname,
				// 			'./src/languageHandlers/javascriptTypescript/codeRunning',
				// 		),
				// 	],
				// },
				{
					exclude: /\.d\.ts$/,
					include: path.join(__dirname, '..'),
					test: /\.tsx?$/,
					use: env.useEsbuild
						? {
								loader: 'esbuild-loader',
								options: {
									implementation: esbuild,
									loader: 'ts',
									target: ['ES2018'],
									tsconfigRaw: resolveTSConfig(
										path.join(
											__dirname,
											target === 'webworker'
												? 'tsconfig.test.browser.json'
												: 'tsconfig.test.json',
										),
									),
								},
						  }
						: {
								loader: 'ts-loader',
								options: {
									configFile: path.join(
										__dirname,
										target === 'webworker'
											? 'tsconfig.test.browser.json'
											: 'tsconfig.test.json',
									),
									experimentalWatchApi: true,
									transpileOnly: true,
								},
						  },
				},
			],
			// https://github.com/microsoft/TypeScript/issues/39436
			noParse: [
				require.resolve('typescript/lib/typescript.js'),
				// /[\\/]node_modules[\\/]mocha[\\/]/,
			],
		},
		resolve: {
			alias: {
				'@env': path.resolve(
					__dirname,
					'src',
					'env',
					target === 'webworker' ? 'browser' : target,
				),
			},
			fallback:
				target === 'webworker'
					? { path: require.resolve('path-browserify') }
					: undefined,
			mainFields:
				target === 'webworker'
					? ['browser', 'module', 'main']
					: ['module', 'main'],
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		},
		plugins: plugins,
		infrastructureLogging: {
			level: 'log', // enables logging required for problem matchers
		},
		stats: {
			preset: 'errors-warnings',
			assets: true,
			colors: true,
			env: true,
			errorsCount: true,
			warningsCount: true,
			timings: true,
		},
	};
}

/**
 * @param { string } configFile
 * @returns { string }
 */
function resolveTSConfig(configFile) {
	const result = spawnSync(
		'npx',
		['tsc', `-p "${configFile}"`, '--showConfig'],
		{
			cwd: __dirname,
			encoding: 'utf8',
			shell: true,
		},
	);

	const data = result.stdout;
	const start = data.indexOf('{');
	const end = data.lastIndexOf('}') + 1;
	// const myData = data.substring(start, end);
	// console.log(`==Start=\n${myData}\n===END===`);
	const json = JSON5.parse(data.substring(start, end));
	return json;
}
