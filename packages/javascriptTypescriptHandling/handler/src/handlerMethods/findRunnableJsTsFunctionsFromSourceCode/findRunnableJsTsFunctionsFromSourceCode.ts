import {
	NotSupportedFunction,
	normalizePath,
	RunnableFunctionCache,
} from '@functionrunner/shared';
import { createSourceFile, forEachChild, ScriptTarget } from 'typescript';
import {
	JsTsTextDocument,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import { findExportedFunctions } from './findExportedFunctions';
import { container } from 'tsyringe';

export const findRunnableJsTsFunctionsFromSourceCode = (
	document: JsTsTextDocument,
): (RunnableJsTsFunction | NotSupportedFunction)[] => {
	const foundFunctions: (RunnableJsTsFunction | NotSupportedFunction)[] = [];

	const sourceCode = document.getText();
	const tsSourceFile = createSourceFile(
		normalizePath(document.uri.fsPath),
		sourceCode,
		ScriptTarget.Latest,
		true,
	);

	forEachChild(
		tsSourceFile,
		findExportedFunctions(document, tsSourceFile, foundFunctions),
	);

	const testableFunctionCache = container.resolve(RunnableFunctionCache);
	testableFunctionCache.addRunnableFunction(
		normalizePath(document.uri.fsPath),
		foundFunctions,
	);
	return foundFunctions;
};
