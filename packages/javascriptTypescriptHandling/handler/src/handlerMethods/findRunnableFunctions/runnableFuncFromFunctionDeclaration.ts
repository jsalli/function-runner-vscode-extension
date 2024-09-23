import {
	DefaultExport,
	NamedExport,
	RunnableJsTsFunction,
	defaultExportFunctionName,
} from '@functionrunner/javascript-typescript-shared';
import { CodePosition, NotSupportedFunction } from '@functionrunner/shared';
import {
	FunctionDeclaration,
	getCombinedModifierFlags,
	ModifierFlags,
	SourceFile,
} from 'typescript';
// import { testableFunctionId } from '../../../utils/utils';
import { createNotSupportedFunction } from './createNotSupportedFunction';
import { parseFunctionDeclaration } from './parseFunctionDeclaration';

export function runnableFuncFromFunctionDeclaration(
	node: FunctionDeclaration,
	codePosition: CodePosition,
	languageId: 'typescript' | 'javascript',
	sourceFile: SourceFile,
	sourceFilePath: string,
): RunnableJsTsFunction | NotSupportedFunction {
	const functionType = getFunctionType(node);
	const name =
		node.name !== undefined ? node.name.text : defaultExportFunctionName;
	// const id = testableFunctionId(sourceFile.fileName, name);
	// const sourceFilePath = normalizePath(sourceFile.fileName);

	try {
		const partialFunc = parseFunctionDeclaration(node, sourceFile);
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

function getFunctionType(
	node: FunctionDeclaration,
): DefaultExport | NamedExport {
	const defaultExport =
		(getCombinedModifierFlags(node) & ModifierFlags.Default) !== 0;
	const functionType = defaultExport ? new DefaultExport() : new NamedExport();
	return functionType;
}
