import {
	InputSetRangeAndId,
	InputSetViewCodeLensPositions,
	LoggerService,
} from '@functionrunner/shared';
import { container } from 'tsyringe';
import { Position, Range } from 'vscode';
import { regexMatchToRange } from '../common/regexMatchToRange';
import { JsTsTextDocument } from '@functionrunner/javascript-typescript-shared';

const ioViewHeaderRegex =
	/^(\/\*)([\s\S]*?)(@functionrunner file-id \S*?[\r\n|\r|\n]([\s\S]*?)\*\/)$/gm;
const ioViewInputSetRegex =
	/^(\/\*[\r\n|\r|\n]@functionrunner input set)([\s\S]*?\*\/)$/gm;

export function findHeaderSection(
	document: JsTsTextDocument,
): Range | undefined {
	const text = document.getText();
	const headerMatches = Array.from(text.matchAll(ioViewHeaderRegex));

	if (headerMatches.length === 0) {
		return undefined;
	}

	const ioViewHeaderRange = regexMatchToRange(document, headerMatches[0]);
	return ioViewHeaderRange;
}

export function findFooterSection(document: JsTsTextDocument): Range {
	const footerStartPosition = new Position(document.lineCount - 1, 0);
	const footerEndPosition = new Position(
		document.lineCount - 1,
		document.lineAt(document.lineCount - 1).text.length,
	);
	const footerRange = new Range(footerStartPosition, footerEndPosition);
	return footerRange;
}

export function findInputSetsForCodeLens(
	document: JsTsTextDocument,
): InputSetRangeAndId[] {
	const text = document.getText();
	const inputSetCommentMatches = text.matchAll(ioViewInputSetRegex);

	const inputSets: InputSetRangeAndId[] = [];
	for (const inputSetCommentMatch of inputSetCommentMatches) {
		const inputSetCommentRange = regexMatchToRange(
			document,
			inputSetCommentMatch,
		);
		inputSets.push({
			range: inputSetCommentRange,
		});
	}
	return inputSets;
}

export const findCodeLensPositionsFromJsTsInputSetView = (
	document: JsTsTextDocument,
): InputSetViewCodeLensPositions | undefined => {
	try {
		const ioViewHeader = findHeaderSection(document);
		if (ioViewHeader === undefined) {
			return undefined;
		}

		const inputSets = findInputSetsForCodeLens(document);

		const ioViewFooter = findFooterSection(document);

		return {
			header: ioViewHeader,
			footer: ioViewFooter,
			inputSets,
		};
	} catch (error) {
		const message = 'Error parsing InputOutputView Content!';
		const logger = container.resolve(LoggerService);
		logger.error(error, message);
		throw error;
	}
};
