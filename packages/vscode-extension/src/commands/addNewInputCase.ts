import { Position } from 'vscode';
import { ensureActiveEditor, thenableToPromise } from '../utils/utils';
import { Command, Commands } from './Command';
import { container, injectable, registry } from 'tsyringe';
import { LoggerService } from '@functionrunner/shared';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { LanguageHandler } from '@functionrunner/shared';
import { getRightLanguageHandler } from '../utils/getRightLanguageHandler';

export interface AddNewInputArgs {
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
}

export type AddNewInputReturn = void;

@injectable()
@registry([{ token: 'Command', useClass: AddNewInputCaseCommand }])
export class AddNewInputCaseCommand extends Command {
	private languageHandlers: LanguageHandler[];

	constructor(logger: LoggerService) {
		super(Commands.AddNewInputCase, logger);
		this.languageHandlers =
			container.resolveAll<LanguageHandler>('LanguageHandler');
	}

	async execute(args: AddNewInputArgs): Promise<AddNewInputReturn> {
		try {
			const activeEditor = ensureActiveEditor(args.fileAndFunctionIdentifier);
			const { document } = activeEditor;

			const languageHandler = getRightLanguageHandler(
				this.languageHandlers,
				args.fileAndFunctionIdentifier.languageId,
			);

			const newInput = await languageHandler.createNewInputSet(
				args.fileAndFunctionIdentifier,
			);

			if (newInput === undefined) {
				throw new Error(
					'New input was requested but it was not created for some reason',
				);
			}

			const editThenable = activeEditor.edit((editBuilder) => {
				const endOfFile = new Position(document.lineCount - 1, 0);
				editBuilder.insert(endOfFile, newInput as string);
			});
			await thenableToPromise<boolean>(editThenable);
		} catch (error) {
			const logMessage = 'Error adding new input text to file';
			this.logger.error(error, logMessage);
			throw error;
		}
	}
}
