/* eslint-disable no-console */
import { spawn, SpawnOptions, spawnSync, StdioOptions } from 'child_process';
import { type as platformType } from 'os';
import pLimit from 'p-limit';
import { exit } from 'process';

const testingInCloudPipeline = process.env.TESTING_IN_CLOUD_PIPELINE === 'true';

const node18VersionForLocalTesting = 'v18.20.4';
const node20VersionForLocalTesting = 'v20.17.0';
const node22VersionForLocalTesting = 'v22.9.0';
const nodeVersionsForLocalTesting = [
	node18VersionForLocalTesting,
	node20VersionForLocalTesting,
	node22VersionForLocalTesting,
];

const latestVsCodeVersion = '1.94.2';
const earliestSupportedVsCodeVersion = '1.82.0';

type TestFixture = {
	vsCodeVersion: string;
	testWorkspaceFixtureName: string;
};

type TestSetup = {
	nodeVersion: string | undefined;
	testFixtures: TestFixture[];
};

const linuxOS = 'Linux';
const windowsOS = 'Windows_NT';
const macOS = 'Darwin';

const windowsShellPath = 'C:\\Program Files\\Git\\bin\\bash.exe';
const linuxShellPath = true;

const stdio: StdioOptions = ['pipe', 'pipe', 'pipe'];
const options: SpawnOptions = {
	stdio,
	env: process.env,
	shell: platformType() === 'Windows_NT' ? windowsShellPath : linuxShellPath,
	// for non-windows: run in detached mode so the process will be the group leader and any subsequent process spawned
	// within can be later killed as a group to prevent orphan processes.
	// see https://nodejs.org/api/child_process.html#child_process_options_detached
	detached: process.platform !== 'win32',
};

const nvmInitilizingCommandLinux =
	'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"';

const testFixtures: TestFixture[] = [
	{
		vsCodeVersion: latestVsCodeVersion,
		testWorkspaceFixtureName: 'TypescriptCommonjsNpm',
	},
	{
		vsCodeVersion: latestVsCodeVersion,
		testWorkspaceFixtureName: 'TypescriptCommonjsMonoRepoRushJs',
	},
	{
		vsCodeVersion: latestVsCodeVersion,
		testWorkspaceFixtureName: 'JavascriptEsModuleNpm',
	},
	{
		vsCodeVersion: earliestSupportedVsCodeVersion,
		testWorkspaceFixtureName: 'TypescriptEsModulePnpm',
	},
	{
		vsCodeVersion: earliestSupportedVsCodeVersion,
		testWorkspaceFixtureName: 'TypescriptEsModuleYarn4',
	},
];

const testSetups: TestSetup[] =
	testingInCloudPipeline === true
		? [{ nodeVersion: undefined, testFixtures }]
		: nodeVersionsForLocalTesting.map((nodeVersion) => ({
				nodeVersion,
				testFixtures,
			}));

function isNotAnError(message: string): boolean {
	const nvmAlreadyInstalled = ' is already installed.';
	const nvmResolvingVersion = 'Resolving version...';
	const nvmValidatedVersion = 'Validated version: ';
	const nvmFoundExistingInstall = 'Found existing install in ';
	return [
		nvmAlreadyInstalled,
		nvmResolvingVersion,
		nvmValidatedVersion,
		nvmFoundExistingInstall,
	].some((notAnError) => message.includes(notAnError));
}

function ensureNVM() {
	let nvmCheckCommand: string;
	const osType = platformType();
	switch (osType) {
		case linuxOS:
		case macOS:
			nvmCheckCommand = `${nvmInitilizingCommandLinux} && nvm --version`;
			break;
		case windowsOS:
			nvmCheckCommand = 'nvm --version';
			break;
		default:
			throw new Error('Unsupported operating system');
	}

	const errorMessage =
		'\n\nnvm program could not be found. Make sure:\n  -https://github.com/coreybutler/nvm-windows is installed in Windows\nor\n  -https://github.com/nvm-sh/nvm in Linux.\n\n';

	try {
		const { stderr } = spawnSync(nvmCheckCommand, [], {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
			env: process.env,
			shell: true,
		});
		if (
			stderr.includes('command not found') ||
			stderr.includes('is not recognized')
		) {
			throw new Error(errorMessage);
		}
		// console.log(stdout);
		return;
	} catch (error) {
		console.log('error');
		console.log(error);
		throw new Error(errorMessage);
	}
}

function getNvmNodeInstallAndUseCommand(nodeVersion: string): string {
	let command: string;
	const osType = platformType();
	switch (osType) {
		case macOS:
		case linuxOS:
			command = `${nvmInitilizingCommandLinux} && nvm install ${nodeVersion} && nvm use ${nodeVersion}`;
			break;
		case windowsOS:
			command = `nvm install ${nodeVersion} && nvm use ${nodeVersion}`;
			break;
		default:
			throw new Error('Unsupported operating system');
	}
	return command;
}

