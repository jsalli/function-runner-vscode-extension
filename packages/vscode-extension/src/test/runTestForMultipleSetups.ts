/* eslint-disable no-console */
import { spawn, SpawnOptions, spawnSync, StdioOptions } from 'child_process';
import { type as platformType } from 'os';

const node18Version = 'v18.20.4';
const node20Version = 'v20.17.0';
const node22Version = 'v22.9.0';

type TestSetup = {
	nodeVersion: string;
	vsCodeVersion: string;
	testWorkspaceFixtureName: string;
};

const linuxOS = 'Linux';
const windowsOS = 'Windows_NT';
const macOS = 'Darwin';

const windowsShellPath =
	'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
const linuxShellPath = true;

const nvmInitilizingCommandLinux =
	'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"';

const testSetupList: TestSetup[] = [
	{
		nodeVersion: node18Version,
		vsCodeVersion: '1.93.1',
		testWorkspaceFixtureName: 'commonjsBasicTypescriptProjectNpm',
	},
	{
		nodeVersion: node20Version,
		vsCodeVersion: '1.93.1',
		testWorkspaceFixtureName: 'commonjsMonoRepoTypescriptProjectRushJs',
	},
	{
		nodeVersion: node22Version,
		vsCodeVersion: '1.93.1',
		testWorkspaceFixtureName: 'esModuleBasicJavascriptProjectPnpm',
	},
	{
		nodeVersion: node18Version,
		vsCodeVersion: '1.82.0',
		testWorkspaceFixtureName: 'esModuleBasicTypescriptProjectPnpm',
	},
	{
		nodeVersion: node20Version,
		vsCodeVersion: '1.82.0',
		testWorkspaceFixtureName: 'esModuleBasicTypescriptProjectYarn1',
	},
	{
		nodeVersion: node22Version,
		vsCodeVersion: '1.82.0',
		testWorkspaceFixtureName: 'esModuleBasicTypescriptProjectYarn1',
	},
	// This will need support for us to use Yarn's own typescript version which
	// reads the .zip source files of node packages
	// {
	// 	nodeVersion: 'v18.9.0',
	// 	vsCodeVersion: '1.72.0',
	// 	testWorkspaceFixtureName: 'esModuleBasicTypescriptProjectYarn3',
	// },
];

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

function runSetup(testSetup: TestSetup): Promise<void> {
	const osType = platformType();
	let command: string;
	switch (osType) {
		case macOS:
		case linuxOS:
			command = `${nvmInitilizingCommandLinux} && nvm use ${testSetup.nodeVersion} && node`;
			break;
		case windowsOS:
			command = `nvm use ${testSetup.nodeVersion}; node`;
			break;
		default:
			throw new Error('Unsupported operating system');
	}

	return new Promise((res, rej) => {
		const stdio: StdioOptions = ['pipe', 'pipe', 'pipe'];
		const options: SpawnOptions = {
			stdio,
			env: process.env,
			shell:
				platformType() === 'Windows_NT' ? windowsShellPath : linuxShellPath,
			// for non-windows: run in detached mode so the process will be the group leader and any subsequent process spawned
			// within can be later killed as a group to prevent orphan processes.
			// see https://nodejs.org/api/child_process.html#child_process_options_detached
			detached: process.platform !== 'win32',
		};
		const args = [
			'./out/test/runTest.js',
			testSetup.testWorkspaceFixtureName,
			testSetup.vsCodeVersion,
		];
		const childProcess = spawn(command, args, options);
		childProcess.stdout?.setEncoding('utf8');
		childProcess.stdout?.on('data', (stdout) => {
			console.log(`Test runner: ${stdout}`);
		});

		childProcess.stderr?.setEncoding('utf8');
		childProcess.stderr?.on('data', (stderr) => {
			console.error(`Test runner - Error: ${stderr.toString()}`);
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

async function runTestSuitesWithVersions(testSetupArr: TestSetup[]) {
	ensureNVM();

	console.log('=== NVM Found');

	for (const [index, testSetup] of testSetupArr.entries()) {
		console.log(
			`
\n==================================================================\n
=== Running tests ${index + 1}/${testSetupArr.length} with Node version ${
				testSetup.nodeVersion
			} and VSCode version ${testSetup.vsCodeVersion}
\n==================================================================\n
=== Running test workspace ${testSetup.testWorkspaceFixtureName}
\n==================================================================\n`,
		);
		// eslint-disable-next-line no-await-in-loop
		await runSetup(testSetup);
		console.log(`
\n==================================================================\n
=== Test setup done
\n==================================================================\n`);
	}
}

runTestSuitesWithVersions(testSetupList)
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
	});
