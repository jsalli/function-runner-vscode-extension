import { CancellationToken, CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { RunOrDebugInputSetsArgs } from '../../commands/runOrDebugInputSets';
import { FileAndFunctionData } from '../../@types/FileAndFunctionData';

export class DebugOneInputSetCodeLens extends CodeLens {
	constructor(
		public inputSetIndex: number,
		range: Range,
		public fileAndFunctionData: FileAndFunctionData,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveDebugOneInputSetCodeLens(
	lens: DebugOneInputSetCodeLens,
	_token: CancellationToken,
): CodeLens {
	lens.command = Command.customCommand<[RunOrDebugInputSetsArgs]>({
		// title: '🐛 Debug this',
		title: 'Debug this',
		tooltip: `Debug the "${
			lens.fileAndFunctionData.functionName
		}"-function with below input case. ${
			lens.fileAndFunctionData.documentIsUntitled === true ? 'Document must be saved first' : ''
		}`,
		command: Commands.RunOrDebugOneInputSets,
		arguments: [
			{
				fileAndFunctionData: lens.fileAndFunctionData,
				inputSetIndex: lens.inputSetIndex,
				mode: 'debug'
			},
		],
	});
	return lens;
}
