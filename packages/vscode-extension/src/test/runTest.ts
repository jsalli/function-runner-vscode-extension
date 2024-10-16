/* eslint-disable no-console */
import { homedir } from 'os';
import * as path from 'path';
import { runTests } from '@vscode/test-electron';
import { getProjectFilesPathFromOutDir } from './utils/fileUtils';

// At runtime __dirname is at "out/test"-folder
async function main(testWorkspaceFixtureName: string, vsCodeVersion: string) {
	try {
		const testWorkspaceAbsPath = getProjectFilesPathFromOutDir(
			__dirname,
			testWorkspaceFixtureName,
		);

		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		const extensionTestsPath = path.resolve(
			__dirname,
			'mochaRunOneWorkspaceTestFixture',
		);

		process.env['TESTWORKSPACEFIXTURENAME'] = testWorkspaceFixtureName;
		// Download VS Code, unzip it and run the integration test
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			version: vsCodeVersion,
			launchArgs: [
				'--disable-extensions',
				'--user-data-dir',
				`${homedir()}/workspace/temp`,
				testWorkspaceAbsPath,
			],
			timeout: 30000,
		});
	} catch (err) {
		console.error('Failed to run tests');
		console.error('===============');
		console.error(err);
		console.error('===============');
		process.exit(1);
	}
}

const defaultTestWorkspaceFixtureName = 'TypescriptCommonjsNpm';
const defaultVsCodeVersion = '1.82.0';
const testWorkspaceFixtureName =
	process.argv[2] ?? defaultTestWorkspaceFixtureName;
const vsCodeVersion = process.argv[3] ?? defaultVsCodeVersion;

void main(testWorkspaceFixtureName, vsCodeVersion);
