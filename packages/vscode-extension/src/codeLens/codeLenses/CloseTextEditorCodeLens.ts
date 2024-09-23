import { CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { CloseTextEditorArgs } from '../../commands/closeTextEditor';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export class CloseTextEditorCodeLens extends CodeLens {
	constructor(
		range: Range,
		public fileAndFunctionIdentifier: FileAndFunctionIdentifier,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveCloseTextEditorCodeLens(
	lens: CloseTextEditorCodeLens,
): CodeLens {
	lens.command = Command.customCommand<[CloseTextEditorArgs]>({
		// title: '✖ Close',
		title: 'Close',
		tooltip: `Close${
			lens.fileAndFunctionIdentifier.documentIsUntitled
				? ' and discard content of this untitled document'
				: ''
		}`,
		command: Commands.CloseTextEditor,
		arguments: [{ fileAndFunctionIdentifier: lens.fileAndFunctionIdentifier }],
	});
	return lens;
}
