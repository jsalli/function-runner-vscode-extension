import {
	commands,
	Position,
	Range,
	TextEdit,
	workspace,
	WorkspaceEdit,
} from 'vscode';
import { LoggerService } from '@functionrunner/shared';
import { ensureActiveEditor } from '../utils/utils';
import { Command, Commands } from './Command';
import { injectable, registry } from 'tsyringe';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export interface CloseTextEditorArgs {
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
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
			const activeEditor = ensureActiveEditor(args.fileAndFunctionIdentifier);
			const { document } = activeEditor;
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
