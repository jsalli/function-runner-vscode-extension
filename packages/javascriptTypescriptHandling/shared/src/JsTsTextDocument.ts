import { TextDocument } from 'vscode';

export type JsTsTextDocument = Omit<TextDocument, 'languageId'> & {
	languageId: 'javascript' | 'typescript';
};
