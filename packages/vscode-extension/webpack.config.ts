//@ts-check
import path from 'path';
import { readFileSync } from 'fs';
import CopyPlugin from 'copy-webpack-plugin';
import { DefinePlugin, Configuration, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

type DevMode = 'production' | 'development' | 'none';
type BuildTarget = 'node';
type BuildOptions = {
	analyzeBundle?: boolean;
	useSwcBuild?: boolean;
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
	};

	return [
		getExtensionConfig('node', mode, buildOptions),
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
			path: path.join(__dirname, 'dist'),
			libraryTarget: 'commonjs2',
			filename: '[name].js',
			devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
			// chunkFilename: '[id].[chunkhash].js',
		},
		externals: {
			vscode: 'commonjs vscode',
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
			noParse: [require.resolve('typescript/lib/typescript.js')],
		},
		resolve: {
			alias: {
				'@env': path.resolve(
					__dirname,
					'src',
					'env',
					target
				),
			},
			fallback: undefined,
			mainFields: ['module', 'main'],
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
