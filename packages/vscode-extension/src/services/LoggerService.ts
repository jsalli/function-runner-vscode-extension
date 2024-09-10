import { capitalizeFirstLetter } from '@functionrunner/shared';
import {
	ExtensionContext,
	ExtensionMode,
	OutputChannel,
	Uri,
	window,
} from 'vscode';
import { OutputLevel } from '../config';
import { inject, injectable, singleton } from 'tsyringe';
import { ConfigurationService } from './ConfigurationService';

const emptyStr = '';
const outputChannelName = 'Function Runner';
const consolePrefix = '[Function Runner]';

export enum LogLevel {
	Off = 'off',
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
	Debug = 'debug',
}

const enum OrderedLevel {
	Off = 0,
	Error = 1,
	Warn = 2,
	Info = 3,
	Debug = 4,
}

@injectable()
@singleton()
export class LoggerService {
	private output: OutputChannel | undefined;

	constructor(
		@inject('ExtensionContext') private extensionContext: ExtensionContext,
		private configurationService: ConfigurationService,
	) {
		this._isDevelopment =
			this.extensionContext.extensionMode === ExtensionMode.Development;
		this.logLevel = this.configurationService.get('logging.outputLevel');
	}

	public enabled(level: LogLevel): boolean {
		return this.orderderLogLevel >= toOrderedLevel(level);
	}

	private _isDevelopment: boolean;
	public get isDevelopment() {
		return this._isDevelopment;
	}

	private orderderLogLevel: OrderedLevel = OrderedLevel.Off;
	private _logLevel: LogLevel = LogLevel.Off;
	public get logLevel(): LogLevel {
		return this._logLevel;
	}
	public set logLevel(value: LogLevel | OutputLevel) {
		this._logLevel = fromOutputLevel(value);
		this.orderderLogLevel = toOrderedLevel(this._logLevel);

		if (value === LogLevel.Off) {
			this.output?.dispose();
			this.output = undefined;
		} else {
			this.output =
				this.output ?? window.createOutputChannel(outputChannelName);
		}
	}

	public debug(message: string, ...params: any[]): void {
		if (this.orderderLogLevel < OrderedLevel.Debug && !this.isDevelopment) {
			return;
		}

		if (this.isDevelopment) {
			console.log(
				this.logPrefix(LogLevel.Debug, true),
				message ?? emptyStr,
				...params,
			);
		}

		if (this.output == null || this.orderderLogLevel < OrderedLevel.Debug) {
			return;
		}
		this.output.appendLine(
			`${this.logPrefix(LogLevel.Debug)} ${
				message ?? emptyStr
			}${this.toLoggableParams(true, params)}`,
		);
	}

	/**
	 * Be sure to not send sensitive information with telemetry
	 *
	 * @param errorOrMessage
	 * @param message
	 * @param telemetricsProperties
	 * @param params
	 * @returns
	 */
	public error(
		errorOrMessage: unknown,
		message?: string,
		...params: any[]
	): void {
		if (message == null) {
			const stack =
				errorOrMessage instanceof Error ? errorOrMessage.stack : undefined;
			if (stack) {
				const match = /.*\s*?at\s(.+?)\s/.exec(stack);
				if (match != null) {
					message = match[1];
				}
			}
		}

		if (this.orderderLogLevel < OrderedLevel.Error && !this.isDevelopment) {
			return;
		}

		if (this.isDevelopment) {
			console.error(
				this.logPrefix(LogLevel.Error, true),
				message ?? emptyStr,
				...params,
				errorOrMessage,
			);
		}

		if (this.output == null || this.orderderLogLevel < OrderedLevel.Error) {
			return;
		}
		this.output.appendLine(
			`${this.logPrefix(LogLevel.Error)} ${
				message ?? emptyStr
			}${this.toLoggableParams(false, params)}\n${String(errorOrMessage)}`,
		);
	}

