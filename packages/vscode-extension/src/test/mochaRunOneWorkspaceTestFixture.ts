/* eslint-disable no-console */
import * as path from 'path';
import { glob } from 'glob';
import Mocha from 'mocha';

// __dirname points to "out/test"-folder
export function run(): Promise<void> {
	const testWorkspaceFixtureName = process.env.TESTWORKSPACEFIXTURENAME;
	if (!testWorkspaceFixtureName) {
		throw new Error(
			'Environment variable "testWorkspaceFixtureName" was not set',
		);
	}
	const testSuitePath = path.join(__dirname, 'suite', testWorkspaceFixtureName);
	return mochaRun(testSuitePath);
}

export async function mochaRun(testsRoot: string): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
		timeout: 0,
		parallel: false,
	});

	const testFiles = await glob('**/**.test.js', { cwd: testsRoot });

	testFiles.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

	return new Promise((res, rej) => {
		try {
			// Run the mocha test
			mocha.run((failures) => {
				if (failures > 0) {
					console.error('=== Tests failed');
					return rej(new Error(`${failures} tests failed.`));
				}
				res();
			});
		} catch (error) {
			console.error('=== Error executing tests');
			console.error(error);
			rej(error);
		}
	});
}
