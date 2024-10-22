import { transpileToJs } from '@functionrunner/javascript-typescript-shared';
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

export function transpileInputViewToJsCode(
	inputViewContent: string,
	compilerOptions: CompilerOptions,
): string {
	let jsCode = transpileToJs(inputViewContent, compilerOptions);
	// Webpack's Define plugin removes this code in production mode.
	if (PRODUCTION === false) {
		const extensionMode = container.resolve(vscodeExtensionModeInjectionToken);
		if (extensionMode !== ExtensionMode.Test) {
			makeFileToTempFolder('tsCodeToRunWithoutRecorder.ts', inputViewContent);
			makeFileToTempFolder('jsCodeToRunWithoutRecorder.js', jsCode);
		}
	}

	const osType = detectOs();
	if (osType === linuxOS || osType === macOS) {
		jsCode = escapeInCodeNewlines(jsCode);
	}

	return jsCode;
}
