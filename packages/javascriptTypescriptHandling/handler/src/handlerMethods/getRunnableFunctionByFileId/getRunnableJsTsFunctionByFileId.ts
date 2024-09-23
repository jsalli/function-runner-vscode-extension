import {
	FileAndFunctionIdentifier,
	normalizePath,
} from '@functionrunner/shared';
import {
	isJsTsTextDocument,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import { RunnableFunctionCache } from '@functionrunner/shared';
import { container } from 'tsyringe';
import { Uri, workspace } from 'vscode';
import { findRunnableJsTsFunctions } from '../findRunnableFunctions/findRunnableJsTsFunctions';

export const getRunnableJsTsFunctionByFileId = async (
	fileAndFunctionIdentifier: FileAndFunctionIdentifier,
): Promise<RunnableJsTsFunction> => {
	const runnableFunctionCache = container.resolve<
		RunnableFunctionCache<RunnableJsTsFunction>
	>(RunnableFunctionCache);
	const maybeRunnableFunction = runnableFunctionCache.getRunnableFunction(
		fileAndFunctionIdentifier,
	);
	if (maybeRunnableFunction !== undefined) {
		return maybeRunnableFunction;
	}
	const sourceFileUri = Uri.file(fileAndFunctionIdentifier.sourceFilePath);
	const document = await workspace.openTextDocument(sourceFileUri);
	if (!isJsTsTextDocument(document)) {
		throw new Error(
			`Given document is not Javascript nor Typescript document. Got languageId: ${document.languageId}`,
		);
	}
	const foundFunctions = findRunnableJsTsFunctions(document);

	runnableFunctionCache.addRunnableFunction(
		normalizePath(document.uri.fsPath),
		foundFunctions,
	);

	const maybeNowRunnableFunction = runnableFunctionCache.getRunnableFunction(
		fileAndFunctionIdentifier,
	);
	if (maybeNowRunnableFunction === undefined) {
		throw new Error(
			`Could not find function "${fileAndFunctionIdentifier.functionName}" from file "${fileAndFunctionIdentifier.sourceFilePath}"`,
		);
	}
	return maybeNowRunnableFunction;
};
