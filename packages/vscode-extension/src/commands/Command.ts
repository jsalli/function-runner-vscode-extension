import { LoggerService } from '@functionrunner/shared';
import { commands, Disposable, Command as VSCommand } from 'vscode';
import { container } from 'tsyringe';

export const enum Commands {
	OpenInputSetView = 'functionrunner.openInputSetView',
	CloseTextEditor = 'functionrunner.closeTextEditor',
	RunOrDebugOneInputSets = 'functionrunner.runOrDebugOneInputSets',
	ClearFunctionRunnerExtensionPreferences = 'functionrunner.clearFunctionRunnerExtensionPreferences',
	NotSupportedFunction = 'functionrunner.notSupportedFunction',
}

export abstract class Command implements Disposable {
	private readonly disposable: Disposable;

	constructor(
		private command: string | string[],
		protected logger: LoggerService,
	) {
		if (typeof this.command === 'string') {
			// Webpack's Define plugin removes this code in production mode.
			if (PRODUCTION === false) {
				this.logger.debug(`Registering single command ${this.command}`);
			}
			this.disposable = commands.registerCommand(
				this.command,
				(...args: unknown[]) => this.execute(...args),
				this,
			);

			return;
		}

		const subscriptions = this.command.map((cmd) =>
			commands.registerCommand(
				cmd,
				(...args: unknown[]) => this.execute(...args),
				this,
			),
		);
		this.disposable = Disposable.from(...subscriptions);
	}

	dispose() {
		this.disposable.dispose();
	}

	abstract execute(...args: unknown[]): Promise<unknown> | unknown;

	public static customCommand<T extends unknown[]>(
		command: Omit<VSCommand, 'arguments'> & { arguments: [...T] },
	): VSCommand {
		return command;
	}

	public static executeCommand<T, R>(
		command: Commands,
		args: T,
	): Promise<R | undefined> {
		return new Promise((res, rej) => {
			commands.executeCommand<R | undefined>(command, args).then(
				(value) => {
					res(value);
				},
				(failReason) => {
					const message = `Command "${command}" failed with message: "${failReason}"`;
					const logger = container.resolve<LoggerService>(LoggerService);
					logger.error(message, undefined, {
						dontSendErrorMessage: true,
						alternativeLogMessage: `Command "${command}" failed`,
					});
					rej(failReason);
				},
			);
		});
	}
}
