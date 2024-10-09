// 'import * as assert from 'assert';
// import { join, parse } from 'path';
// import {
// 	normalizePath,
// 	FileAndFunctionIdentifier,
// } from '@functionrunner/shared';
// import { Commands, Command } from '../../../../../commands/Command';
// import {
// 	deleteFile,
// 	getTestProjectRootPath,
// 	readFileFromTestExpectsAndFixtures,
// } from '../../../../utils/fileUtils';
// import {
// 	closeAllOpenTextDocuments,
// 	openDocument,
// 	createAndOpenDocumentFromContent,
// } from '../../../../utils/viewUtils';
// import { replaceValuesToOverride } from '../inputSetViewTests/getExpectedContent';
// import { sleepMilliSeconds } from '../../../../utils/utils';
// import {
// 	RunOrDebugInputSetsArgs,
// 	RunOrDebugInputSetsReturn,
// } from '../../../../../commands/runOrDebugInputSets';
// import { serializeError } from 'serialize-error';

// async function runOrDebugFunctionAndAssert({
// 	testProjectFixtureName,
// 	sourceFilePathFromTestProjectRoot,
// 	inputSetViewOverrideContentFileName,
// 	inputSetViewContentOverride,
// 	expectedFunctionRunOutput,
// 	functionName,
// 	languageId,
// 	testMode,
// }: {
// 	testProjectFixtureName: string;
// 	sourceFilePathFromTestProjectRoot: string;
// 	inputSetViewOverrideContentFileName: string;
// 	inputSetViewContentOverride: string;
// 	expectedFunctionRunOutput: string;
// 	functionName: string;
// 	languageId: string;
// 	testMode: 'running' | 'debugging';
// }) {
// 	const sourceFileDocument = await openDocument({
// 		sourceFilePath: sourceFilePathFromTestProjectRoot,
// 	});

// 	const fileAndFunctionIdentifier: FileAndFunctionIdentifier = {
// 		sourceFilePath: normalizePath(sourceFileDocument.uri.fsPath),
// 		functionName,
// 		documentIsUntitled: false,
// 		languageId,
// 	};

// 	// The fileId is dynamic and depends on the folder structure on your PC
// 	// so we need to replace it with the real value
// 	const updatedDebugInputViewOverride = replaceValuesToOverride(
// 		inputSetViewContentOverride,
// 		fileAndFunctionIdentifier,
// 	);

// 	const sourceFileFolder = parse(sourceFilePathFromTestProjectRoot).dir;
// 	const debugInputViewTextDocument = await createAndOpenDocumentFromContent(
// 		join(sourceFileFolder, inputSetViewOverrideContentFileName),
// 		updatedDebugInputViewOverride,
// 	);

// 	const args: RunOrDebugInputSetsArgs = {
// 		fileAndFunctionIdentifier,
// 		returnSuccessForTest: true,
// 		mode: 'debug',
// 	};

// 	let functionDebugSuccess: boolean = false;
// 	try {
// 		await Command.executeCommand<
// 			RunOrDebugInputSetsArgs,
// 			RunOrDebugInputSetsReturn
// 		>(Commands.RunOrDebugOneInputSets, args);
// 		functionDebugSuccess = true;
// 	} catch (error) {
// 		console.error(
// 			`Debugging failed with error:\n${error instanceof Error ? error.message : serializeError(error)}`,
// 		);
// 		functionDebugSuccess = false;
// 	}
// 	assert.strictEqual(
// 		functionDebugSuccess,
// 		true,
// 		`Debugging the function "${functionName}" crashed`,
// 	);

// 	await closeAllOpenTextDocuments();
// 	await deleteFile(debugInputViewTextDocument.uri.fsPath);

// 	// Try to fix the tests stalling issue do to some timing problem
// 	await sleepMilliSeconds(1000);
// }

// export const functionRunningAndDebugging = {
// 	name(
// 		testWorkspaceFixtureName: string,
// 		functionName: string,
// 		testMode: 'running' | 'debugging',
// 	): string {
// 		return `Testing function ${testMode} for ${testWorkspaceFixtureName} - ${functionName}`;
// 	},
// 	callback(
// 		testWorkspaceFixtureName: string,
// 		srcFileFolderPathRelToTestProjectRoot: string,
// 		srcFileName: string,
// 		functionName: string,
// 		testMode: 'running' | 'debugging',
// 	): () => Promise<void> {
// 		return async () => {
// 			let languageId: 'typescript' | 'javascript';
// 			if (srcFileName.endsWith('.ts')) {
// 				languageId = 'typescript';
// 			} else if (
// 				srcFileName.endsWith('.js') ||
// 				srcFileName.endsWith('.cjs') ||
// 				srcFileName.endsWith('.mjs')
// 			) {
// 				languageId = 'javascript';
// 			} else {
// 				throw new Error(`Unknown file type: "${srcFileName}"`);
// 			}

// 			// Path relative to testExpectsAndFixtures-folder
// 			const inputSetViewOverrideContentFileName = `runAndDebugInputSetViewToDebugWith${
// 				languageId === 'typescript' ? '.ts' : '.js'
// 			}`;
// 			const inputSetViewOverrideContentFilePath = join(
// 				`${parse(srcFileName).name}.${functionName}`,
// 				inputSetViewOverrideContentFileName,
// 			);
// 			const inputSetViewContentOverride =
// 				await readFileFromTestExpectsAndFixtures(
// 					testWorkspaceFixtureName,
// 					inputSetViewOverrideContentFilePath,
// 				);

// 			// Path relative to testExpectsAndFixtures-folder
// 			const expectedFunctionRunAndDebugOutputPath = join(
// 				`${parse(srcFileName).name}.${functionName}`,
// 				'expectedFunctionRunAndDebugOutput.txt',
// 			);

// 			const expectedFunctionRunOutput =
// 				await readFileFromTestExpectsAndFixtures(
// 					testWorkspaceFixtureName,
// 					expectedFunctionRunAndDebugOutputPath,
// 				);

// 			// Path relative to testExpectsAndFixtures-folder
// 			const sourceFilePathFromProjectRoot = join(
// 				srcFileFolderPathRelToTestProjectRoot,
// 				srcFileName,
// 			);
// 			const testProjectRootPath = getTestProjectRootPath(
// 				testWorkspaceFixtureName,
// 			);
// 			const sourceFilePathFromTestProjectRoot = join(
// 				testProjectRootPath,
// 				sourceFilePathFromProjectRoot,
// 			);

// 			await runOrDebugFunctionAndAssert({
// 				testProjectFixtureName: testWorkspaceFixtureName,
// 				sourceFilePathFromTestProjectRoot,
// 				inputSetViewOverrideContentFileName,
// 				inputSetViewContentOverride,
// 				expectedFunctionRunOutput,
// 				functionName,
// 				languageId,
// 				testMode,
// 			});
// 		};
// 	},
// };
// '
