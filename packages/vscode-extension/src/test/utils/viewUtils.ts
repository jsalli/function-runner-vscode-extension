import {
	LanguageHandler,
	NotSupportedFunction,
	RunnableFunction,
	normalizePath,
} from '@functionrunner/shared';
import {
	Range,
	TextDocument,
	TextEdit,
	ViewColumn,
	window,
	workspace,
	WorkspaceEdit,
} from 'vscode';
import { Commands, Command } from '../../commands/Command';
import {
	OpenInputSetViewArgs,
	OpenInputSetViewReturn,
} from '../../commands/openInputSetView';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { sleepMilliSeconds } from './utils';
import { createFile } from './fileUtils';
import {
	isJsTsTextDocument,
	JsTsTextDocument,
} from '@functionrunner/javascript-typescript-shared';
import { container } from 'tsyringe';

export async function openSourceFileAndInputView(
	sourceFilePath: string,
	functionNameToOpen: string,
): Promise<{
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
	runnableFunction: RunnableFunction;
}> {
	const document = await openDocument({ sourceFilePath });
	const runnableFunction = await findRunnableFunction(
		document,
		functionNameToOpen,
	);
	await openInputView(runnableFunction);
	const fileAndFunctionIdentifier: FileAndFunctionIdentifier = {
		sourceFilePath: normalizePath(document.uri.fsPath),
		functionName: functionNameToOpen,
		languageId: document.languageId,
		documentIsUntitled: document.isUntitled,
	};
	return { fileAndFunctionIdentifier, runnableFunction };
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
		await languageHandler.findRunnableFunctions(sourceFileDocument);

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
	inputOutputViewContentOverride?: string,
): Promise<void> {
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

	if (inputOutputViewContentOverride) {
		const activeEditor = window.activeTextEditor;
		if (activeEditor == null) {
			throw new Error('No active editor');
		}
		await overrideDocumentContent(
			activeEditor.document,
			inputOutputViewContentOverride,
		);
	}
}

export async function closeAllOpenTextDocuments(): Promise<void> {
	// await commands.executeCommand('workbench.action.closeAllEditors');
}

async function overrideDocumentContent(
	document: TextDocument,
	newContent: string,
): Promise<void> {
	const textEdits: TextEdit[] = [];
	textEdits.push(TextEdit.replace(new Range(0, 0, 999, 999), newContent));
	const workEdits = new WorkspaceEdit();
	workEdits.set(document.uri, textEdits);
	await workspace.applyEdit(workEdits);
}

export async function openDocument({
	content,
	sourceFilePath,
}: {
	content?: string;
	sourceFilePath?: string;
}): Promise<JsTsTextDocument> {
	let document: TextDocument;
	if (content) {
		document = await workspace.openTextDocument({
			// language: languageId,
			content: content ? content : '',
		});
	} else if (sourceFilePath) {
		document = await workspace.openTextDocument(sourceFilePath);
	} else {
		throw new Error(
			'Neither "content" nor "sourceFilePath" provided to open TextDocument',
		);
	}

	await window.showTextDocument(document, { preview: false });
	if (sourceFilePath) {
		await document.save();
	}
	// This might fix a timing for some other problem giving "document.getText is not a function"
	await sleepMilliSeconds(200);

	if (!isJsTsTextDocument(document)) {
		throw new Error('Created document is not of type JsTsTextDocument');
	}

	return document;
}

export async function createAndOpenDocumentFromContent(
	filePathToCreate: string,
	fileContent: string,
): Promise<TextDocument> {
	await createFile(filePathToCreate, fileContent);
	const inputDocument = await openDocument({
		sourceFilePath: filePathToCreate,
	});
	return inputDocument;
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
