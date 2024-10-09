import { join } from 'path';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { readFileFromTestExpectsAndFixtures } from '../../../../utils/fileUtils';
/**
 * Read the expected content from file on disk.
 * Remove carrier return if exists from the returned string
 *
 * @param fileAndFunctionIdentifier
 * @param testProjectFixtureName
 * @param pathPats
 * @returns
 */
export async function getExpectedContent(
	fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	testProjectFixtureName: string,
	pathToExpectedContent: string,
): Promise<string> {
	const expectedContent = await readFileFromTestExpectsAndFixtures(
		testProjectFixtureName,
		join(pathToExpectedContent),
	);

	return replaceValuesToOverride(expectedContent, fileAndFunctionIdentifier);
}

export function replaceValuesToOverride(
	content: string,
	fileAndFunctionIdentifier: FileAndFunctionIdentifier,
) {
	const { functionName, sourceFilePath: filePath } = fileAndFunctionIdentifier;
	// The fileId is dynamic and depends on the folder structure on your PC
	// so we need to replace it with the real value
	const updatedExpectedContent = content.replace(
		'**file-id-here**',
		JSON.stringify({ functionName, filePath }),
	);

	return updatedExpectedContent.replace(/\r/g, '');
}