function runTestFixtureInitializationsForOneNodeVersion(
	nvmNodeInstallAndUseCommand?: string,
): Promise<void> {
	let command = '. ./scripts/init-test-fixtures.sh';
	if (nvmNodeInstallAndUseCommand) {
		command = `${nvmNodeInstallAndUseCommand} && ${command}`;
	}

	return new Promise((res, rej) => {
		const childProcess = spawn(command, options);

		childProcess.stdout?.setEncoding('utf8');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		childProcess.stdout?.on('data', (stdout) => {
			// console.log(`init-test-fixtures: ${stdout}`);
		});

		childProcess.stderr?.setEncoding('utf8');
		childProcess.stderr?.on('data', (stderr) => {
			const message = stderr.toString();
			if (isNotAnError(message)) {
				// console.log(`init-test-fixtures: ${message}`);
			} else {
				console.error(`init-test-fixtures - Error: ${message}`);
			}
		});
		childProcess.on('close', (exitCode): void => {
			switch (exitCode) {
				case null: {
					const message = 'init-test-fixtures exit code';
					console.log(message);
					return rej(message);
				}
				case 0: {
					// console.log(`init-test-fixtures exited successfully`);
					return res();
				}
				default: {
					const message = `init-test-fixtures exited with error exit code: ${exitCode}`;
					console.log(message);
					return rej(message);
				}
			}
		});

		childProcess.on('error', (error) => {
			console.log(`init-test-fixtures reported an error:\n ${error.message}`);
			return rej(error);
		});
	});
}

async function runTestFixtureInitializations(
	testSetupArray: TestSetup[],
): Promise<void> {
	if (testingInCloudPipeline === false) {
		ensureNVM();
		// console.log('=== NVM Found');
		const initializeLimiter = pLimit(3);
		const testFixtureInitializationsPromises = testSetupArray.map(
			({ nodeVersion }) =>
				initializeLimiter(() => {
					let nvmNodeInstallAndUseCommand: string | undefined = undefined;
					if (nodeVersion) {
						nvmNodeInstallAndUseCommand =
							getNvmNodeInstallAndUseCommand(nodeVersion);
					}
					return runTestFixtureInitializationsForOneNodeVersion(
						nvmNodeInstallAndUseCommand,
					);
				}),
		);
		await Promise.all(testFixtureInitializationsPromises);
	} else {
		await runTestFixtureInitializationsForOneNodeVersion();
	}
}

async function runSetup(
	testFixture: TestFixture,
	nodeVersion: string | undefined,
): Promise<void> {
	let command = 'node';
	if (nodeVersion !== undefined) {
		command = `${getNvmNodeInstallAndUseCommand(nodeVersion)} && ${command}`;
	}

	const args = [
		'./out/test/runTest.js',
		testFixture.testWorkspaceFixtureName,
		testFixture.vsCodeVersion,
	];

	return new Promise((res, rej) => {
		const childProcess = spawn(command, args, options);
		childProcess.stdout?.setEncoding('utf8');
		childProcess.stdout?.on('data', (stdout) => {
			console.log(`Test runner: ${stdout}`);
		});

		childProcess.stderr?.setEncoding('utf8');
		childProcess.stderr?.on('data', (stderr) => {
			const message = stderr.toString();
			if (isNotAnError(message)) {
				console.log(`Test runner: ${message}`);
			} else {
				console.error(`Test runner - Error: ${message}`);
			}
		});
		childProcess.on('close', (exitCode): void => {
			switch (exitCode) {
				case null: {
					const message = 'Test runner sent no exit code';
					console.log(message);
					return rej(message);
				}
				case 0: {
					console.log(`Test runner exited successfully`);
					return res();
				}
				default: {
					const message = `Test runner exited with error exit code: ${exitCode}`;
					console.log(message);
					return rej(message);
				}
			}
		});

		childProcess.on('error', (error) => {
			console.log(`Test runner reported an error:\n ${error.message}`);
			return rej(error);
		});
	});
}

async function runTestSuitesWithVersions(testSetupArray: TestSetup[]) {
	await runTestFixtureInitializations(testSetupArray);

	const testRunnerLimiter = pLimit(1);
	const testRunnerPromises = testSetupArray.flatMap((testSetup) =>
		testSetup.testFixtures.map((testFixture, testIndex) =>
			testRunnerLimiter(() => {
				const nodeVersion = testSetup.nodeVersion
					? testSetup.nodeVersion
					: process.versions.node;
				console.log(
					`=== Running test fixture ${testIndex + 1}/${testFixtures.length} with Node version ${
						nodeVersion
					} and VSCode version ${testFixture.vsCodeVersion}
=== Running test workspace ${testFixture.testWorkspaceFixtureName}`,
				);

				return runSetup(testFixture, testSetup.nodeVersion).then(() => {
					console.log(
						`=== Test setup ${testFixture.testWorkspaceFixtureName} done`,
					);
				});
			}),
		),
	);
	await Promise.all(testRunnerPromises);
}

runTestSuitesWithVersions(testSetups)
	.then(() => {
		console.log(`
	\n==================================================================\n
	=== All tests run
	\n==================================================================\n`);
	})
	.catch((error) => {
		console.log(`
	\n==================================================================\n
	=== Errors running E2E tests
	\n==================================================================\n`);
		console.error(error);
		exit(1);
	});
