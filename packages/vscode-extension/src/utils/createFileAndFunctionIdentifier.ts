import { TextDocument } from 'vscode';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';

const ioViewFileIdRegex = /^(@functionrunner file-id )(.*)$/gm;

export function createFileAndFunctionIdentifier(
	document: TextDocument,
): FileAndFunctionIdentifier | undefined {
	const documentContent = document.getText();
	const headerMatches = Array.from(documentContent.matchAll(ioViewFileIdRegex));
	if (headerMatches.length === 0) {
		return undefined;
	}

	const [[, , fileIdStr]] = headerMatches;
	const fileIdObj = JSON.parse(fileIdStr);
	if (
		(typeof fileIdObj !== 'object' && 'filePath' in fileIdObj === false) ||
		'functionName' in fileIdObj === false
	) {
		throw new Error(
			'The "file-id" did not contain values "filePath" and/or "functionName". Please create the input view again',
		);
	}
	const sourceFilePath = fileIdObj.filePath;
	const { functionName } = fileIdObj;
	if (typeof sourceFilePath !== 'string' || typeof functionName !== 'string') {
		throw new Error('"filePath" and/or "functionName" are not strings');
	}

	return {
		sourceFilePath,
		functionName,
		languageId: document.languageId,
		documentIsUntitled: document.isUntitled,
	};
}
