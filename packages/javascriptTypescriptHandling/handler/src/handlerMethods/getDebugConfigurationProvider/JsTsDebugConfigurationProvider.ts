import {
	debug,
	DebugConfiguration,
	DebugConfigurationProvider,
	Disposable,
	WorkspaceFolder,
} from 'vscode';
import { LoggerService } from '@functionrunner/shared';
import { injectable } from 'tsyringe';

let readyToListenForDAMessages = false;

@injectable()
export class JsTsDebugConfigurationProvider
	implements DebugConfigurationProvider
{
	constructor(private logger: LoggerService) {}

	private debugAdapterTracker: Disposable | undefined;

	/**
	 * Prepares injecting the name of the test, which has to be debugged, into the `DebugConfiguration`,
	 * This function has to be called before `vscode.debug.startDebugging`.
	 */
	public prepareFunctionRun(
		cwd: string,
		debuggerSuccessCallBack: (debugFinishedSuccessful: boolean) => void,
	) {
		readyToListenForDAMessages = true;
		const { logger } = this;
		this.debugAdapterTracker = debug.registerDebugAdapterTrackerFactory('*', {
			createDebugAdapterTracker() {
				return {
					onDidSendMessage: (message) => {
						if (!readyToListenForDAMessages) {
							return;
						}
						function isProcessError(message: unknown): boolean {
							return (
								typeof message === 'object' &&
								message !== null &&
								'type' in message &&
								message.type === 'event' &&
								'event' in message &&
								message.event === 'output' &&
								'body' in message &&
								// @ts-expect-error "category" is safe to check
								message.body?.category === 'stderr' &&
								// @ts-expect-error "output" is safe to check
								message.body?.output?.includes('Process exited with code 1')
							);
						}

						function isAttachingError(message: unknown): boolean {
							return (
								typeof message === 'object' &&
								message !== null &&
								'commans' in message &&
								message.commans === 'attach' &&
								'type' in message &&
								message.type === 'response' &&
								'success' in message &&
								message.success === false
							);
						}

						if (isProcessError(message) || isAttachingError(message)) {
							logger.error(`Debugging crashed`, undefined, {
								languageId: 'typescript',
							});
							readyToListenForDAMessages = false;
							debuggerSuccessCallBack(false);
						} else if (
							message.type === 'response' &&
							message.command === 'disconnect' &&
							message.success === true
						) {
							readyToListenForDAMessages = false;
							debuggerSuccessCallBack(true);
						}
					},
				};
			},
		});
	}

	public disposeDebugAdapterTracker() {
		this.debugAdapterTracker?.dispose();
	}

	public resolveDebugConfiguration(
		folder: WorkspaceFolder | undefined,
		debugConfiguration: DebugConfiguration,
	): DebugConfiguration {
		return debugConfiguration;
	}

	public provideDebugConfigurations(): DebugConfiguration[] {
		const debugConfiguration: DebugConfiguration = {
			type: 'node',
			name: 'functionrunner-debug-functions',
			internalConsoleOptions: 'openOnSessionStart',
			continueOnAttach: true,
			request: 'attach',
			address: '127.0.0.1',
			port: 9234,
			skipFiles: ['<node_internals>/**', '**/resources/app/out/vs/**'],
			smartStep: true,
			sourceMaps: true,
			trace: true,
		};

		return [debugConfiguration];
	}
}
