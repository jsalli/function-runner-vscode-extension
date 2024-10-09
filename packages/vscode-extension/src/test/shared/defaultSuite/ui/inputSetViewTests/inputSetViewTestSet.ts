import * as assert from 'assert';
import { join, parse } from 'path';
import { ensureActiveEditor } from '../../../../../utils/utils';
import { getTestProjectRootPath } from '../../../../utils/fileUtils';
import {
	closeAllOpenTextDocuments,
	openSourceFileAndInputView,
} from '../../../../utils/viewUtils';
import { ensureJsTsInputSetViewCodeLenses } from './ensureJsTsInputSetViewCodeLenses';
import { getExpectedContent } from './getExpectedContent';

export interface InputSetViewCodeLensTest {
	testWorkspaceFixtureName: string;
	srcFileFolderPathRelToTestProjectRoot: string;
	srcFileName: string;
	functionName: string;
	expectedContentFileName: string;
}
/**
 * Expects the source file to have one testable function and thus generates 9 code lenses to the ioView
 */
export const inputSetViewTestSet = {
	name({
		testWorkspaceFixtureName,
		srcFileName,
		functionName,
	}: InputSetViewCodeLensTest): string {
		return `Testing opening input set view for ${testWorkspaceFixtureName} - ${srcFileName} - ${functionName}`;
	},
	callback({
		testWorkspaceFixtureName,
		srcFileFolderPathRelToTestProjectRoot,
		srcFileName,
		functionName,
		expectedContentFileName,
	}: InputSetViewCodeLensTest): () => Promise<void> {
		return async () => {
			const testProjectRootPath = getTestProjectRootPath(
				testWorkspaceFixtureName,
			);
			const sourceFilePath = join(
				testProjectRootPath,
				srcFileFolderPathRelToTestProjectRoot,
				srcFileName,
			);
			const { fileAndFunctionIdentifier } = await openSourceFileAndInputView(
				sourceFilePath,
				functionName,
			);

			const activeEditor = ensureActiveEditor(fileAndFunctionIdentifier);

			const generatedContent = activeEditor.document.getText();

			const expectedContent = await getExpectedContent(
				fileAndFunctionIdentifier,
				testWorkspaceFixtureName,
				join(
					`${parse(srcFileName).name}.${functionName}`,
					expectedContentFileName,
				),
			);

			assert.strictEqual(generatedContent, expectedContent);

			await ensureJsTsInputSetViewCodeLenses(activeEditor);

			await closeAllOpenTextDocuments();
		};
	},
};
