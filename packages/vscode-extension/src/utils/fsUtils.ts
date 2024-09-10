import { posix } from 'node:path';
import { normalizeJoin } from '@functionrunner/shared';
import { existsSync, mkdirSync, readFile, rm, writeFileSync } from 'fs-extra';
import { extensions, workspace } from 'vscode';
import { extensionFolder, vscodeUniqueExtensionID } from '../constants';
import { LoggerService } from '../services/LoggerService';
import { container } from 'tsyringe';
import { serializeError } from 'serialize-error'


export function getWorkspaceRootFolder(): string {
	if (workspace.workspaceFolders === undefined) {
		const message = 'Working folder not found, open a folder an try again';
		const error = new Error(message);
		const logger = container.resolve(LoggerService);
		logger.error(error, message);
		throw error;
	}
	const projectRoot = workspace.workspaceFolders[0].uri.fsPath;
	return projectRoot;
}

export function getExtensionAbsPath(): string {
	const extensionPath = extensions.getExtension(
		vscodeUniqueExtensionID,
	)?.extensionPath;
	if (extensionPath === undefined) {
		const message = `Could not find extensionPath by extension ID: "${vscodeUniqueExtensionID}"`;
		const error = new Error(message);
		const logger = container.resolve(LoggerService);
		logger.error(error, message);
		throw error;
	}
	return extensionPath;
}

export function getExtensionTempDirPath(): string {
	const projectRoot = getWorkspaceRootFolder();
	const extensionTempDirPath = normalizeJoin(projectRoot, extensionFolder);
	return extensionTempDirPath;
}

// export function deleteFile(filePath: string): void {
// 	access(filePath, constants.F_OK, (error) => {
// 		if (error == null) {
// 			return;
// 		}
// 		const message = `File "${filePath}" does not exist`;
// 		Logger.error(error, message);
// 	});
// 	unlinkSync(filePath);
// }

export async function clearFolder(folderPath: string): Promise<void> {
	try {
		if (!existsSync(folderPath)) {
			return;
		}
		await rm(folderPath, { recursive: true });
	} catch (error) {
		const message = `Error deleting folder ${folderPath}`;
		const logger = container.resolve(LoggerService);
		logger.error(error, message, {
			dontSendErrorMessage: true,
			alternativeLogMessage: 'Error deleting folder',
		});
		throw error;
	}
}

// readdir(folderPath, (error, files) => {
// 	if (error !== null) {
// 		const message = 'Error clearning folder';
// 		Logger.error(error, message);
// 		throw error;
// 	}

// 	for (const file of files) {
// 		unlink(normalizeJoin(folderPath, file), (error) => {
// 			if (error !== null) {
// 				const message = 'Error deleting file';
// 				Logger.error(error, message);
// 				throw error;
// 			}
// 		});
// 	}
// });
// }

// export function copyFolder(
// 	sourceFolderPath: string,
// 	destinationFolderPath: string,
// ): void {
// 	copySync(sourceFolderPath, destinationFolderPath, {
// 		recursive: true,
// 	});
// }

export async function clearTempFolder(): Promise<void> {
	const tempFolderPath = getExtensionTempDirPath();
	await clearFolder(tempFolderPath);
}

// export function isInTempFolder(doc: TextDocument): boolean {
// 	if (workspace.workspaceFolders === undefined) {
// 		const message = 'Working folder not found, open a folder an try again';
// 		const error = new Error(message);
// 		Logger.error(error, message);
// 		throw error;
// 	}

// 	const projectRoot = workspace.workspaceFolders[0].uri.fsPath;
// 	const extensionTempDirPath = normalizeJoin(projectRoot, extensionTempFolder);

// 	const filePath = doc.fileName;

// 	const rel = path.relative(extensionTempDirPath, filePath);
// 	return !rel.startsWith('../') && rel !== '..';
// }

// export async function makeOrOverrideFileSync(
// 	filePath: string,
// 	content: string,
// ): Promise<void> {
// 	const edit = new WorkspaceEdit();
// 	const fileUri = Uri.file(filePath);
// 	if (!existsSync(filePath)) {
// 		edit.createFile(fileUri, { overwrite: true });
// 	}
// 	edit.replace(
// 		fileUri,
// 		new Range(new Position(0, 0), new Position(9999999999, 0)),
// 		content,
// 	);
// 	await workspace.applyEdit(edit);
// }

export function ensureExtensionTempFolder(): string {
	const extensionTempDirPath = getExtensionTempDirPath();
	makeDirSync(extensionTempDirPath);
	return extensionTempDirPath;
}

function makeDirSync(dir: string): void {
	if (existsSync(dir)) {
		return;
	}
	if (!existsSync(posix.dirname(dir))) {
		makeDirSync(posix.dirname(dir));
	}
	mkdirSync(dir);
}

export function makeFileToTempFolder(
	fileName: string,
	content: string,
): string {
	const tempFolderPath = ensureExtensionTempFolder();
	const filePath = normalizeJoin(tempFolderPath, fileName);
	// await makeOrOverrideFileSync(filePath, content);
	try {
		writeFileSync(filePath, content, { encoding: 'utf-8' });
		//file written successfully
	} catch (err) {
		const message = `Could not write to file path: ${filePath}. Reason: ${serializeError(err)}`;
		const error = new Error(message);
		const logger = container.resolve(LoggerService);
		logger.error(error, message, {
			dontSendErrorMessage: true,
			alternativeLogMessage: 'Could not write to temp folder',
		});
		throw error;
	}
	return filePath;
}

export function writeToFileSync(
	fileFolderPath: string,
	fileName: string,
	content: string,
): void;
export function writeToFileSync(filePath: string, content: string): void;
export function writeToFileSync(
	filePath: string,
	fileNameOrContect: string,
	content?: string,
) {
	let contentOfFile: string;
	let pathToFile: string;
	if (content !== undefined) {
		contentOfFile = content;
		pathToFile = normalizeJoin(filePath, fileNameOrContect);
	} else {
		contentOfFile = fileNameOrContect;
		pathToFile = filePath;
	}
	writeFileSync(pathToFile, contentOfFile, { encoding: 'utf-8' });
}

export function readFilePathASync(filePath: string): Promise<string> {
	return readFile(filePath, { encoding: 'utf-8' });
}
