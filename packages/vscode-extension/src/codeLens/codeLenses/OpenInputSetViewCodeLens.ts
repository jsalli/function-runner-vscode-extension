import { RunnableFunction } from '@functionrunner/shared';
import { CodeLens, ViewColumn } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { OpenInputSetViewArgs } from '../../commands/openInputSetView';

export class OpenInputSetViewCodeLens extends CodeLens {
	constructor(public runnableFunction: RunnableFunction) {
		super(runnableFunction.codePosition.getRange());
	}
}

export function resolveOpenInputSetViewCodeLens(
	lens: OpenInputSetViewCodeLens,
): CodeLens {
	lens.command = Command.customCommand<[OpenInputSetViewArgs]>({
		// title: '▶️ Run or 🐛 Debug Function',
		title: 'Run or Debug Function',
		tooltip: `Run or debug function "${
			lens.runnableFunction.name !== undefined
				? lens.runnableFunction.name
				: 'default function'
		}" with custom inputs`,
		command: Commands.OpenInputSetView,
		arguments: [
			{
				runnableFunction: lens.runnableFunction,
				showOptions: {
					viewColumn: ViewColumn.Beside,
				},
			},
		],
	});
	return lens;
}
