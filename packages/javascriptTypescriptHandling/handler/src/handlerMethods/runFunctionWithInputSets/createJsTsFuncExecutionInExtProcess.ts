import { ChildProcess } from 'child_process';
import { parse } from 'path';
import { createProcess } from './createProcess';
import { detectJsTsModuleOptions } from './moduleTypeDetection/detectJsTsModuleOptions';
import { jsTsProcessRunOptionsCreator } from './jsTsProcessRunOptionsCreator';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { createJsCodeToInvokeFunc } from './createJsCodeToInvokeFunc';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';

export async function createJsTsFuncExecutionInExtProcess({
	runnableFunction,
	inputViewContent,
	inputSetIdentifier,
	debuggerSettings,
}: {
	runnableFunction: RunnableJsTsFunction;
	inputViewContent: string;
	inputSetIdentifier: string;
	debuggerSettings?: DebuggerSettings | undefined;
}): Promise<ChildProcess> {
	const { languageId, moduleType, compilerOptions, tsConfigJsonFileAbsPath } =
		await detectJsTsModuleOptions(runnableFunction);

	const jsCodeToInvokeFunc = createJsCodeToInvokeFunc(
		runnableFunction,
		inputSetIdentifier,
		compilerOptions,
		inputViewContent,
	);

	const sourceFileDirAbsPath = parse(runnableFunction.sourceFilePath).dir;
	const processRunOptions = jsTsProcessRunOptionsCreator({
		languageId,
		sourceFileFolderPath: sourceFileDirAbsPath,
		code: jsCodeToInvokeFunc,
		moduleType,
		tsConfigJsonFileAbsPath,
		debuggerSettings,
	});

	const process = createProcess(processRunOptions);

	return process;
}