	public log(message: string, ...params: any[]): void {
		if (this.orderderLogLevel < OrderedLevel.Info && !this.isDevelopment) {
			return;
		}

		if (this.isDevelopment) {
			console.log(
				this.logPrefix(LogLevel.Info, true),
				message ?? emptyStr,
				...params,
			);
		}

		if (this.output == null || this.orderderLogLevel < OrderedLevel.Info) {
			return;
		}
		this.output.appendLine(
			`${this.logPrefix(LogLevel.Info)} ${
				message ?? emptyStr
			}${this.toLoggableParams(false, params)}`,
		);
	}

	public logWithDebugParams(message: string, ...params: any[]): void {
		if (this.orderderLogLevel < OrderedLevel.Info && !this.isDevelopment) {
			return;
		}

		if (this.isDevelopment) {
			console.log(
				this.logPrefix(LogLevel.Debug, true),
				message ?? emptyStr,
				...params,
			);
		}

		if (this.output == null || this.orderderLogLevel < OrderedLevel.Info) {
			return;
		}
		this.output.appendLine(
			`${this.logPrefix(LogLevel.Debug)} ${
				message ?? emptyStr
			}${this.toLoggableParams(true, params)}`,
		);
	}

	public warn(message: string, ...params: any[]): void {
		if (this.orderderLogLevel < OrderedLevel.Warn && !this.isDevelopment) {
			return;
		}

		if (this.isDevelopment) {
			console.warn(
				this.logPrefix(LogLevel.Warn, true),
				message ?? emptyStr,
				...params,
			);
		}

		if (this.output == null || this.orderderLogLevel < OrderedLevel.Warn) {
			return;
		}
		this.output.appendLine(
			`${this.logPrefix(LogLevel.Warn)} ${
				message ?? emptyStr
			}${this.toLoggableParams(false, params)}`,
		);
	}

	private toLoggable(
		p: any,
		sanitize?: ((key: string, value: any) => any) | undefined,
	) {
		if (typeof p !== 'object') return String(p);
		if (p instanceof Uri) return `Uri(${p.toString(true)})`;

		try {
			return JSON.stringify(p, sanitize);
		} catch {
			return '<error>';
		}
	}

	/**
	 * Create log prefix: [Debug - 10:14:40.458] or [FunctionRunner][Debug - 10:14:40.458]
	 */
	private logPrefix(logType: LogLevel, consoleLog: boolean = false): string {
		return `${consoleLog ? consolePrefix : ''}[${capitalizeFirstLetter(
			logType,
		)} - ${this.timestamp}]`;
	}

	/**
	 * Time in format 09:34:07.009. Hours, minutes and seconds with 2 digits. Milliseconds with 3 digits.
	 */
	private get timestamp(): string {
		const now = new Date();
		const hours = `0${now.getHours()}`.slice(-2);
		const minutes = `0${now.getMinutes()}`.slice(-2);
		const seconds = `0${now.getSeconds()}`.slice(-2);
		const milliseconds = `00${now.getMilliseconds()}`.slice(-3);

		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

	private toLoggableParams(debugOnly: boolean, params: any[]) {
		if (
			params.length === 0 ||
			(debugOnly &&
				this.orderderLogLevel < OrderedLevel.Debug &&
				!this.isDevelopment)
		) {
			return emptyStr;
		}

		const loggableParams = params.map((p) => this.toLoggable(p)).join(', ');
		return loggableParams.length !== 0 ? ` \u2014 ${loggableParams}` : emptyStr;
	}
}

function fromOutputLevel(level: LogLevel | OutputLevel): LogLevel {
	switch (level) {
		case OutputLevel.Silent:
			return LogLevel.Off;
		case OutputLevel.Errors:
			return LogLevel.Error;
		case OutputLevel.Verbose:
			return LogLevel.Info;
		case OutputLevel.Debug:
			return LogLevel.Debug;
		default:
			return level;
	}
}

function toOrderedLevel(logLevel: LogLevel): OrderedLevel {
	switch (logLevel) {
		case LogLevel.Off:
			return OrderedLevel.Off;
		case LogLevel.Error:
			return OrderedLevel.Error;
		case LogLevel.Warn:
			return OrderedLevel.Warn;
		case LogLevel.Info:
			return OrderedLevel.Info;
		case LogLevel.Debug:
			return OrderedLevel.Debug;
		default:
			return OrderedLevel.Off;
	}
}
