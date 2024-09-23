import { Range, TextDocument, TextEditor, window } from 'vscode';
import { LoggerService } from '@functionrunner/shared';
import { container } from 'tsyringe';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { createFileAndFunctionIdentifier } from './createFileAndFunctionIdentifier';

export function isActiveDocument(document: TextDocument): boolean {
	const editor = window.activeTextEditor;
	return editor != null && editor.document === document;
}

export function isVisibleDocument(document: TextDocument): boolean {
	if (window.visibleTextEditors.length === 0) return false;

	return window.visibleTextEditors.some((e) => e.document === document);
}

export function getRangesFromDocument(
	document: TextDocument,
	codeRanges: Range[],
): string[] {
	const codes = codeRanges.map((range) => document.getText(range));
	return codes;
}

/**
 * Create an unique id for function by combining path to the source file and the function's name
 *
 * @param filePathName
 * @param functionName
 * @returns string
 */
// export function runnableFunctionId(
// 	filePathName: string,
// 	functionName: string,
// ): string {
// 	return JSON.stringify({ filePath: filePathName, functionName: functionName });
// 	// return `${filePathName.replace(/[/\\\\]/gm, '_')}|${functionName}`;
// }

export function ensureActiveEditor(
	fileAndFunctionIdentifier: FileAndFunctionIdentifier,
): TextEditor {
	const activeEditor = window.activeTextEditor;
	if (activeEditor === undefined) {
		const message = 'Could not get active text editor';
		const error = new Error(message);
		const logger = container.resolve(LoggerService);
		logger.error(error, message);
		throw error;
	}

	const fileAndFunctionIdentifierActive = createFileAndFunctionIdentifier(
		activeEditor.document,
	);
	if (
		fileAndFunctionIdentifier.sourceFilePath !==
			fileAndFunctionIdentifierActive?.sourceFilePath ||
		fileAndFunctionIdentifier.functionName !==
			fileAndFunctionIdentifierActive?.functionName
	) {
		const message = `Active document did not have fileID fields which were requested.
		Expected filePath: "${fileAndFunctionIdentifier.sourceFilePath}" and functionName: "${
			fileAndFunctionIdentifier.functionName
		}"
		Received filePath: "${fileAndFunctionIdentifierActive?.sourceFilePath}" and functionName: "${
			fileAndFunctionIdentifierActive?.functionName
		}"
		Content: ${activeEditor.document.getText()}`;
		const error = new Error(message);
		const logger = container.resolve(LoggerService);
		logger.error(error, message, {
			dontSendErrorMessage: true,
			alternativeLogMessage:
				'Active document did not have fileID fields which were requested.',
		});
		throw error;
	}

	return activeEditor;
}

export function thenableToPromise<T>(thenable: Thenable<T>): Promise<T> {
	return new Promise<T>((res, rej) => {
		thenable.then(
			(value: T) => {
				res(value);
			},
			(reason: unknown) => {
				rej(reason);
			},
		);
	});
}

export function stringArraysMatch(arr1: string[], arr2: string[]): boolean {
	arr1 = arr1.sort();
	arr2 = arr2.sort();
	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;
}

interface Thenable<T> {
	then<TResult>(
		onfulfilled?: (value: T) => TResult | Thenable<TResult>,
		onrejected?: (reason: unknown) => TResult | Thenable<TResult>,
	): Thenable<TResult>;
	then<TResult>(
		onfulfilled?: (value: T) => TResult | Thenable<TResult>,
		onrejected?: (reason: unknown) => void,
	): Thenable<TResult>;
}
