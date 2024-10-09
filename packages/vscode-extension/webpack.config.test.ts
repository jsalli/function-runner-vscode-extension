//@ts-check
import { glob } from 'glob';
import path from 'path';
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';
import { WebpackPluginInstance, DefinePlugin, Configuration } from 'webpack';

type BuildTarget = 'node';
type BuildOptions = {
	useSwcBuild?: boolean;
};
type EnvObject = { [key: string]: boolean };

// const verdorChunkName = 'verdor';

function parseProjectNameFromTestPath(pathToTest: string) {
		const matchResults = pathToTest.match(
		new RegExp('testProjectFixtures/(.*)/suite'),
	);
	if (matchResults == null) {
		throw new Error(`Could not parse projectName from string: "${pathToTest}"`);
	}
	const projectName = matchResults[1];
	return projectName;
}



const getWebpackConfig = (
	env: EnvObject,
): Configuration[] => {
	const buildOptions: BuildOptions = {
		useSwcBuild: env.useSwcBuild ? env.useSwcBuild === true : false,
	};

	return [
		getExtensionConfig('node', buildOptions),
	];
};

export default getWebpackConfig;

function getExtensionConfig(
	target: BuildTarget,
	buildOptions: BuildOptions,
): Configuration {
	const plugins: WebpackPluginInstance[] = [
		new DefinePlugin({
			PRODUCTION: 'false',
		}),
		new CleanPlugin({ cleanOnceBeforeBuildPatterns: ['out/**'] }),
	];

	return {
		name: `tests:${target}`,
		entry: {
			runTestForMultipleSetups: './src/test/runTestForMultipleSetups.ts',
			runTest: './src/test/runTest.ts',
			mochaRunOneWorkspaceTestFixture: './src/test/mochaRunOneWorkspaceTestFixture.ts',
			// ...glob
			// 	.sync('./src/test/testProjectFixtures/**/suite/index.ts')
			// 	.reduce(function (obj, e) {
			// 		const projectName = parseProjectNameFromTestPath(e);
			// 		obj[`suite/${projectName}/index`] = e;
			// 		return obj;
			// 	}, {}),
			...glob
				.sync('./src/test/testProjectFixtures/**/suite/**/*.test.ts')
				.reduce(function (obj: { [key: string]: string }, e: string) {
					const projectName = parseProjectNameFromTestPath(e);
					obj[`suite/${projectName}/${path.parse(e).name}`] = `./${e}`;
					return obj;
				}, {}),
		},
		mode: 'development',
		target: target,
		devtool: 'source-map',
		output: {
			path: path.join(__dirname, 'out', 'test'),
			filename: '[name].js',
			libraryTarget: 'commonjs2',
			chunkFilename: '[id].[chunkhash].js',
			sourceMapFilename: '[name].js.map',
		},
		externals: [
			{ vscode: 'commonjs vscode' },
			{ mocha: 'commonjs mocha' },
			{ typescript: 'commonjs typescript' },
		],
		module: {
			rules: [
				{
					exclude: /\.d\.ts$/,
					include: path.join(__dirname, '..'),
					test: /\.tsx?$/,
					use: buildOptions.useSwcBuild
					? {
							loader: 'swc-loader',
							options: {
								jsc: {
									parser: {
										syntax: 'typescript',
										decorators: true,
										sourceMaps: true,
									},
									transform: {
										legacyDecorator: true,
										decoratorMetadata: true,
									},
								},
							},
						}
					: {
							loader: 'ts-loader',
							options: {
								configFile: path.join(
									__dirname,
									'tsconfig.json',
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
					target,
				),
			},
			fallback: undefined,
			mainFields: ['module', 'main'],
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
