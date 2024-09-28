import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { createJsTsFuncExecutionInExtProcess } from '../runFunctionWithInputSets/createJsTsFuncExecutionInExtProcess';
import { getDebugConfig } from './getDebugConfig';
import { debug, DebugSessionOptions, Uri, workspace } from 'vscode';
import { container } from 'tsyringe';
import { JsTsDebugConfigurationProvider } from '../getDebugConfigurationProvider/JsTsDebugConfigurationProvider';
import { parse } from 'path';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';
import { ConfigurationService } from '@functionrunner/shared';

export const debugJsTsFunctionWithInputSets = async (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	configurationService: ConfigurationService,
	returnSuccessForTest: boolean | undefined,
): Promise<string> => {
	const workspaceFolder = workspace.getWorkspaceFolder(
		Uri.file(runnableFunction.sourceFilePath),
	);
	if (workspaceFolder == null) {
		throw new Error(
			`Could not find wordspace base folder for path ${runnableFunction.sourceFilePath}`,
		);
	}

	const debuggerSettings = container.resolve(DebuggerSettings);

	await createJsTsFuncExecutionInExtProcess({
		runnableFunction,
		inputViewContent,
		configurationService,
		debuggerSettings,
	});

	await new Promise<void>((res, rej): void => {
		function debuggerSuccessCallBack(debugFinishedSuccessful: boolean): void {
			const jsTsDebugConfProvider = container.resolve(
				JsTsDebugConfigurationProvider,
			);
			jsTsDebugConfProvider.disposeDebugAdapterTracker();
			if (!returnSuccessForTest) {
				return;
			}

			if (debugFinishedSuccessful === true) {
				res();
				return;
			}
			rej();
		}
		const sourceFileDirAbsPath = parse(runnableFunction.sourceFilePath).dir;

		const debugConfiguration = getDebugConfig(
			workspaceFolder,
			sourceFileDirAbsPath,
			debuggerSuccessCallBack,
		);

		const debugSessionOptions: DebugSessionOptions = {
			suppressSaveBeforeStart: true,
		};

		void debug.startDebugging(
			workspaceFolder,
			debugConfiguration,
			debugSessionOptions,
		);
		if (returnSuccessForTest) {
			return;
		}
		res();
	});

	return 'moikka';
};
