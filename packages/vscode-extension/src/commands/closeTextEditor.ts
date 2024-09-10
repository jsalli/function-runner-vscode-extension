import {
	commands,
	Position,
	Range,
	TextEdit,
	workspace,
	WorkspaceEdit,
} from 'vscode';
import { LoggerService } from '../services/LoggerService';
import { ensureActiveEditor } from '../utils/utils';
import { Command, Commands } from './Command';
import { injectable, registry } from 'tsyringe';
import { FileAndFunctionData } from '../@types/FileAndFunctionData';

export interface CloseTextEditorArgs {
	fileAndFunctionData: FileAndFunctionData
}

export type CloseTextEditorReturn = void;

@injectable()
@registry([{ token: 'Command', useClass: CloseTextEditorCommand }])
export class CloseTextEditorCommand extends Command {
	constructor(logger: LoggerService) {
		super(Commands.CloseTextEditor, logger);
	}

	async execute(args: CloseTextEditorArgs): Promise<CloseTextEditorReturn> {
		try {
			const activeEditor = ensureActiveEditor(args.fileAndFunctionData);
			const document = activeEditor.document;
			if (document.isUntitled) {
				const textEdits: TextEdit[] = [];
				textEdits.push(
					TextEdit.replace(
						new Range(new Position(0, 0), new Position(9999, 0)),
						'',
					),
				);

				const workEdits = new WorkspaceEdit();
				workEdits.set(document.uri, textEdits);
				await workspace.applyEdit(workEdits);
			}

			await commands.executeCommand('workbench.action.closeActiveEditor');
		} catch (error) {
			const logMessage = 'Error closing active editor';
			this.logger.error(error, logMessage);
			throw error;
		}
	}
}
