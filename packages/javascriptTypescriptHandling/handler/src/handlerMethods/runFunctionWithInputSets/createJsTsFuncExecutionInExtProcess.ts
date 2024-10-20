import { ChildProcess } from 'child_process';
import { parse } from 'path';
import { createProcess } from './createProcess';
import { detectJsTsModuleOptions } from './moduleTypeDetection/detectJsTsModuleOptions';
import { jsTsProcessRunOptionsCreator } from './jsTsProcessRunOptionsCreator';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';
import { transpileInputViewToJsCode } from './transpileInputViewToJsCode';

export async function createJsTsFuncExecutionInExtProcess({
	runnableFunction,
	inputViewContent,
	debuggerSettings,
}: {
	runnableFunction: RunnableJsTsFunction;
	inputViewContent: string;
	debuggerSettings?: DebuggerSettings | undefined;
}): Promise<ChildProcess> {
	const { languageId, moduleType, compilerOptions, tsConfigJsonFileAbsPath } =
		await detectJsTsModuleOptions(runnableFunction);

	const jsCode = transpileInputViewToJsCode(inputViewContent, compilerOptions);

	const sourceFileDirAbsPath = parse(runnableFunction.sourceFilePath).dir;
	const processRunOptions = await jsTsProcessRunOptionsCreator({
		languageId,
		sourceFileFolderPath: sourceFileDirAbsPath,
		code: jsCode,
		moduleType,
		tsConfigJsonFileAbsPath,
		debuggerSettings,
	});

	const process = createProcess(processRunOptions);

	return process;
}
