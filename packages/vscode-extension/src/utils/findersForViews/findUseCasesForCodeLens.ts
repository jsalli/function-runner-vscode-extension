import { Range, TextDocument } from 'vscode';
import { ioViewUseCaseRegex, regexMatchToRange } from './findUseCaseInputCodeRanges';

export function findInputSetCodeRanges(
	document: TextDocument,
): Range[] {
	const text = document.getText();
	const testCaseCommentMatches = Array.from(text.matchAll(ioViewUseCaseRegex));

	const testCasesRanges: Range[] = [];
	for (const testCaseCommentMatch of testCaseCommentMatches) {
		const testCaseCommentRange = regexMatchToRange(
			document,
			testCaseCommentMatch,
		);

		testCasesRanges.push(testCaseCommentRange);
	}
	return testCasesRanges;
}
