import {
	LanguageHandler,
	NotSupportedFunction,
	RunnableFunction,
	normalizePath,
} from '@functionrunner/shared';
import { commands, TextDocument, ViewColumn, window, workspace } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import {
	OpenInputSetViewArgs,
	OpenInputSetViewReturn,
} from '../../commands/openInputSetView';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { sleepMilliSeconds } from './utils';
import { getTestProjectRootPath } from './fileUtils';
import { container } from 'tsyringe';
import { join } from 'path';

export async function openSourceFileAndInputView(
	testWorkspaceFixtureName: string,
	srcFileFolderPathRelToTestProjectRoot: string,
	srcFileName: string,
	functionNameToOpen: string,
): Promise<{
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
	runnableFunction: RunnableFunction;
	sourceFileDocument: TextDocument;
	inputSetViewDocument: TextDocument;
}> {
	const testProjectRootPath = getTestProjectRootPath(testWorkspaceFixtureName);
	const sourceFilePath = join(
		testProjectRootPath,
		srcFileFolderPathRelToTestProjectRoot,
		srcFileName,
	);

	const sourceFileDocument = await openDocument(sourceFilePath);
	const runnableFunction = await findRunnableFunction(
		sourceFileDocument,
		functionNameToOpen,
	);
	const inputSetViewDocument = await openInputView(runnableFunction);
	const fileAndFunctionIdentifier: FileAndFunctionIdentifier = {
		sourceFilePath: normalizePath(sourceFileDocument.uri.fsPath),
		functionName: functionNameToOpen,
		languageId: sourceFileDocument.languageId,
		documentIsUntitled: sourceFileDocument.isUntitled,
	};
	return {
		fileAndFunctionIdentifier,
		runnableFunction,
		sourceFileDocument,
		inputSetViewDocument,
	};
}

export async function findRunnableFunction(
	sourceFileDocument: TextDocument,
	functionNameToFind: string,
) {
	const languageHandlers =
		container.resolveAll<LanguageHandler>('LanguageHandler');

	const languageHandler = languageHandlers.find((langHandler) =>
		langHandler.isInterestedInThisLanguage(sourceFileDocument.languageId),
	);
	if (!languageHandler) {
		throw new Error(
			`Could not find language handler for languageId:  ${sourceFileDocument.languageId}`,
		);
	}

	const foundFunctions =
		await languageHandler.findRunnableFunctionsFromSourceCode(
			sourceFileDocument,
		);

	if (foundFunctions === undefined || foundFunctions.length === 0) {
		throw new Error(
			`Could not find runnable function from file "${sourceFileDocument.fileName}"`,
		);
	}

	const foundFunction = findRunnableFunctionByName(
		foundFunctions,
		functionNameToFind,
	);

	if (foundFunction instanceof NotSupportedFunction) {
		throw new Error(
			`First found function is of type "NotSupportedFunction" in file "${sourceFileDocument.fileName}"`,
		);
	}

	return foundFunction;
}

async function openInputView(
	runnableFunction: RunnableFunction,
): Promise<TextDocument> {
	const args: OpenInputSetViewArgs = {
		runnableFunction,
		showOptions: {
			viewColumn: ViewColumn.Beside,
		},
	};

	await Command.executeCommand<OpenInputSetViewArgs, OpenInputSetViewReturn>(
		Commands.OpenInputSetView,
		args,
	);

	const activeEditor = window.activeTextEditor;
	if (activeEditor == null) {
		throw new Error('No active editor');
	}
	return activeEditor.document;
}

export async function closeAllOpenTextDocuments(): Promise<void> {
	await commands.executeCommand('workbench.action.closeAllEditors');
}

export async function openDocument(
	sourceFilePath: string,
): Promise<TextDocument> {
	const document = await workspace.openTextDocument(sourceFilePath);

	await window.showTextDocument(document, { preview: false });
	// This might fix a timing for some other problem giving "document.getText is not a function"
	await sleepMilliSeconds(200);

	return document;
}

function findRunnableFunctionByName(
	functionsList: (RunnableFunction | NotSupportedFunction)[],
	functionNameToFind: string,
): RunnableFunction {
	const foundFunc = functionsList.find((func) => {
		if (func.name === functionNameToFind) {
			return true;
		}
		return false;
	});

	if (foundFunc instanceof NotSupportedFunction) {
		throw new Error(
			'Found function is not "RunnableFunction" kind. Got "NotSupportedFunction"',
		);
	}

	if (foundFunc === undefined) {
		throw new Error(
			`Could not find "RunnableFunction" with name ${functionNameToFind}`,
		);
	}

	return foundFunc;
}
