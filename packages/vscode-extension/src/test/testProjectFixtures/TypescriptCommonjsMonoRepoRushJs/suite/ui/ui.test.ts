/* eslint-disable no-console */
import 'reflect-metadata';
import { join } from 'path';
import { defaultUITestSet } from '../../../../shared/defaultSuite/ui/defaultUITests';
import { createJsTsSharedTestInputs } from '../../../../shared/jsTsShared/createJsTsSharedTestInputs';

async function runTests() {
	const {
		testWorkspaceFixtureName,
		testSourceCodeLens,
		testInputSetView,
		testFunctionRunningAndDebugging,
	} = createJsTsSharedTestInputs(
		join('packages', 'package1', 'src'),
		'typescript',
	);

	try {
		await defaultUITestSet(
			testWorkspaceFixtureName,
			testSourceCodeLens,
			testInputSetView,
			testFunctionRunningAndDebugging,
		);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

void runTests();
