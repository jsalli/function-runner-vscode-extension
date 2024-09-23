import { normalizePath } from '../utils/fsUtils';
import {
	// RunnableFunction,
	RunnableFunctionType,
} from '../baseClasses/RunnableFunction';
import { NotSupportedFunction } from '../types/NotSupportedFunction';
import { workspace } from 'vscode';
import { FileAndFunctionIdentifier } from '../types/FileAndFunctionIdentifier';

export class RunnableFunctionCache<T extends RunnableFunctionType> {
	private runnableFunctionCache: Map<
		/*file path*/ string,
		Map</*function name*/ string, T>
	> = new Map();

	constructor() {
		// Clear cache when document is closed
		workspace.onDidCloseTextDocument((textDoc) => {
			this.runnableFunctionCache.delete(textDoc.uri.path);
		});

		// Clear cache when a file is renamed
		workspace.onDidRenameFiles((renamedFiles) => {
			renamedFiles.files.forEach((renamedFileEvent) => {
				const filePath = renamedFileEvent.oldUri.path;
				this.runnableFunctionCache.delete(filePath);
			});
		});
	}

	/**
	 *
	 * @param documentFsPath The "document.uri.fsPath" variable
	 * @param foundFunctions
	 */
	public addRunnableFunction(
		documentFsPath: string,
		foundFunctions: (T | NotSupportedFunction)[],
	): void {
		this.runnableFunctionCache.delete(documentFsPath);
		const funcCache = new Map</*function name*/ string, T>();
		for (const func of foundFunctions) {
			if (func instanceof NotSupportedFunction) {
				continue;
			}
			funcCache.set(func.name, func);
		}
		this.runnableFunctionCache.set(documentFsPath, funcCache);
	}

	public getRunnableFunction(
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): T | undefined {
		const normFilePath = normalizePath(
			fileAndFunctionIdentifier.sourceFilePath,
		);
		let funcListInFile: Map<string, T>;
		if (this.runnableFunctionCache.has(normFilePath)) {
			funcListInFile = this.runnableFunctionCache.get(normFilePath)!;
		} else {
			return undefined;
		}

		if (funcListInFile.has(fileAndFunctionIdentifier.functionName)) {
			return funcListInFile.get(fileAndFunctionIdentifier.functionName);
		}
		throw new Error(
			`Could not find function named "${fileAndFunctionIdentifier.functionName}" from file "${normFilePath}"`,
		);
	}
}
