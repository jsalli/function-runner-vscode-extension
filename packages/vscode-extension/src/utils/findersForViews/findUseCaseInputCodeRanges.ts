import { Position, Range, TextDocument } from 'vscode';
import { LoggerService } from '../../services/LoggerService';
import { container } from 'tsyringe';

export function regexMatchToRange(
	document: TextDocument,
	regexMatch: RegExpMatchArray,
): Range {
	const startCharIndex = regexMatch.index!;
	const startLine = document.lineAt(document.positionAt(startCharIndex).line);
	const startPosition = new Position(startLine.lineNumber, 0);

	const endCharInder = regexMatch.index! + regexMatch[0].length;
	const endLine = document.lineAt(document.positionAt(endCharInder).line);
	const endPosition = new Position(endLine.lineNumber, endLine.text.length);

	const range = new Range(startPosition, endPosition);

	if (range == null) {
		const message = 'Could not find range for regex match in the document';
		const error = new Error(message);
		const logger = container.resolve(LoggerService)
		logger.error(error, message);
		throw error;
	}

	return range;
}

function testCaseRegexMatchesToCodeRange(
	document: TextDocument,
	prevRegexMatch: RegExpMatchArray,
	nextRegexMatch: RegExpMatchArray | undefined,
): Range {
	const startCharInder = prevRegexMatch.index! + prevRegexMatch[0].length;
	const startLine = document.lineAt(document.positionAt(startCharInder).line);
	const startPosition = new Position(
		startLine.lineNumber,
		startLine.text.length,
	);

	let endPosition: Position;
	if (nextRegexMatch !== undefined) {
		const endCharInder = nextRegexMatch.index!;
		const endLine = document.lineAt(document.positionAt(endCharInder).line);
		endPosition = new Position(endLine.lineNumber, 0);
	} else {
		endPosition = new Position(
			document.lineCount - 1,
			document.lineAt(document.lineCount - 1).text.length,
		);
	}

	const range = new Range(startPosition, endPosition);
	return range;
}


export const ioViewUseCaseRegex =
	/^(\/\*[\r\n|\r|\n]@functionrunner input set)([\s\S]*?)(\*\/)$/gm;

export function findInputSetCodeRanges(document: TextDocument): Range[] {
	const text = document.getText();
	const testCaseCommentMatches = Array.from(text.matchAll(ioViewUseCaseRegex));

	const ioCodeArr: Range[] = [];
	for (let i = 0; i < testCaseCommentMatches.length; i++) {
		const testCaseCodeRange = testCaseRegexMatchesToCodeRange(
			document,
			testCaseCommentMatches[i],
			testCaseCommentMatches[i + 1],
		);
		ioCodeArr.push(testCaseCodeRange);
	}

	return ioCodeArr;
}
