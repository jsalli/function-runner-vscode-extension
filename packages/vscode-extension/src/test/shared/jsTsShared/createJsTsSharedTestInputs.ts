import { join } from 'path';
import { FunctionRunningAndDebuggingTest } from '../defaultSuite/ui/functionRunningAndDebuggingTests/functionRunningAndDebuggingTestSet';
import { InputSetViewTest } from '../defaultSuite/ui/inputSetViewTests/inputSetViewTestSet';
import { SourceCodeLensTest } from '../defaultSuite/ui/sourceCodeLensTests/sourceCodeLensTestSet';

export const createJsTsSharedTestInputs = (
	sourceFileFolder: string,
	languageId: 'javascript' | 'typescript',
): {
	testWorkspaceFixtureName: string;
	testSourceCodeLens: SourceCodeLensTest[];
	testInputSetView: InputSetViewTest[];
	testFunctionRunningAndDebugging: FunctionRunningAndDebuggingTest[];
} => {
	const testWorkspaceFixtureName = process.env.TESTWORKSPACEFIXTURENAME;
	if (!testWorkspaceFixtureName) {
		throw new Error(
			'Environment variable "testWorkspaceFixtureName" was not set',
		);
	}

	const fileExtension = languageId === 'javascript' ? 'js' : 'ts';

	const testSourceCodeLens: SourceCodeLensTest[] = [
		{
			testWorkspaceFixtureName,
			fileName: `testFunctions1.${fileExtension}`,
			get srcCodeLensTestFilePath() {
				return join(sourceFileFolder, this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
		{
			testWorkspaceFixtureName,
			fileName: `testFunctions2.${fileExtension}`,
			get srcCodeLensTestFilePath() {
				return join(sourceFileFolder, this.fileName);
			},
			numberOfFoundFunctions: 3,
		},
	];
	const testInputSetView: InputSetViewTest[] = [
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: sourceFileFolder,
			srcFileName: `testFunctions1.${fileExtension}`,
			functionName: 'namedArrowFunction',
			expectedContentFileName: `expectedRunInputView.${fileExtension}`,
		},
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: sourceFileFolder,
			srcFileName: `testFunctions1.${fileExtension}`,
			functionName: 'default',
			expectedContentFileName: `expectedRunInputView.${fileExtension}`,
		},
	];

	const testFunctionRunningAndDebugging: FunctionRunningAndDebuggingTest[] = [
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot: sourceFileFolder,
			srcFileName: `testFunctions1.${fileExtension}`,
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
			srcFileFolderPathRelToTestProjectRoot: sourceFileFolder,
			srcFileName: `testFunctions1.${fileExtension}`,
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

	return {
		testWorkspaceFixtureName,
		testSourceCodeLens,
		testInputSetView,
		testFunctionRunningAndDebugging,
	};
};
