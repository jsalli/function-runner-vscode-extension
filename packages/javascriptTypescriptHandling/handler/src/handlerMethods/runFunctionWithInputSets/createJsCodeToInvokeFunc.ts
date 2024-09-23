import { createCodeToInvokeFuncAndConsoleLogIO } from '@functionrunner/javascript-typescript-invoking-code-creator';
import {
	RunnableJsTsFunction,
	transpileToJs,
} from '@functionrunner/javascript-typescript-shared';
import { CompilerOptions } from 'typescript';
import { ExtensionMode } from 'vscode';
import {
	makeFileToTempFolder,
	detectOs,
	linuxOS,
	macOS,
} from '@functionrunner/shared';
import { escapeInCodeNewlines } from './escapeInCodeNewlines';
import { container } from 'tsyringe';
import { vscodeExtensionModeInjectionToken } from '@functionrunner/shared';

export function createJsCodeToInvokeFunc(
	runnableFunction: RunnableJsTsFunction,
	inputSetIdentifier: string,
	compilerOptions: CompilerOptions,
	inputViewContent: string,
): string {
	const tsCodeToInvokeFunction = createCodeToInvokeFuncAndConsoleLogIO(
		runnableFunction,
		inputSetIdentifier,
	);

	const wholeTsCode = `${inputViewContent}\n\n${tsCodeToInvokeFunction}`;
	// compilerOptions.module = ModuleKind.CommonJS;
	let jsCode = transpileToJs(wholeTsCode, compilerOptions);
	// Webpack's Define plugin removes this code in production mode.
	if (PRODUCTION === false) {
		const extensionMode = container.resolve(vscodeExtensionModeInjectionToken);
		if (extensionMode !== ExtensionMode.Test) {
			makeFileToTempFolder('tsCodeToRunWithoutRecorder.ts', wholeTsCode);
			makeFileToTempFolder('jsCodeToRunWithoutRecorder.js', jsCode);
		}
	}

	const osType = detectOs();
	if (osType === linuxOS || osType === macOS) {
		jsCode = escapeInCodeNewlines(jsCode);
	}

	return jsCode;
}
