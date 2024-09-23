// import { ExtensionContext } from "vscode";
import type { TelemetryEventProperties } from '@vscode/extension-telemetry';

export const enum OutputLevel {
	Silent = 'silent',
	Errors = 'errors',
	Verbose = 'verbose',
	Debug = 'debug',
}

export enum LogLevel {
	Off = 'off',
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
	Debug = 'debug',
}

export const enum OrderedLevel {
	Off = 0,
	Error = 1,
	Warn = 2,
	Info = 3,
	Debug = 4,
}

export abstract class Logger {
	// constructor(
	// 	extensionContext: ExtensionContext,
	// 	configurationService: ConfigurationService,
	// 	telemetryService: TelemetryService,
	// )

	public abstract debug(message: string, ...params: unknown[]): void;
	public abstract error(
		errorOrMessage: unknown,
		message?: string,
		telemetricsProperties?: TelemetryEventProperties,
		...params: unknown[]
	): void;
	public abstract log(message: string, ...params: unknown[]): void;
	public abstract logWithDebugParams(
		message: string,
		...params: unknown[]
	): void;
	public abstract warn(message: string, ...params: unknown[]): void;

	public abstract enabled(level: LogLevel): boolean;
	public abstract get isDevelopment(): boolean;
	public abstract get logLevel(): LogLevel;
	public abstract set logLevel(value: LogLevel | OutputLevel);
}
