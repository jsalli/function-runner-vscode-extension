import { CodeLens, Command as VSCommand, Range } from 'vscode';
import { Commands, Command } from '../../commands/Command';
import { RunOrDebugInputSetsArgs } from '../../commands/runOrDebugInputSets';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

export class DebugOneInputSetCodeLens extends CodeLens {
	constructor(
		public inputSetId: string,
		range: Range,
		public fileAndFunctionIdentifier: FileAndFunctionIdentifier,
		command?: VSCommand | undefined,
	) {
		super(range, command);
	}
}

export function resolveDebugOneInputSetCodeLens(
	lens: DebugOneInputSetCodeLens,
): CodeLens {
	lens.command = Command.customCommand<[RunOrDebugInputSetsArgs]>({
		// title: '🐛 Debug this',
		title: 'Debug this',
		tooltip: `Debug the "${
			lens.fileAndFunctionIdentifier.functionName
		}"-function with below input case. ${
			lens.fileAndFunctionIdentifier.documentIsUntitled === true
				? 'Document must be saved first'
				: ''
		}`,
		command: Commands.RunOrDebugOneInputSets,
		arguments: [
			{
				fileAndFunctionIdentifier: lens.fileAndFunctionIdentifier,
				inputSetId: lens.inputSetId,
				mode: 'debug',
			},
		],
	});
	return lens;
}
