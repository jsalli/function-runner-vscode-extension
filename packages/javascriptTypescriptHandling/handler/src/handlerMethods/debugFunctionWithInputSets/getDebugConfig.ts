import { container } from 'tsyringe';
import { DebugConfiguration, workspace, WorkspaceFolder } from 'vscode';
import { JsTsDebugConfigurationProvider } from '../getDebugConfigurationProvider/JsTsDebugConfigurationProvider';

export function getDebugConfig(
	workspaceFolder: WorkspaceFolder,
	cwd: string,
	debuggerSuccessCallBack: (debugCrashed: boolean) => void,
): DebugConfiguration {
	let debugConfig = workspace
		.getConfiguration('launch', workspaceFolder)
		?.get<DebugConfiguration[]>('configurations')
		?.filter((config) => config.name === 'functionrunner-debug-functions')[0];

	const jsTsDebugConfProvider = container.resolve(
		JsTsDebugConfigurationProvider,
	);
	jsTsDebugConfProvider.prepareFunctionRun(cwd, debuggerSuccessCallBack);

	if (debugConfig == null) {
		// void window.showWarningMessage(
		// 	'Could not find debug config named "functionrunner-debug-functions" in launch.json Using a default config.\nCreate a custom launch-config named "functionrunner-debug-functions" if you run into problems',
		// );
		[debugConfig] = jsTsDebugConfProvider.provideDebugConfigurations();
	}

	return debugConfig;
}
