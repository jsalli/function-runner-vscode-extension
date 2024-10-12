/* eslint-disable no-console */
import 'reflect-metadata';
import { join } from 'path';
import { defaultUITestSet } from '../../../../shared/defaultSuite/ui/defaultUITests';
import type { SourceCodeLensTest } from '../../../../shared/defaultSuite/ui/sourceCodeLensTests/sourceCodeLensTestSet';
import type { InputSetViewTest } from '../../../../shared/defaultSuite/ui/inputSetViewTests/inputSetViewTestSet';
import { FunctionRunningAndDebuggingTest } from '../../../../shared/defaultSuite/ui/functionRunningAndDebuggingTests/functionRunningAndDebuggingTestSet';

async function runTests() {
	const testWorkspaceFixtureName = process.env.TESTWORKSPACEFIXTURENAME;
	if (!testWorkspaceFixtureName) {
		throw new Error(
			'Environment variable "testWorkspaceFixtureName" was not set',
		);
	}

	const testSourceCodeLens: SourceCodeLensTest[] = [
		{
			testWorkspaceFixtureName,
			fileName: 'testFunctions1.js',
			get srcCodeLensTestFilePath() {
				return join('src', this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
		{
			testWorkspaceFixtureName,
			fileName: 'testFunctions2.js',
			get srcCodeLensTestFilePath() {
				return join('src', this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
	];
	const testInputSetView: InputSetViewTest[] = [
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: 'src',
			srcFileName: 'testFunctions1.js',
			functionName: 'namedArrowFunction',
			expectedContentFileName: 'expectedRunInputView.js',
		},
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: 'src',
			srcFileName: 'testFunctions1.js',
			functionName: 'default',
			expectedContentFileName: 'expectedRunInputView.js',
		},
	];

	const testFunctionRunningAndDebugging: FunctionRunningAndDebuggingTest[] = [
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: 'src',
			srcFileName: 'testFunctions1.js',
			functionName: 'namedArrowFunction',
			inputValueOverrides: [
				{
					stringToLookFor: 'const myArg = undefined',
					overrideString: 'const myArg = "myString"',
				},
			],
			expectedFunctionOutputFileName: 'expectedFunctionRunAndDebugOutput.txt',
		},
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: 'src',
			srcFileName: 'testFunctions1.js',
			functionName: 'default',
			inputValueOverrides: [
				{
					stringToLookFor: 'const myArg = undefined',
					overrideString: 'const myArg = 5;',
				},
				{
					stringToLookFor: 'const secondArg = undefined',
					overrideString: 'const secondArg = "Hello"',
				},
			],
			expectedFunctionOutputFileName: 'expectedFunctionRunAndDebugOutput.txt',
		},
	];

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
