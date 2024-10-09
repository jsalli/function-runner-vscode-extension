import * as assert from 'assert';
import { TextEditor } from 'vscode';
import { getCodeLenses } from '../../../../utils/utils';

/**
 * Expects the source file to have one testable function and thus generates 9 code lenses to the ioView
 * @param activeEditor
 */
export async function ensureJsTsInputSetViewCodeLenses(
	activeEditor: TextEditor,
): Promise<void> {
	const lenses = await getCodeLenses(activeEditor.document.uri, 8);
	assert.equal(lenses.length, 4);
	assert.equal(lenses[0].command?.title, 'Close');
	assert.equal(lenses[1].command?.title, 'Run this');
	assert.equal(lenses[2].command?.title, 'Debug this');
	assert.equal(lenses[3].command?.title, 'Close');
}
