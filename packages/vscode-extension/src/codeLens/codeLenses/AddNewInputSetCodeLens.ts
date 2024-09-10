import { CancellationToken, CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { AddNewInputArgs } from '../../commands/addNewInputCase'
import { FileAndFunctionData } from '../../@types/FileAndFunctionData';

export class AddNewInputSetCodeLens extends CodeLens {
	constructor(
		range: Range,
		public fileAndFunctionData: FileAndFunctionData,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveAddNewInputSetCodeLens(
	lens: AddNewInputSetCodeLens,
	_token: CancellationToken,
): CodeLens {
	lens.command = Command.customCommand<[AddNewInputArgs]>({
		title: `+ Add new input set`,
		tooltip: `Add new input set for "${lens.fileAndFunctionData.functionName}"-function`,
		command: Commands.AddNewInputCase,
		arguments: [
			{
				fileAndFunctionData: lens.fileAndFunctionData,
			},
		],
	});
	return lens;
}
