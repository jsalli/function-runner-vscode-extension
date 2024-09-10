export const enum OutputLevel {
	Silent = 'silent',
	Errors = 'errors',
	Verbose = 'verbose',
	Debug = 'debug',
}

export interface Config {
	general: General;
	logging: Logging;
	codeLens: CodeLensConfig;
	terminalOptions: TerminalOptions;
	javascriptRunOptions: JsRunOptions;
	typescriptRunOptions: TsRunOptions;
	// pythonRunOptions: PythonRunOptions;
	telemetry: Telemetry;
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

export interface JsRunOptions {
	// commonEnvVars: { [key: string]: string };
	commonPreExecutable: string;
	envVarsWhenESModule: { [key: string]: string };
	// executableArgsWhenESModule: string[];
	envVarsWhenCommonJS: { [key: string]: string };
	// executableArgsWhenCommonJS: string[];
	socketPort: number;
}

export interface TsRunOptions extends JsRunOptions {
	tsconfigRelPath: string;
}

export interface Telemetry {
	enabled: boolean;
}
