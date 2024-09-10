import { Range } from "vscode";

export interface InputSetViewCodeLensPositions {
  header: Range;
	footer: Range;
	inputSets: Range[];
}