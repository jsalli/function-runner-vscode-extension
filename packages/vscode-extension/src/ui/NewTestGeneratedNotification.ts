import { normalizeJoin } from '@functionrunner/shared';
import { window, workspace } from 'vscode';
import { container } from 'tsyringe';
import { StorageKeys, StorageService } from '../services/StorageService';
import { getWorkspaceRootFolder } from '../utils/fsUtils';

// const timeSteps = 6;

// function callFunctionNTimesAfterTime(
// 	numberOfCalls: number,
// 	timeout: number,
// 	callbackFn: (currentCall: number, numberOfCalls: number) => void,
// ) {
// 	let currentCall = 0;
// 	function callFn() {
// 		currentCall += 1;
// 		if (currentCall > numberOfCalls) return;
// 		callbackFn(currentCall, numberOfCalls);
// 		setTimeout(callFn, timeout);
// 	}
// 	setTimeout(callFn, timeout);
// }

export interface TestGenerationError {
	error: any;
}

export interface TestGenerationSuccess {
	filePath: string;
	fileName: string;
}

export class NewTestGeneratedNotification {
	constructor(testGenSuccess: TestGenerationSuccess) {
		const message = `Unit test file "${testGenSuccess.fileName}" generated to "${testGenSuccess.filePath}"`;

		void this.showMessage(message, testGenSuccess);
	}

	private async showMessage(
		message: string,
		testGenSuccess: TestGenerationSuccess,
	): Promise<void> {
		const storageService = container.resolve(StorageService)
		const showNotification = storageService.get<boolean>(
			StorageKeys.ShowNewUnitTestGeneratedNotification,
		);

		if (showNotification === false) {
			return;
		}

		const action = await window.showInformationMessage(
			message,
			'Ok',
			'Open file',
			"Don't show again",
		);

		if (action === "Don't show again") {
			const storageService = container.resolve(StorageService)
			await storageService.store<boolean>(
				StorageKeys.ShowNewUnitTestGeneratedNotification,
				false,
			);
		} else if (action === 'Open file') {
			const projectRootAbsPath = getWorkspaceRootFolder();
			const document = await workspace.openTextDocument(
				normalizeJoin(
					projectRootAbsPath,
					testGenSuccess.filePath,
					testGenSuccess.fileName,
				),
			);
			await window.showTextDocument(document);
		}
	}
}
