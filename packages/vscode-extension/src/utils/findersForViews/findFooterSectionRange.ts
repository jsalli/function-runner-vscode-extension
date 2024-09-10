import { Position, Range, TextDocument } from 'vscode';

export function findFooterSectionRange(document: TextDocument): Range {
	const footerStartPosition = new Position(document.lineCount - 1, 0);
	const footerEndPosition = new Position(
		document.lineCount - 1,
		document.lineAt(document.lineCount - 1).text.length,
	);
	const footerRange = new Range(footerStartPosition, footerEndPosition);
	return footerRange;
}
