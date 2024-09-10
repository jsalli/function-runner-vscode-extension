import { inject, injectable, singleton } from 'tsyringe';
import {
	Disposable,
	Event,
	EventEmitter,
	ExtensionContext,
	SecretStorageChangeEvent,
} from 'vscode';

@injectable()
@singleton()
export class StorageService implements Disposable {
	constructor(@inject('ExtensionContext') private readonly extensionContext: ExtensionContext) {
		this._disposable = this.extensionContext.secrets.onDidChange((e) =>
			this._onDidChangeSecrets.fire(e),
		);
	}

	private _onDidChangeSecrets = new EventEmitter<SecretStorageChangeEvent>();
	get onDidChangeSecrets(): Event<SecretStorageChangeEvent> {
		return this._onDidChangeSecrets.event;
	}

	private readonly _disposable: Disposable;

	dispose(): void {
		this._disposable?.dispose();
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
