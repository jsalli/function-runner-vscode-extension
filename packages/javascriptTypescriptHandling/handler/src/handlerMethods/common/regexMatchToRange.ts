import { LoggerService } from '@functionrunner/shared';
import { container } from 'tsyringe';
import { Position, Range, TextDocument } from 'vscode';

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
		const logger = container.resolve(LoggerService);
		logger.error(error, message);
		throw error;
	}

	return range;
}
