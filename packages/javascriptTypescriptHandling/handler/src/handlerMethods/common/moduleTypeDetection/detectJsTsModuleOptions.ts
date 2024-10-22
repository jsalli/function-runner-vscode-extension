import { CompilerOptions } from 'typescript';
import { commonJSModule, esModule } from '../constants';
import { detectJsModuleOptions } from './detectJsModuleOptions';
import { detectTsModuleOptions } from './detectTsModuleOptions';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';

export async function detectJsTsModuleOptions(
	runnableFunction: RunnableJsTsFunction,
): Promise<{
	languageId: 'javascript' | 'typescript';
	moduleType: typeof commonJSModule | typeof esModule;
	compilerOptions: CompilerOptions;
	tsConfigJsonFileAbsPath?: string;
}> {
	let moduleType: typeof commonJSModule | typeof esModule;
	let compilerOptions: CompilerOptions;
	let tsConfigJsonFileAbsPath: string | undefined;

	if (runnableFunction.languageId === 'javascript') {
		({ moduleType, compilerOptions } = await detectJsModuleOptions(
			runnableFunction.sourceFilePath,
		));
	} else if (runnableFunction.languageId === 'typescript') {
		({ moduleType, compilerOptions, tsConfigJsonFileAbsPath } =
			await detectTsModuleOptions(runnableFunction.sourceFilePath));
	} else {
		throw new Error(`Unsupported languageId: "${runnableFunction.languageId}"`);
	}
	return {
		languageId: runnableFunction.languageId,
		moduleType,
		compilerOptions,
		tsConfigJsonFileAbsPath,
	};
}
