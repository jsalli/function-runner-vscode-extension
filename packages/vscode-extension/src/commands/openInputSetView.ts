import { LanguageHandler, RunnableFunction } from '@functionrunner/shared';
import { TextDocumentShowOptions, window, workspace } from 'vscode';
import { Command, Commands } from './Command';
import { container, injectable, registry } from 'tsyringe';
import { LoggerService } from '../services/LoggerService';
import { getRightLanguageHandler } from '../utils/getRightLanguageHandler';

export interface OpenInputSetViewArgs {
	runnableFunction: RunnableFunction;
	showOptions?: TextDocumentShowOptions;
}

export type OpenInputSetViewReturn = void;

@injectable()
@registry([{ token: 'Command', useClass: OpenInputSetViewCommand }])
export class OpenInputSetViewCommand extends Command {
	private languageHandlers: LanguageHandler[]

	constructor(logger: LoggerService) {
		super(Commands.OpenInputSetView, logger);
		this.languageHandlers = container.resolveAll<LanguageHandler>('LanguageHandler')
	}

	public async execute(
		args: OpenInputSetViewArgs,
	): Promise<OpenInputSetViewReturn> {
		try {
			const languageHandler = getRightLanguageHandler(this.languageHandlers, args.runnableFunction.languageId)

			const viewContent = languageHandler.createInputViewContent(args.runnableFunction);

			const document = await workspace.openTextDocument({
				language: args.runnableFunction.languageId,
				content: viewContent,
			});

			const showOptions = args.showOptions;
			await window.showTextDocument(document, showOptions);
		} catch (error) {
			const logMessage = 'Error opening Run Input View';
			this.logger.error(error, logMessage);
			let errorToThrow: unknown;
			if (PRODUCTION === false) {
				errorToThrow = error;
			} else {
				errorToThrow = new Error(logMessage);
			}
			throw errorToThrow;
		}
	}
}
