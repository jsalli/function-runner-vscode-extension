import { join, resolve } from 'path';
import { readFile as readFileContent, unlink, writeFile } from 'fs-extra';

// __dirname at runtime will the the "<project-root-folder>/out/test/suite/<test-project-fixture-name>" folder
const srcTestFolderPath = join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'src',
	'test',
);

function getTestExpectsAndFixturesFolderPath(
	testProjectFixtureName: string,
): string {
	return join(
		srcTestFolderPath,
		'testProjectFixtures',
		testProjectFixtureName,
		'testExpectsAndFixtures',
	);
}

export function getTestProjectRootPath(testProjectFixtureName: string): string {
	return join(
		srcTestFolderPath,
		'testProjectFixtures',
		testProjectFixtureName,
		'projectFiles',
	);
}

async function readFile(filePath: string): Promise<string> {
	const fileData = await readFileContent(filePath, { encoding: 'utf-8' });
	return fileData;
}

/**
 * Open file from src/test/testProjectFixtures/<project-name>/testExpectsAndFixtures"-folder's sub folder
 *
 * Remove carrier return if exists from the returned string
 *
 * @param testProjectFixtureName
 * @param pathParts
 * @returns
 */
export async function readFileFromTestExpectsAndFixtures(
	testProjectFixtureName: string,
	pathParts: string,
): Promise<string> {
	const pathToFile = join(
		getTestExpectsAndFixturesFolderPath(testProjectFixtureName),
		pathParts,
	);
	const fileData = await readFile(pathToFile);

	return fileData.replace(/\r/g, '');
}

export function getProjectFilesPathFromOutDir(
	rootPath: string,
	projectName: string,
) {
	return resolve(
		rootPath,
		'..',
		'..',
		'src',
		'test',
		'testProjectFixtures',
		projectName,
		'projectFiles',
	);
}

export async function deleteFile(fileToDeletePath: string): Promise<void> {
	await unlink(fileToDeletePath);
}

export async function createFile(
	filePathToCreate: string,
	fileContent: string,
): Promise<void> {
	await writeFile(filePathToCreate, fileContent);
}
