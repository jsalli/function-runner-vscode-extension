import { ChildProcess } from 'child_process';
import { parse } from 'path';
import { createProcess } from './createProcess';
import { detectJsTsModuleOptions } from './moduleTypeDetection/detectJsTsModuleOptions';
import { jsTsProcessRunOptionsCreator } from './jsTsProcessRunOptionsCreator';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { transpileInputViewToJsCode } from './transpileInputViewToJsCode';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';
import { ConfigurationService } from '@functionrunner/shared';
import { createJsCodeToInvokeFunc } from './createJsCodeToInvokeFunc';

export async function createJsTsFuncExecutionInExtProcess({
	runnableFunction,
	inputViewContent,
	configurationService,
	debuggerSettings,
}: {
	runnableFunction: RunnableJsTsFunction;
	inputViewContent: string;
	configurationService: ConfigurationService;
	debuggerSettings?: DebuggerSettings | undefined;
}): Promise<ChildProcess> {
	const { languageId, moduleType, compilerOptions, tsConfigJsonFileAbsPath } =
		await detectJsTsModuleOptions(runnableFunction);

	const funcExecutionCodeAlreadyInInputView = configurationService.get(
		'general.printFunctionExecutionCodeToInputView',
	);
	let codeToExecute: string;
	if (!funcExecutionCodeAlreadyInInputView) {
		codeToExecute = createJsCodeToInvokeFunc(
			runnableFunction,
			inputViewContent,
			compilerOptions,
		);
	} else {
		codeToExecute = transpileInputViewToJsCode(
			inputViewContent,
			compilerOptions,
		);
	}

	const sourceFileDirAbsPath = parse(runnableFunction.sourceFilePath).dir;
	const processRunOptions = await jsTsProcessRunOptionsCreator({
		languageId,
		sourceFileFolderPath: sourceFileDirAbsPath,
		code: codeToExecute,
		moduleType,
		tsConfigJsonFileAbsPath,
		debuggerSettings,
	});

	const process = createProcess(processRunOptions);

	return process;
}
