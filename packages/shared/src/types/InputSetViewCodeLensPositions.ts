import { Range } from 'vscode';

export interface InputSetRangeAndId {
	range: Range;
}

export interface InputSetViewCodeLensPositions {
	header: Range;
	footer: Range;
	inputSets: InputSetRangeAndId[];
}
