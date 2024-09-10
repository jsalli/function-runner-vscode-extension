import { type as platFormType } from 'os';
import { posix } from 'path';
import fastGlob, { sync as fastGlobSync } from 'fast-glob';
import { copy, ensureDir, readFileSync, writeFile } from 'fs-extra';

export async function makeFileToFolder(
	folderPath: string,
	fileName: string,
	content: string,
): Promise<string> {
	const filePath = normalizeJoin(folderPath, fileName);
	await ensureDir(folderPath);
	await writeFile(filePath, content);
	return filePath;
}

export async function copyFolder(
	srcFolderPath: string,
	destFolderPath: string,
	// include?: string | string[],
	// exclude?: string | string[] | undefined,
): Promise<void> {
	// TODO: Add filter implementation
	// const filter: CopyFilterAsync = (src: string, dest: string): Promise<boolean> => {

	// };

	await copy(srcFolderPath, destFolderPath, {
		overwrite: true,
		// filter
	});
}

export async function listFiles(
	include: string | string[],
	exclude?: string | string[],
): Promise<string[]> {
	const excludeArr =
		exclude !== undefined
			? Array.isArray(exclude)
				? exclude
				: [exclude]
			: undefined;
	const files = await fastGlob(include, { ignore: excludeArr });
	return files;
}

export function listFilesSync(
	include: string | string[],
	exclude?: string | string[],
): string[] {
	const excludeArr =
		exclude !== undefined
			? Array.isArray(exclude)
				? exclude
				: [exclude]
			: undefined;
	const files = fastGlobSync(include, { ignore: excludeArr });
	return files;
}

export async function writeToFile(
	filePath: string,
	content: string,
): Promise<void> {
	await writeFile(filePath, content);
}

export async function copyFile(
	srcFilePath: string,
	destFilePath: string,
): Promise<void> {
	await copy(srcFilePath, destFilePath, {
		overwrite: true,
		// filter
	});
}

export function readFilePathSync(filePath: string): string {
	return readFileSync(filePath, { encoding: 'utf-8' });
}

export function normalizeJoin(...pathParts: string[]): string {
	const joinedPath = posix.join(...pathParts);
	const normPath = normalizePath(joinedPath);
	return normPath;
}

/**
 * Normalize path in Windows to be without \ (back slash)
 *
 * @param path
 * @returns
 */
export function normalizePath(path: string) {
	if (platFormType() === 'Windows_NT') {
		return posix.normalize(path).replace(/\\/g, '/');
	}
	return path;
}
