import { CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { RunOrDebugInputSetsArgs } from '../../commands/runOrDebugInputSets';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export class RunOneInputSetCodeLens extends CodeLens {
	constructor(
		range: Range,
		public fileAndFunctionIdentifier: FileAndFunctionIdentifier,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveRunOneInputSetCodeLens(
	lens: RunOneInputSetCodeLens,
): CodeLens {
	lens.command = Command.customCommand<[RunOrDebugInputSetsArgs]>({
		// title: '▶️ Run this',
		title: 'Run this',
		tooltip: `Run the "${lens.fileAndFunctionIdentifier.functionName}"-function with below input case`,
		command: Commands.RunOrDebugOneInputSets,
		arguments: [
			{
				fileAndFunctionIdentifier: lens.fileAndFunctionIdentifier,
				mode: 'run',
			},
		],
	});
	return lens;
}
