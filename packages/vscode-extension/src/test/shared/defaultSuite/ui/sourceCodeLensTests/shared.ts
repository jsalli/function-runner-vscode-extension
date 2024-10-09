import { join } from 'path';
import { CodeLens, window, workspace } from 'vscode';
import { getTestProjectRootPath } from '../../../../utils/fileUtils';
import { getCodeLenses } from '../../../../utils/utils';

async function openFileAndGetLenses(
	sourceFilePath: string,
): Promise<CodeLens[]> {
	const document = await workspace.openTextDocument(sourceFilePath);
	await window.showTextDocument(document);

	// Wait for the codelenses to be resolved and displayed
	const lenses = await getCodeLenses(document.uri, 10);

	return lenses;
}

export async function getLenses(
	testWorkspaceFixtureName: string,
	testFilePathRelToTestProjectRoot: string,
): Promise<CodeLens[]> {
	const testProjectRootPath = getTestProjectRootPath(testWorkspaceFixtureName);
	const sourceFilePath = join(
		testProjectRootPath,
		testFilePathRelToTestProjectRoot,
	);

	const lenses = await openFileAndGetLenses(sourceFilePath);

	return lenses;
}
