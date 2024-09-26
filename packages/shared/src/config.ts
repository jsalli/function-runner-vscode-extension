export const enum OutputLevel {
	Silent = 'silent',
	Errors = 'errors',
	Verbose = 'verbose',
	Debug = 'debug',
}

export interface JavascriptVSCodeSettingsConfig {
	// commonEnvVars: { [key: string]: string };
	commonPreExecutable: string;
	envVarsWhenESModule: { [key: string]: string };
	// executableArgsWhenESModule: string[];
	envVarsWhenCommonJS: { [key: string]: string };
	// executableArgsWhenCommonJS: string[];
	socketPort: number;
}

export interface TypescriptVSCodeSettingsConfig
	extends JavascriptVSCodeSettingsConfig {
	tsconfigRelPath: string;
}

export interface DebugggerSettingsConfig {
	address: string;
	port: number;
}

export interface Config {
	general: General;
	logging: Logging;
	codeLens: CodeLensConfig;
	terminalOptions: TerminalOptions;
	debugger: DebugggerSettingsConfig;
	javascriptRunOptions: JavascriptVSCodeSettingsConfig;
	typescriptRunOptions: TypescriptVSCodeSettingsConfig;
	// pythonRunOptions: PythonVSCodeSettingsConfig;
}

export interface General {
	sourceFolder: string;
}

export interface Logging {
	outputLevel: OutputLevel;
}

export interface CodeLensConfig {
	enabled: boolean;
}

export interface TerminalOptions {
	windowsTerminalType: 'cmd' | 'powerShell' | 'bashKind';
	windowsTerminalExecutablePath: string;
	linuxTerminalType: 'bash' | 'sh';
	linuxTerminalExecutablePath: string;
	macTerminalType: 'bash' | 'zsh';
	macTerminalExecutablePath: string;
}
