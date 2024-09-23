import { Range } from 'vscode';

export interface InputSetRangeAndId {
	range: Range;
	inputSetId: string;
}

export interface InputSetViewCodeLensPositions {
	header: Range;
	footer: Range;
	inputSets: InputSetRangeAndId[];
}
