import path from 'path';
import { readFileSync } from 'fs';
import CopyPlugin from 'copy-webpack-plugin';
import { DefinePlugin, Configuration, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const appinsightsKeyDevelopment =
	'InstrumentationKey=a26d01a0-3b0c-4ed2-94a5-80c4548eb39d;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/';
const appinsightsKeyProduction =
	'InstrumentationKey=f957512e-0cd6-49c8-9e26-797dabb2cdb1;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/';

type DevMode = 'production' | 'development' | 'none';
type BuildTarget = 'node' | 'webworker';
type BuildOptions = {
	analyzeBundle?: boolean;
	useSwcBuild?: boolean;
	childProcessBreakpoints?: boolean;
};
type EnvObject = { [key: string]: boolean };

const getBuildMode = (maybeMode: string | undefined): DevMode => {
	switch (maybeMode) {
		case 'production':
			return 'production';
		case 'development':
			return 'development';
		case 'none':
		case undefined:
			return 'none';
		default:
			throw new Error(`Unknown build mode: ${maybeMode}`);
	}
};

const getWebpackConfig = (
	env: EnvObject,
	argv: { mode?: string },
): Configuration[] => {
	const mode = getBuildMode(argv.mode);

	const buildOptions: BuildOptions = {
		analyzeBundle: false,
		useSwcBuild: env.useSwcBuild ? env.useSwcBuild === true : false,
		childProcessBreakpoints: env.useSwcBuild ? env.useSwcBuild === true : false,
	};

	return [
		getExtensionConfig('node', mode, buildOptions),
		// getExtensionConfig('webworker', mode, env),
		// getWebviewsConfig(mode, env),
	];
};

export default getWebpackConfig;

function getExtensionConfig(
	target: BuildTarget,
	mode: DevMode,
	buildOptions: BuildOptions,
): Configuration {
	const plugins: WebpackPluginInstance[] = [
		new DefinePlugin({
			PRODUCTION: JSON.stringify(mode === 'production'),
			CHILDPROCESSBREAKPOINTS: buildOptions.childProcessBreakpoints === true,
			APPINSIGHTSKEY: JSON.stringify(
				mode === 'production'
					? appinsightsKeyProduction
					: appinsightsKeyDevelopment,
			),
		}),
		new CopyPlugin({
			patterns: [
				// Copy our own version of TS-Node to the vscode extension package
				{
					from: path.posix.join(
						__dirname.replace(/\\/g, '/'),
						'..',
						'buildTools',
						'ts-node-stripper',
						'out',
						'ts-node-installation',
					),
					to: path.posix.join(
						__dirname.replace(/\\/g, '/'),
						'dist',
						'ts-node-installation',
					),
				},
			],
		}),
	];

	if (mode !== 'production' && buildOptions.analyzeBundle) {
		plugins.push(new BundleAnalyzerPlugin());
	} else if (mode === 'production') {
		const packageJsonFile = readFileSync('./package.json', {
			encoding: 'utf-8',
		});
		const packageJson = JSON.parse(packageJsonFile);
		const extensionVersion = packageJson.version;
		plugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				openAnalyzer: false,
				reportFilename: path.join(
					'..',
					'publish',
					`VSCode_extension_production_bundle_report_${extensionVersion}.html`,
				),
			}),
		);
	}

	return {
		name: `extension:${target}`,
		entry: {
			functionRunner: './src/extension.ts',
		},
		mode: mode,
		target: target,
		devtool: mode === 'production' ? false : 'source-map',
		output: {
			path:
				target === 'webworker'
					? path.join(__dirname, 'dist', 'browser')
					: path.join(__dirname, 'dist'),
			libraryTarget: 'commonjs2',
			filename: '[name].js',
			// chunkFilename: '[id].[chunkhash].js',
		},
		externals: {
			vscode: 'commonjs vscode',
			// applicationinsights-native-metrics is not present for @vscode/extension-telemetry.
			// Without this line a warning is given when bundling the VSCode extension
			// https://github.com/microsoft/vscode-extension-telemetry/issues/41
			'applicationinsights-native-metrics':
				'commonjs applicationinsights-native-metrics',
		},
		module: {
			rules: [
				{
					exclude: /(node_modules|\.d\.ts$)/,
					include: [path.join(__dirname, '..')],
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
										// target: 'ES2020',
									},
								},
							}
						: {
								loader: 'ts-loader',
								options: {
									configFile: path.join(
										__dirname,
										target === 'webworker'
											? 'tsconfig.browser.json'
											: 'tsconfig.json',
									),
									experimentalWatchApi: true,
									transpileOnly: true,
								},
							},
				},
			],
			// https://github.com/microsoft/TypeScript/issues/39436
			noParse: [require.resolve('typescript/lib/typescript.js')],
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
					? {
							child_process: false,
							crypto: require.resolve('crypto-browserify'),
							fs: false,
							os: false,
							path: require.resolve('path-browserify'),
							process: false,
							stream: false,
							url: false,
						}
					: undefined,
			mainFields:
				target === 'webworker'
					? ['browser', 'module', 'main']
					: ['module', 'main'],
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		},
		plugins: plugins,
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
