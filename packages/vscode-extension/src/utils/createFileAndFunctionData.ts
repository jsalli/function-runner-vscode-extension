import { TextDocument } from 'vscode';
import { FileAndFunctionData } from '../@types/FileAndFunctionData';

const ioViewFileIdRegex = /^(@functionrunner file-id )(.*)$/gm;

export function createFileAndFunctionData(document: TextDocument): FileAndFunctionData | undefined {
	const documentContent = document.getText()
	const headerMatches = Array.from(documentContent.matchAll(ioViewFileIdRegex));
	if (headerMatches.length === 0) {
		return undefined;
	}

	const fileIdStr = headerMatches[0][2];
	const fileIdObj = JSON.parse(fileIdStr);
	if (typeof fileIdObj !== 'object' && 'filePath' in fileIdObj === false || 'functionName' in fileIdObj === false) {
		throw new Error(
			'The "file-id" did not contain values "filePath" and/or "functionName". Please create the input view again',
		);
	}
	const sourceFilePath = fileIdObj.filePath
	const functionName = fileIdObj.functionName
	if (typeof sourceFilePath !== 'string' || typeof functionName !== 'string') {

		throw new Error('"filePath" and/or "functionName" are not strings')
	}

	return {
		sourceFilePath: sourceFilePath,
		functionName: functionName,
		languageId: document.languageId,
		documentIsUntitled: document.isUntitled
	}

}
