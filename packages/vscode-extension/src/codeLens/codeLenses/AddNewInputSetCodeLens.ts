import { CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { AddNewInputArgs } from '../../commands/addNewInputCase';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export class AddNewInputSetCodeLens extends CodeLens {
	constructor(
		range: Range,
		public fileAndFunctionIdentifier: FileAndFunctionIdentifier,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveAddNewInputSetCodeLens(
	lens: AddNewInputSetCodeLens,
): CodeLens {
	lens.command = Command.customCommand<[AddNewInputArgs]>({
		title: `+ Add new input set`,
		tooltip: `Add new input set for "${lens.fileAndFunctionIdentifier.functionName}"-function`,
		command: Commands.AddNewInputCase,
		arguments: [
			{
				fileAndFunctionIdentifier: lens.fileAndFunctionIdentifier,
			},
		],
	});
	return lens;
}
