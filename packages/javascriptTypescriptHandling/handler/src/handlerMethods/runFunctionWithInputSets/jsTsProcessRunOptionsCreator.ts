import {
	ConfigurationService,
	detectOs,
	linuxOS,
	macOS,
	UnSupportedOsError,
	windowsOS,
} from '@functionrunner/shared';
import {
	CommandLineVariables,
	getCommandEnvVars,
	getCommandLineEnvVarGetter,
	getTerminalShell,
} from './commandCreatorUtils';
import { ProcessRunOptions } from './createProcess';
import { getTsNodeInstallationRelPath } from './getTsNodeInstallationRelPath';
import { commonJSModule, esModule } from './constants';
import { container } from 'tsyringe';
import { DebuggerSettings } from '../getDebugConfigurationProvider/DebuggerSettings';

export function jsTsProcessRunOptionsCreator({
	languageId,
	sourceFileFolderPath,
	code,
	moduleType,
	tsConfigJsonFileAbsPath,
	debuggerSettings,
}: {
	languageId: 'javascript' | 'typescript';
	sourceFileFolderPath: string;
	code?: string;
	moduleType: typeof commonJSModule | typeof esModule;
	tsConfigJsonFileAbsPath?: string;
	debuggerSettings?: DebuggerSettings;
}): ProcessRunOptions {
	const configurationService = container.resolve(ConfigurationService);
	const commonPreExecutable = configurationService.get(
		`${languageId}RunOptions.commonPreExecutable`,
		undefined,
		undefined,
	);

	let commandLineVariables: CommandLineVariables | undefined;
	if (languageId === 'typescript') {
		const tsNodeInstallationRelPath =
			getTsNodeInstallationRelPath(sourceFileFolderPath);
		commandLineVariables = {
			sourceFileDirAbsPath: sourceFileFolderPath,
			tsConfigJsonFileAbsPath,
			tsNodeInstallationPath: tsNodeInstallationRelPath,
		};
	}

	const baseExecutable = 'node';
	const envVars = getCommandEnvVars({
		languageId,
		moduleType,
		code,
		commandLineVariables,
	});

	if (debuggerSettings) {
		// TODO: Get the port and address from configurationService and user's settings.json
		envVars['NODE_OPTIONS'] =
			`--inspect-brk=${debuggerSettings.address}:${debuggerSettings.port} ${envVars['NODE_OPTIONS']}`;
	}

	const cmdLineEnvVarGetter = getCommandLineEnvVarGetter();
	const osType = detectOs();
	let executable: string;
	if (osType === windowsOS) {
		executable = `${cmdLineEnvVarGetter} | ${baseExecutable}`;
	} else if (osType === linuxOS || osType === macOS) {
		executable = `echo ${cmdLineEnvVarGetter} | ${baseExecutable}`;
	} else {
		throw new UnSupportedOsError();
	}

	const shell = getTerminalShell();

	const preExecutable =
		commonPreExecutable && commonPreExecutable.length > 0
			? commonPreExecutable
			: undefined;

	const commandLine = `${
		preExecutable ? `${preExecutable} && ` : ''
	}${executable}`;

	// Fix a bug by passing the "--experimental-specifier-resolution=node" option also to the command line args.
	// Without this the debugging will break as node does not find imports without file name
	// import {myFunc} from './myFolder/myFile'; <-- Will break without the "--experimental-specifier-resolution=node" in args
	// Even thought the flag is in NODE_OPTIONS env var. No idea why.
	const args =
		moduleType === esModule ? ['--experimental-specifier-resolution=node'] : [];

	return {
		cwd: sourceFileFolderPath,
		commandLine,
		args,
		envVars,
		shell,
	};
}
