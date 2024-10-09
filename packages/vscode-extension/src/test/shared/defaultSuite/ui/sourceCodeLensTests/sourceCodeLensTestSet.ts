import * as assert from 'assert';
import { commands } from 'vscode';
import { getLenses } from './shared';

export interface SourceCodeLensTest {
	testWorkspaceFixtureName: string;
	fileName: string;
	srcCodeLensTestFilePath: string;
	numberOfFoundFunctions: number;
}

export const sourceCodeLensTestSet = {
	name({ testWorkspaceFixtureName, fileName }: SourceCodeLensTest): string {
		return `Testing codelens for source files for ${testWorkspaceFixtureName}. Filename: ${fileName}`;
	},
	// srcCodeLensTestFolderPath is relative to the test project's root path
	callback({
		testWorkspaceFixtureName,
		srcCodeLensTestFilePath,
		numberOfFoundFunctions,
	}: SourceCodeLensTest): () => Promise<void> {
		return async () => {
			const lenses = await getLenses(
				testWorkspaceFixtureName,
				srcCodeLensTestFilePath,
			);
			assert.equal(lenses.length, numberOfFoundFunctions);
			for (const lens of lenses) {
				assert.equal(lens.command?.title, 'Run or Debug Function');
			}

			await commands.executeCommand('workbench.action.closeActiveEditor');
		};
	},
};
