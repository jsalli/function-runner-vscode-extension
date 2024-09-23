import { inject, injectable, singleton } from 'tsyringe';
import {
	Disposable,
	Event,
	EventEmitter,
	SecretStorageChangeEvent,
} from 'vscode';
import type { ExtensionContext } from 'vscode';

@injectable()
@singleton()
export class StorageService implements Disposable {
	constructor(
		@inject('ExtensionContext')
		private readonly extensionContext: ExtensionContext,
	) {
		this.disposable = this.extensionContext.secrets.onDidChange((e) =>
			this.onDidChangeSecretsEventEmitter.fire(e),
		);
	}

	private onDidChangeSecretsEventEmitter =
		new EventEmitter<SecretStorageChangeEvent>();
	get onDidChangeSecrets(): Event<SecretStorageChangeEvent> {
		return this.onDidChangeSecretsEventEmitter.event;
	}

	private readonly disposable: Disposable;

	dispose(): void {
		this.disposable?.dispose();
	}

	get<T>(key: StorageKeys): T | undefined;
	get<T>(key: StorageKeys, defaultValue: T): T;
	get<T>(key: StorageKeys, defaultValue?: T): T | undefined {
		return this.extensionContext.globalState.get(key, defaultValue);
	}

	async delete(key: StorageKeys): Promise<void> {
		return this.extensionContext.globalState.update(key, undefined);
	}

	async store<T>(key: StorageKeys, value: T): Promise<void> {
		return this.extensionContext.globalState.update(key, value);
	}
}

export enum StorageKeys {
	WelcomeViewViewed = 'functionrunner:views:welcome:',
	ShowNewUnitTestGeneratedNotification = 'functionrunner:notification:newUnitTestGenerated:show',
}
