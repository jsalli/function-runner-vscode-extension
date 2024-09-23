import {
	DefaultExport,
	defaultExportFunctionName,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import { NotSupportedFunction, CodePosition } from '@functionrunner/shared';
import { SourceFile } from 'typescript';
// import { testableFunctionId } from '../../../utils/utils';
import { ExportAssignmentArrowFunc } from './common';
import { createNotSupportedFunction } from './createNotSupportedFunction';
import { parseArrowFunction } from './parseArrowFunction';

export function runnableFuncFromDefaultExportArrowFunc(
	node: ExportAssignmentArrowFunc,
	codePosition: CodePosition,
	languageId: 'typescript' | 'javascript',
	sourceFile: SourceFile,
	sourceFilePath: string,
): RunnableJsTsFunction | NotSupportedFunction {
	const functionType = new DefaultExport();
	const name = defaultExportFunctionName;
	// const id = testableFunctionId(sourceFile.fileName, name);
	// const sourceFilePath = normalizePath(sourceFile.fileName);

	try {
		const partialFunc = parseArrowFunction(node.expression, sourceFile);
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
