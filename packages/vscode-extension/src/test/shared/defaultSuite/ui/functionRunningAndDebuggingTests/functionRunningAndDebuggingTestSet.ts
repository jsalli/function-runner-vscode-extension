import { join, parse } from 'path';
import {
	createFile,
	deleteFile,
	readFileFromTestExpectsAndFixtures,
} from '../../../../utils/fileUtils';
import { runOrDebugFunctionAndAssert } from './runOrDebugFunctionAndAssert';
import {
	openDocument,
	openSourceFileAndInputView,
} from '../../../../utils/viewUtils';
import {
	commands,
	Range,
	TextDocument,
	TextEdit,
	workspace,
	WorkspaceEdit,
} from 'vscode';

export interface InputValueOverride {
	stringToLookFor: string;
	overrideString: string;
}

export interface FunctionRunningAndDebuggingTest {
	testWorkspaceFixtureName: string;
	srcFileFolderPathRelToTestProjectRoot: string;
	srcFileName: string;
	functionName: string;
	inputValueOverrides: InputValueOverride[];
	expectedFunctionOutputFileName: string;
}

const overrideInputValuesAndSaveToFile = async (
	inputSetViewDocument: TextDocument,
	inputValueOverrides: InputValueOverride[],
	sourceFilePath: string,
): Promise<TextDocument> => {
	const inputSetViewContent = inputSetViewDocument.getText();

	const textEdits: TextEdit[] = [];
	for (const inputValueOverride of inputValueOverrides) {
		const startIndex = inputSetViewContent.indexOf(
			inputValueOverride.stringToLookFor,
		);
		const endIndex = startIndex + inputValueOverride.stringToLookFor.length;
		const startPosition = inputSetViewDocument.positionAt(startIndex);
		const endPosition = inputSetViewDocument.positionAt(endIndex);

		textEdits.push(
			TextEdit.replace(
				new Range(startPosition, endPosition),
				inputValueOverride.overrideString,
			),
		);
	}

	const workEdits = new WorkspaceEdit();
	workEdits.set(inputSetViewDocument.uri, textEdits);
	await workspace.applyEdit(workEdits);

	const updatedInputSetViewContent = inputSetViewDocument.getText();

	const { dir, name, ext } = parse(sourceFilePath);
	const updatedInputSetViewFilePath = join(dir, `${name}inputSetView${ext}`);
	await createFile(updatedInputSetViewFilePath, updatedInputSetViewContent);

	const updatedInputSetViewDocument = await openDocument(
		updatedInputSetViewFilePath,
	);
	return updatedInputSetViewDocument;
};

export const functionRunningAndDebuggingTestSet = {
	name(
		{
			testWorkspaceFixtureName,
			srcFileName,
			functionName,
		}: FunctionRunningAndDebuggingTest,
		testMode: 'run' | 'debug',
	): string {
		return `Testing function ${testMode} for ${testWorkspaceFixtureName} - ${srcFileName} - ${functionName}`;
	},
	callback(
		{
			testWorkspaceFixtureName,
			srcFileFolderPathRelToTestProjectRoot,
			srcFileName,
			functionName,
			inputValueOverrides,
			expectedFunctionOutputFileName,
		}: FunctionRunningAndDebuggingTest,
		testMode: 'run' | 'debug',
	): () => Promise<void> {
		return async () => {
			// Path relative to testExpectsAndFixtures-folder
			const expectedFunctionRunAndDebugOutputPath = join(
				`${parse(srcFileName).name}.${functionName}`,
				expectedFunctionOutputFileName,
			);

			const expectedFunctionRunAndDebugOutput =
				await readFileFromTestExpectsAndFixtures(
					testWorkspaceFixtureName,
					expectedFunctionRunAndDebugOutputPath,
				);

			const {
				fileAndFunctionIdentifier,
				inputSetViewDocument,
				sourceFileDocument,
			} = await openSourceFileAndInputView(
				testWorkspaceFixtureName,
				srcFileFolderPathRelToTestProjectRoot,
				srcFileName,
				functionName,
			);

			const sourceFilePath = sourceFileDocument.uri.fsPath;
			const updatedInputSetViewDocument =
				await overrideInputValuesAndSaveToFile(
					inputSetViewDocument,
					inputValueOverrides,
					sourceFilePath,
				);
			const inputSetViewDocumentFilePath =
				updatedInputSetViewDocument.uri.fsPath;

			if (testMode === 'debug') {
				await commands.executeCommand(
					'workbench.debug.viewlet.action.removeAllBreakpoints',
				);
			}

			await runOrDebugFunctionAndAssert({
				expectedFunctionRunAndDebugOutput,
				functionName,
				fileAndFunctionIdentifier,
				testMode,
			});

			await deleteFile(inputSetViewDocumentFilePath);
		};
	},
};
