import { extensions } from 'vscode';
import { closeAllOpenTextDocuments } from '../../../utils/viewUtils';
import {
	inputSetViewTestSet,
	InputSetViewTest,
} from './inputSetViewTests/inputSetViewTestSet';
import {
	sourceCodeLensTestSet,
	SourceCodeLensTest,
} from './sourceCodeLensTests/sourceCodeLensTestSet';
import { container } from 'tsyringe';
import {
	FunctionRunningAndDebuggingTest,
	functionRunningAndDebuggingTestSet,
} from './functionRunningAndDebuggingTests/functionRunningAndDebuggingTestSet';

const registerDependencies = async () => {
	await extensions
		.getExtension('functionrunner.function-runner-vscode-extension')
		?.activate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const extensionContext = (global as any).testExtensionContext;
	container.registerInstance('ExtensionContext', extensionContext);
	await import('@functionrunner/shared'); // Register ConfigurationService to tsyringe
	await import('@functionrunner/javascript-typescript-handler'); // Register JsTsHandler to tsyringe
};

export function defaultUITestSet(
	testWorkspaceFixtureName: string,
	sourceCodeLensTests: SourceCodeLensTest[],
	inputSetViewTests: InputSetViewTest[],
	functionRunningAndDebuggingTests: FunctionRunningAndDebuggingTest[],
): Promise<void> {
	return new Promise((res) => {
		suite(
			`Extension Test Suite. UI test for test project ${testWorkspaceFixtureName}`,
			() => {
				suiteSetup(async () => {
					await registerDependencies();
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
				for (const inputSetViewTestCase of inputSetViewTests) {
					test(
						inputSetViewTestSet.name(inputSetViewTestCase),
						inputSetViewTestSet.callback(inputSetViewTestCase),
					);
				}

				// Testing function running
				for (const functionRunningTestCase of functionRunningAndDebuggingTests) {
					test(
						functionRunningAndDebuggingTestSet.name(
							functionRunningTestCase,
							'run',
						),
						functionRunningAndDebuggingTestSet.callback(
							functionRunningTestCase,
							'run',
						),
					);
				}

				// Testing function debugging
				for (const functionDebuggingTestCase of functionRunningAndDebuggingTests) {
					test(
						functionRunningAndDebuggingTestSet.name(
							functionDebuggingTestCase,
							'debug',
						),
						functionRunningAndDebuggingTestSet.callback(
							functionDebuggingTestCase,
							'debug',
						),
					);
				}
			},
		);
	});
}
