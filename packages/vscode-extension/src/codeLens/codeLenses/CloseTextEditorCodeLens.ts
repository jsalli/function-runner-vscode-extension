import { CancellationToken, CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { CloseTextEditorArgs } from '../../commands/closeTextEditor';
import { FileAndFunctionData } from '../../@types/FileAndFunctionData';

export class CloseTextEditorCodeLens extends CodeLens {
	constructor(
		range: Range,
		public fileAndFunctionData: FileAndFunctionData,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveCloseTextEditorCodeLens(
	lens: CloseTextEditorCodeLens,
	_token: CancellationToken,
): CodeLens {
	lens.command = Command.customCommand<[CloseTextEditorArgs]>({
		// title: '✖ Close',
		title: 'Close',
		tooltip: `Close${
			lens.fileAndFunctionData.documentIsUntitled
				? ' and discard content of this untitled document'
				: ''
		}`,
		command: Commands.CloseTextEditor,
		arguments: [{ fileAndFunctionData: lens.fileAndFunctionData }],
	});
	return lens;
}
