import { extensions } from 'vscode';
import { closeAllOpenTextDocuments } from '../../../utils/viewUtils';
// import { functionRunningAndDebugging } from './functionRunningAndDebuggingTests/functionRunningAndDebugging';
import {
	inputSetViewTestSet,
	InputSetViewCodeLensTest,
} from './inputSetViewTests/inputSetViewTestSet';
import {
	sourceCodeLensTestSet,
	SourceCodeLensTest,
} from './sourceCodeLensTests/sourceCodeLensTestSet';
import { container } from 'tsyringe';

export function defaultUITestSet(
	testWorkspaceFixtureName: string,
	sourceCodeLensTests: SourceCodeLensTest[],
	inputSetViewCodeLensTests: InputSetViewCodeLensTest[],
	// functionRunningTests: TestFunctionRunning[],
	// functionDebuggingTests: TestFunctionDebugging[],
): Promise<void> {
	return new Promise((res) => {
		suite(
			`Extension Test Suite. UI test for test project ${testWorkspaceFixtureName}`,
			() => {
				suiteSetup(async () => {
					await extensions
						.getExtension('functionrunner.function-runner-vscode-extension')
						?.activate();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const extensionContext = (global as any).testExtensionContext;
					container.registerInstance('ExtensionContext', extensionContext);
					await import('@functionrunner/shared'); // Register ConfigurationService to tsyringe
					await import('@functionrunner/javascript-typescript-handler'); // Register JsTsHandler to tsyringe
					await closeAllOpenTextDocuments();
				});

				suiteTeardown(async () => {
					await closeAllOpenTextDocuments();
					res();
				});

				// Testing source code codelens generation3,2
				for (const sourceCodeLensTestCase of sourceCodeLensTests) {
					test(
						sourceCodeLensTestSet.name(sourceCodeLensTestCase),
						sourceCodeLensTestSet.callback(sourceCodeLensTestCase),
					);
				}

				// Testing test and run input view creation
				for (const inputSetViewCodeLensTestCase of inputSetViewCodeLensTests) {
					test(
						inputSetViewTestSet.name(inputSetViewCodeLensTestCase),
						inputSetViewTestSet.callback(inputSetViewCodeLensTestCase),
					);
				}

				// // Testing function running
				// for (const testCase of testFunctionRunning) {
				// 	test(
				// 		functionRunningAndDebugging.name(
				// 			testWorkspaceFixtureName,
				// 			testCase.functionName,
				// 			'running',
				// 		),
				// 		functionRunningAndDebugging.callback(
				// 			testWorkspaceFixtureName,
				// 			testCase.srcFileFolderPathRelToTestProjectRoot,
				// 			testCase.srcFileName,
				// 			testCase.functionName,
				// 			'running',
				// 		),
				// 	);
				// }

				// // Testing function debugging
				// for (const testCase of testFunctionDebugging) {
				// 	test(
				// 		functionDebugging.name(
				// 			testWorkspaceFixtureName,
				// 			testCase.functionName,
				// 		),
				// 		functionDebugging.callback(
				// 			testWorkspaceFixtureName,
				// 			testCase.srcFileFolderPathRelToTestProjectRoot,
				// 			testCase.srcFileName,
				// 			testCase.functionName,
				// 		),
				// 	);
				// }
			},
		);
	});
}
