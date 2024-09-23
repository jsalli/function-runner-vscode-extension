import {
	NamedExport,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import { CodePosition, NotSupportedFunction } from '@functionrunner/shared';
import { ArrowFunction, SourceFile, VariableDeclaration } from 'typescript';
// import { testableFunctionId } from '../../../utils/utils';
import { getBindingName } from './common';
import { createNotSupportedFunction } from './createNotSupportedFunction';
import { parseArrowFunction } from './parseArrowFunction';

export function runnableFuncFromNamedExportArrowFunc(
	node: VariableDeclaration,
	codePosition: CodePosition,
	languageId: 'typescript' | 'javascript',
	sourceFile: SourceFile,
	sourceFilePath: string,
): RunnableJsTsFunction | NotSupportedFunction {
	const functionType = new NamedExport();
	const name = getBindingName(node.name);
	// const id = testableFunctionId(sourceFile.fileName, name);
	// const sourceFilePath = normalizePath(sourceFile.fileName);

	try {
		const partialFunc = parseArrowFunction(
			node.initializer! as ArrowFunction, // TODO: fix type to have initializer as ArrowFunction
			sourceFile,
		);

		const newFunc = new RunnableJsTsFunction(
			name,
			codePosition,
			sourceFilePath,
			languageId,
			partialFunc.async,
			partialFunc.generator,
			partialFunc.args,
			partialFunc.returnValue,
			functionType,
			undefined,
		);
		return newFunc;
	} catch (error) {
		return createNotSupportedFunction(error, {
			name,
			codePosition,
			sourceFilePath,
			languageId,
		});
	}
}
