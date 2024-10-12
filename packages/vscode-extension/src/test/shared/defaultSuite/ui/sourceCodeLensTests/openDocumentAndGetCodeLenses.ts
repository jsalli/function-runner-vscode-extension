import { join } from 'path';
import { CodeLens } from 'vscode';
import { getTestProjectRootPath } from '../../../../utils/fileUtils';
import { getCodeLenses } from '../../../../utils/utils';
import { openDocument } from '../../../../utils/viewUtils';

export async function openDocumentAndGetCodeLenses(
	testWorkspaceFixtureName: string,
	testFilePathRelToTestProjectRoot: string,
): Promise<CodeLens[]> {
	const testProjectRootPath = getTestProjectRootPath(testWorkspaceFixtureName);
	const sourceFilePath = join(
		testProjectRootPath,
		testFilePathRelToTestProjectRoot,
	);
	const document = await openDocument(sourceFilePath);

	// Wait for the codelenses to be resolved and displayed
	const lenses = await getCodeLenses(document.uri, 10);

	return lenses;
}
