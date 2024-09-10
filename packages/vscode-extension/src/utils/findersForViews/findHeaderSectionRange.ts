import { Range, TextDocument } from 'vscode';
import { regexMatchToRange } from './findUseCaseInputCodeRanges';

const ioViewHeaderRegex =
	/^(\/\*)([\s\S]*?)(@functionrunner input-view \S*?[\r\n|\r|\n]([\s\S]*?)\*\/)$/gm;


export function findHeaderSectionRange(document: TextDocument): Range | undefined {
	const text = document.getText();
	const headerMatches = Array.from(text.matchAll(ioViewHeaderRegex));

	if (headerMatches.length === 0) {
		return undefined
	}

	const ioViewHeaderRange = regexMatchToRange(document, headerMatches[0]);
	return ioViewHeaderRange
}
