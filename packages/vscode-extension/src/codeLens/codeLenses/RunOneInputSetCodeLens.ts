import { CancellationToken, CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { RunOrDebugInputSetsArgs } from '../../commands/runOrDebugInputSets';
import { FileAndFunctionData } from '../../@types/FileAndFunctionData';

export class RunOneInputSetCodeLens extends CodeLens {
	constructor(
		public inputSetIndex: number,
		range: Range,
		public fileAndFunctionData: FileAndFunctionData,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveRunOneInputSetCodeLens(
	lens: RunOneInputSetCodeLens,
	_token: CancellationToken,
): CodeLens {
	lens.command = Command.customCommand<[RunOrDebugInputSetsArgs]>({
		// title: '▶️ Run this',
		title: 'Run this',
		tooltip: `Run the "${lens.fileAndFunctionData.functionName}"-function with below input case`,
		command: Commands.RunOrDebugOneInputSets,
		arguments: [
			{
				fileAndFunctionData: lens.fileAndFunctionData,
				inputSetIndex: lens.inputSetIndex,
				mode: 'run',
			},
		],
	});
	return lens;
}
