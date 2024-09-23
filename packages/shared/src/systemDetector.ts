/**
 * Unix bash and sh
 *  Node Eval
 *  - Opens multiline input mode when when ending line with " or ' and pressing enter
 *  - Wrap eval with ' (single quotes). This way ` (backtick) is not evaluated as a command
 *  - Escape single quote in code with either replacing it with either
 *    - '"'"'
 *    - \x27 (https://stackoverflow.com/questions/1250079/how-to-escape-single-quotes-within-single-quoted-strings)
 *  Detection
 *  -
 *
 * Windows 10 CMD
 *  Node Eval
 *  - Does not open multiline input mode when ending line with " and pressing enter -> push code as single line code.
 *  - Wrap eval with " (double quotes)
 *  - Escape " (double quote) in code with \ (backslash)
 *  Detection
 *  - "echo %PATH%" outputs PATH-env var
 *  - Get-Host command is not found
 *
 * Windows 10 Bash
 *  Node Eval
 *  - Same as in Unix bash and sh
 *  Detection
 *   - "echo %PATH%" outputs "%PATH%", not PATH-env var
 *  - ls prints folder content
 *  - Get-Host command is not found
 *
 * Windows 10 PowerShell
 *  Node Eval
 *  - Does not open multiline input mode when ending line with " or ' and pressing enter -> push code as single line code.
 *  - Wrap eval with ' (single quotes)
 *  - Escape ' (single quote) in code with another ' (single quote) next to it
 *  - Escape " (double quote) in code with another " (double quote) next to it
 *  - Escape \ (back slash) in code with another \ (back slash) next to it
 *  Detection
 *  - "echo %PATH%" outputs "%PATH%", not PATH-env var
 *  - ls prints folder content
 *  - Get-Host command is found and prints stuff
 */
import { type as platFormType } from 'os';
import { container } from 'tsyringe';
import { ConfigurationService } from './services/ConfigurationService';

export const linuxOS = 'Linux';
export const windowsOS = 'Windows_NT';
export const macOS = 'Darwin';
export type OSTypes = typeof linuxOS | typeof windowsOS | typeof macOS;

export type LinuxTerminal = 'bashOrSh';
export type WindowsTerminal = 'cmd' | 'powerShell' | LinuxTerminal;

export interface TerminalSetup {
	evalQuoteType: '"' | "'";
	// multipleLinesSupported: boolean;
	escapedCharacters: Map<string, string>; // <character to escape, replace it with string>
}

const linuxBashOrShTerminalSetup: TerminalSetup = {
	evalQuoteType: "'",
	// multipleLinesSupported: true,
	escapedCharacters: new Map().set("'", '\\x27'), // x27 character is back tick / Apostrophe character
};

const winBashOrShTerminalSetup = linuxBashOrShTerminalSetup;

const winCmdTerminalSetup: TerminalSetup = {
	evalQuoteType: '"',
	// multipleLinesSupported: false,
	escapedCharacters: new Map().set('"', '\\"'),
};

const winPowerShellTerminalSetup: TerminalSetup = {
	evalQuoteType: "'",
	// multipleLinesSupported: true,
	escapedCharacters: new Map().set("'", "''").set('"', '""').set('\\', '\\\\'),
};

export class UnSupportedOsError extends Error {
	constructor() {
		const osType = platFormType();
		const message = `Could not find supported OS. Found: ${osType}. Supported platforms: ${linuxOS}, ${windowsOS}, ${macOS}`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class WindowsCommandPromptNotSupportedError extends Error {
	constructor() {
		const message =
			'Windows command prompt is not supported yet. Please use either Powershell or Linux bash like terminal like Git Bash.';
		super(message);
		this.name = this.constructor.name;
	}
}

export function detectOs(): OSTypes {
	const osType = platFormType();
	switch (osType) {
		case linuxOS:
			return linuxOS;
		case windowsOS:
			return windowsOS;
		case macOS:
			return macOS;
		default:
			throw new UnSupportedOsError();
	}
}

export function detectTerminalSetup(): TerminalSetup {
	const osType = detectOs();

	switch (osType) {
		case linuxOS:
			return detectLinuxTerminal();
		case windowsOS:
			return detectWindowsTerminal();
		case macOS:
			return detectMacTerminal();
		default:
			throw new UnSupportedOsError();
	}
}

function detectLinuxTerminal(): TerminalSetup {
	// TODO: Check if zsh and other terminal work like bash
	const configurationService = container.resolve(ConfigurationService);
	const terminalType = configurationService.get(
		'terminalOptions.linuxTerminalType',
		undefined,
		'bash',
	);

	if (terminalType === 'bash') {
		return linuxBashOrShTerminalSetup;
	} else if (terminalType === 'sh') {
		return linuxBashOrShTerminalSetup;
	}

	throw new Error(`Got unsupported terminal named: ${terminalType}`);
}

function detectWindowsTerminal(): TerminalSetup {
	const configurationService = container.resolve(ConfigurationService);
	const terminalType = configurationService.get(
		'terminalOptions.windowsTerminalType',
		undefined,
		'cmd',
	);

	if (terminalType === 'cmd') {
		return winCmdTerminalSetup;
	} else if (terminalType === 'powerShell') {
		return winPowerShellTerminalSetup;
	} else if (terminalType === 'bashKind') {
		return winBashOrShTerminalSetup;
	}

	throw new Error(`Got unsupported terminal named: ${terminalType}`);

	// Check for CMD
	// let result = execSync('echo %PATH%');
	// if (result.toString() !== '%PATH%') {
	// 	return winCmdTerminalSetup;
	// }
	// // Check for PowerShell
	// result = execSync('Get-Host');
	// if (result.toString().includes('InstanceId')) {
	// 	return winPowerShellTerminalSetup;
	// }
	// // Check for Bash kind
	// result = execSync('Get-Host');
	// if (result.toString().includes('InstanceId')) {
	// 	return winBashOrShTerminalSetup;
	// }
	// throw new Error('Terminal not detected');
}

function detectMacTerminal(): TerminalSetup {
	// TODO: Check if zsh and other terminal work like bash
	const configurationService = container.resolve(ConfigurationService);
	const terminalType = configurationService.get(
		'terminalOptions.macTerminalType',
		undefined,
		'zsh',
	);

	if (terminalType === 'bash') {
		return linuxBashOrShTerminalSetup;
	} else if (terminalType === 'zsh') {
		return linuxBashOrShTerminalSetup;
	}

	throw new Error(`Got unsupported terminal named: ${terminalType}`);
}
