import { Range, TextDocument } from 'vscode';

export class CodePosition {
	private start: { line: number; character: number };
	private end: { line: number; character: number };

	constructor(document: TextDocument, startPos: number, endPos: number) {
		const startLine = document.lineAt(document.positionAt(startPos).line);
		const endLine = document.lineAt(document.positionAt(endPos).line);

		this.start = { line: startLine.lineNumber, character: 0 };
		this.end = { line: endLine.lineNumber, character: 0 };
	}

	public getRange(): Range {
		return new Range(
			this.start.line,
			this.start.character,
			this.end.line,
			this.end.character,
		);
	}
}
