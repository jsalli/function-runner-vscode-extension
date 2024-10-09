import {
	CodeLens,
	commands,
	Position,
	Range,
	TextEdit,
	Uri,
	window,
	workspace,
	WorkspaceEdit,
} from 'vscode';

export const sleepMilliSeconds = (milliSeconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliSeconds));

export const retry = async <T>(
	fn: () => Promise<T>,
	maxAttempts: number,
	delay: number,
) => {
	const execute = async (attempt: number): Promise<T> => {
		const result = await fn();
		if (result !== null && Array.isArray(result) && result.length > 0) {
			return result;
		}
		await sleepMilliSeconds(delay);

		const nextAttempt = attempt + 1;
		if (nextAttempt > maxAttempts) {
			throw new Error(`Max attempts ${maxAttempts} reached`);
		}
		return execute(nextAttempt);
	};
	return execute(1);
};

export async function emptyActiveDocumentContentAndClose(): Promise<void> {
	const activeEditor = window.activeTextEditor;
	if (activeEditor == null) {
		throw new Error('No active editor');
	}

	const textEdits: TextEdit[] = [];
	textEdits.push(
		TextEdit.replace(new Range(new Position(0, 0), new Position(9999, 0)), ''),
	);

	const workEdits = new WorkspaceEdit();
	workEdits.set(activeEditor.document.uri, textEdits);
	await workspace.applyEdit(workEdits);

	await commands.executeCommand('workbench.action.closeActiveEditor');
}

export async function getCodeLenses(
	uri: Uri,
	resolveAmount: number,
	maxAttempts: number = 6,
	delayBetweenAttempts: number = 500,
): Promise<CodeLens[]> {
	const getLenses = async (): Promise<CodeLens[]> => {
		return commands.executeCommand<CodeLens[]>(
			'vscode.executeCodeLensProvider',
			uri,
			resolveAmount,
		);
	};

	const lenses = await retry(getLenses, maxAttempts, delayBetweenAttempts);

	return lenses;
}
