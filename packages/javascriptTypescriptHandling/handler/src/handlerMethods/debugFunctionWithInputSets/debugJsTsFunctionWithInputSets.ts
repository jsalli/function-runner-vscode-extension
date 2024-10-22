import { debug, DebugSessionOptions, Uri, workspace } from 'vscode';
import { container } from 'tsyringe';
import { parse } from 'path';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { getDebugConfig } from './getDebugConfig';
import { JsTsDebugConfigurationProvider } from '../getDebugConfigurationProvider/JsTsDebugConfigurationProvider';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';
import { processOutputToOutputChannel } from '../common/processOutputToOutputChannel';
import { createJsTsFuncExecutionInExtProcess } from '../common/createJsTsFuncExecutionInExtProcess';

export const debugJsTsFunctionWithInputSets = async (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
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

	const process = await createJsTsFuncExecutionInExtProcess({
		runnableFunction,
		inputViewContent,
		debuggerSettings,
	});

	const functionOutputPrintPromise = processOutputToOutputChannel(
		process,
		runnableFunction.name,
		returnSuccessForTest,
	);

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

	const functionOutputPrint = await functionOutputPrintPromise;
	if (functionOutputPrint === undefined) {
		throw new Error(
			`Function ${runnableFunction.name} run didn't return output print`,
		);
	}

	return functionOutputPrint;
};
