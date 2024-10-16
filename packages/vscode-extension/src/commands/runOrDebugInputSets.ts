import { LanguageHandler } from '@functionrunner/shared';
import { LoggerService } from '@functionrunner/shared';
import { ensureActiveEditor } from '../utils/utils';
import { Command, Commands } from './Command';
import { container, injectable, registry } from 'tsyringe';
import { getRightLanguageHandler } from '../utils/getRightLanguageHandler';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export interface RunOrDebugInputSetsArgs {
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
	mode: 'run' | 'debug';
	// The returnSuccessForTest bit is set in testing to assert the output of the function run.
	returnSuccessForTest?: boolean | undefined;
}

export type RunOrDebugInputSetsReturn = string;

@injectable()
@registry([{ token: 'Command', useClass: RunOrDebugInputSetsCommand }])
export class RunOrDebugInputSetsCommand extends Command {
	private languageHandlers: LanguageHandler[];

	constructor(logger: LoggerService) {
		super(Commands.RunOrDebugOneInputSets, logger);
		this.languageHandlers =
			container.resolveAll<LanguageHandler>('LanguageHandler');
	}

	public async execute(
		args: RunOrDebugInputSetsArgs,
	): Promise<RunOrDebugInputSetsReturn> {
		try {
			const activeEditor = ensureActiveEditor(args.fileAndFunctionIdentifier);

			const languageHandler = getRightLanguageHandler(
				this.languageHandlers,
				args.fileAndFunctionIdentifier.languageId,
			);

			const runnableFunction =
				await languageHandler.getRunnableFunctionByFileId(
					args.fileAndFunctionIdentifier,
				);
			const inputViewContent = activeEditor.document.getText();

			switch (args.mode) {
				case 'run':
					return await languageHandler.runFunctionWithInputSets(
						runnableFunction,
						inputViewContent,
						args.returnSuccessForTest,
					);
				case 'debug':
					return await languageHandler.debugFunctionWithInputSets(
						runnableFunction,
						inputViewContent,
						args.returnSuccessForTest,
					);
			}
		} catch (error) {
			const logMessage = 'Could not execute debugging command';
			this.logger.error(error, logMessage);
			throw error;
		}
	}
}
