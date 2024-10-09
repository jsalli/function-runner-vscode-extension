/* eslint-disable no-console */
import 'reflect-metadata';
import { join } from 'path';
import { defaultUITestSet } from '../../../../shared/defaultSuite/ui/defaultUITests';
import type { SourceCodeLensTest } from '../../../../shared/defaultSuite/ui/sourceCodeLensTests/sourceCodeLensTestSet';
import type { InputSetViewCodeLensTest } from '../../../../shared/defaultSuite/ui/inputSetViewTests/inputSetViewTestSet';

async function runTests() {
	const testWorkspaceFixtureName = process.env.TESTWORKSPACEFIXTURENAME;
	if (!testWorkspaceFixtureName) {
		throw new Error(
			'Environment variable "testWorkspaceFixtureName" was not set',
		);
	}

	const testTypescriptSourceCodeLens: SourceCodeLensTest[] = [
		{
			testWorkspaceFixtureName,
			fileName: 'testFunctions1.ts',
			get srcCodeLensTestFilePath() {
				return join('src', this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
		{
			testWorkspaceFixtureName,
			fileName: 'testFunctions2.ts',
			get srcCodeLensTestFilePath() {
				return join('src', this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
	];
	const testTypescriptInputSetViewCodeLens: InputSetViewCodeLensTest[] = [
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: 'src',
			srcFileName: 'testFunctions1.ts',
			functionName: 'namedArrowFunction',
			expectedContentFileName: 'expectedRunInputView.ts',
		},
	];

	// const testFunctionRunning: TestFunctionRunning[] =
	// 	testTypescriptInputSetViewCodeLens;
	// const testFunctionDebugging: TestFunctionDebugging[] = [
	// 	{
	// 		srcFileFolderPathRelToTestProjectRoot: 'src',
	// 		srcFileName: 'createMessage.ts',
	// 		functionName: 'createMessage',
	// 		languageId: 'typescript',
	// 	},
	// 	{
	// 		srcFileFolderPathRelToTestProjectRoot: 'src/utils',
	// 		srcFileName: 'newLineModification.ts',
	// 		functionName: 'cutFromNewLine',
	// 		languageId: 'typescript',
	// 	},
	// ];

	try {
		await defaultUITestSet(
			testWorkspaceFixtureName,
			testTypescriptSourceCodeLens,
			testTypescriptInputSetViewCodeLens,
			// testFunctionRunning,
			// testFunctionDebugging,
		);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

void runTests();
