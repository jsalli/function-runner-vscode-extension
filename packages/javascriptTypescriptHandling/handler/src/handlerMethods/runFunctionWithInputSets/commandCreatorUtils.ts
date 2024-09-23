// import {
// 	codeToRunEnvVarName,
// 	CommonJSModule,
// 	ESModule,
// } from '../../../../constants';
import {
	ConfigurationService,
	detectOs,
	linuxOS,
	macOS,
	UnSupportedOsError,
	WindowsCommandPromptNotSupportedError,
	windowsOS,
} from '@functionrunner/shared';
import { commonJSModule, esModule } from './constants';
import { codeToRunEnvVarName } from '@functionrunner/javascript-typescript-shared';
import { container } from 'tsyringe';

export interface CommandLineVariables {
	sourceFileDirAbsPath: string;
	tsConfigJsonFileAbsPath?: string;
	tsNodeInstallationPath?: string;
}

export function getTerminalShell(): string | true {
	const configurationService = container.resolve(ConfigurationService);
	const osType = detectOs();
	switch (osType) {
		case linuxOS: {
			const shellPath = configurationService.get(
				'terminalOptions.linuxTerminalExecutablePath',
			);
			return shellPath.length === 0 ? true : shellPath;
		}
		case windowsOS: {
			const shellPath = configurationService.get(
				'terminalOptions.windowsTerminalExecutablePath',
			);
			return shellPath.length === 0 ? true : shellPath;
		}
		case macOS: {
			const shellPath = configurationService.get(
				'terminalOptions.macTerminalExecutablePath',
			);
			return shellPath.length === 0 ? true : shellPath;
		}
		default:
			throw new UnSupportedOsError();
	}
}

export function getCommandLineEnvVarGetter(): string {
	const configurationService = container.resolve(ConfigurationService);
	const osType = detectOs();
	switch (osType) {
		case linuxOS: {
			return `$${codeToRunEnvVarName}`;
		}
		case windowsOS: {
			const winTermType = configurationService.get(
				'terminalOptions.windowsTerminalType',
			);
			if (winTermType === 'powerShell') {
				return `$Env:${codeToRunEnvVarName}`;
			} else if (winTermType === 'bashKind') {
				return `$${codeToRunEnvVarName}`;
			}
			throw new WindowsCommandPromptNotSupportedError();
		}
		case macOS: {
			return `$${codeToRunEnvVarName}`;
		}
		default:
			throw new UnSupportedOsError();
	}
}

/**
 * Replace {{myVariable}} kind of texts from the object values with corresponding variable values from given variables
 *
 * @param args
 * @param commandLineVariables
 * @returns
 */
function objectVariableReplacer(
	args: { [key: string]: string | undefined },
	commandLineVariables: CommandLineVariables,
): { [key: string]: string | undefined } {
	for (const argKey of Object.keys(args)) {
		for (const [key, value] of Object.entries(commandLineVariables)) {
			args[argKey] = args[argKey]?.replace(`{{${key}}}`, value);
		}
	}
	// TODO: Check if an variable was not replaced and a patter {{someVariable}} is still present

	return args;
}

export function getCommandEnvVars({
	languageId,
	moduleType,
	code,
	commandLineVariables,
}: {
	languageId: 'javascript' | 'typescript';
	moduleType: typeof commonJSModule | typeof esModule;
	code?: string;
	commandLineVariables?: CommandLineVariables;
}): { [key: string]: string | undefined } {
	const configurationService = container.resolve(ConfigurationService);
	const option:
		| 'javascriptRunOptions.envVarsWhenCommonJS'
		| 'javascriptRunOptions.envVarsWhenESModule'
		| 'typescriptRunOptions.envVarsWhenCommonJS'
		| 'typescriptRunOptions.envVarsWhenESModule' =
		`${languageId}RunOptions.envVarsWhen${moduleType}`;

	const moduleTypeDepEnvVars = configurationService.get(option);
	// configuration.get gives a Proxy object which we need to de-proxify
	// so that for example Object.entries(myProxyObject) would work later on
	const moduleTypeDepEnvVarsDeProxyfied = { ...moduleTypeDepEnvVars };

	let envVars: { [key: string]: string | undefined };

	if (commandLineVariables != null) {
		envVars = objectVariableReplacer(
			moduleTypeDepEnvVarsDeProxyfied,
			commandLineVariables,
		);
	} else {
		envVars = moduleTypeDepEnvVarsDeProxyfied;
	}

	if (code !== undefined) {
		envVars[codeToRunEnvVarName] = code;
	}

	return envVars;
}
