import { createCodeToInvokeFuncAndConsoleLogIO } from '@functionrunner/javascript-typescript-invoking-code-creator';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { CompilerOptions } from 'typescript';
import { transpileInputViewToJsCode } from './transpileInputViewToJsCode';

export function createJsCodeToInvokeFunc(
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	compilerOptions: CompilerOptions,
): string {
	const tsCodeToInvokeFunction =
		createCodeToInvokeFuncAndConsoleLogIO(runnableFunction);

	const wholeTsCode = `${inputViewContent}\n\n${tsCodeToInvokeFunction}`;

	const jsCode = transpileInputViewToJsCode(wholeTsCode, compilerOptions);
	return jsCode;
}
