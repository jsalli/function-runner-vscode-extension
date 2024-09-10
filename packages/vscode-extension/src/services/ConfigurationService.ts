import {
	ConfigurationChangeEvent,
	ConfigurationScope,
	ConfigurationTarget,
	Event,
	EventEmitter,
	ExtensionContext,
	workspace,
} from 'vscode';
import { Config } from '../config';
import { injectable, singleton, inject } from 'tsyringe';

const configPrefix = 'functionrunner';

@singleton()
@injectable()
export class ConfigurationService {
	constructor(
		@inject('ExtensionContext') private extensionContext: ExtensionContext,
	) {
		this.extensionContext.subscriptions.push(
			workspace.onDidChangeConfiguration(this.onConfigurationChanged, this),
		);
	}

	private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
	get onDidChange(): Event<ConfigurationChangeEvent> {
		return this._onDidChange.event;
	}

	private _onDidChangeAny = new EventEmitter<ConfigurationChangeEvent>();
	get onDidChangeAny(): Event<ConfigurationChangeEvent> {
		return this._onDidChangeAny.event;
	}

	private onConfigurationChanged(e: ConfigurationChangeEvent) {
		if (!e.affectsConfiguration(configPrefix)) {
			this._onDidChangeAny.fire(e);

			return;
		}

		this._onDidChangeAny.fire(e);
		this._onDidChange.fire(e);
	}

	get(): Config;
	get<T extends ConfigPath>(
		section: T,
		scope?: ConfigurationScope | null,
		defaultValue?: ConfigPathValue<T>,
	): ConfigPathValue<T>;
	get<T extends ConfigPath>(
		section?: T,
		scope?: ConfigurationScope | null,
		defaultValue?: ConfigPathValue<T>,
	): Config | ConfigPathValue<T> {
		return defaultValue === undefined
			? workspace
					.getConfiguration(
						section === undefined ? undefined : configPrefix,
						scope,
					)
					.get<
						ConfigPathValue<T>
					>(section === undefined ? configPrefix : section)!
			: workspace
					.getConfiguration(
						section === undefined ? undefined : configPrefix,
						scope,
					)
					.get<
						ConfigPathValue<T>
					>(section === undefined ? configPrefix : section, defaultValue)!;
	}

	getAny<T>(section: string, scope?: ConfigurationScope | null): T | undefined;
	getAny<T>(
		section: string,
		scope: ConfigurationScope | null | undefined,
		defaultValue: T,
	): T;
	getAny<T>(
		section: string,
		scope?: ConfigurationScope | null,
		defaultValue?: T,
	): T | undefined {
		return defaultValue === undefined
			? workspace.getConfiguration(undefined, scope).get<T>(section)
			: workspace
					.getConfiguration(undefined, scope)
					.get<T>(section, defaultValue);
	}

	changed<T extends ConfigPath>(
		e: ConfigurationChangeEvent | undefined,
		section: T,
		scope?: ConfigurationScope | null | undefined,
	): boolean {
		return (
			e?.affectsConfiguration(`${configPrefix}.${section}`, scope!) ?? true
		);
	}

	inspect<T extends ConfigPath, V extends ConfigPathValue<T>>(
		section: T,
		scope?: ConfigurationScope | null,
	) {
		return workspace
			.getConfiguration(section === undefined ? undefined : configPrefix, scope)
			.inspect<V>(section === undefined ? configPrefix : section);
	}

	inspectAny<T>(section: string, scope?: ConfigurationScope | null) {
		return workspace.getConfiguration(undefined, scope).inspect<T>(section);
	}

	name<T extends ConfigPath>(section: T): string {
		return section;
	}

	update<T extends ConfigPath>(
		section: T,
		value: ConfigPathValue<T> | undefined,
		target: ConfigurationTarget,
	): Thenable<void> {
		return workspace
			.getConfiguration(configPrefix)
			.update(section, value, target);
	}

	updateAny(
		section: string,
		value: any,
		target: ConfigurationTarget,
		scope?: ConfigurationScope | null,
	): Thenable<void> {
		return workspace
			.getConfiguration(
				undefined,
				target === ConfigurationTarget.Global ? undefined : scope!,
			)
			.update(section, value, target);
	}
}

type SubPath<T, Key extends keyof T> = Key extends string
	? T[Key] extends Record<string, any>
		?
				| `${Key}.${SubPath<T[Key], Exclude<keyof T[Key], keyof any[]>> &
						string}`
				| `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
		: never
	: never;

type Path<T> = SubPath<T, keyof T> | keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? Rest extends Path<T[Key]>
			? PathValue<T[Key], Rest>
			: never
		: never
	: P extends keyof T
		? T[P]
		: never;

type ConfigPath = Path<Config>;
type ConfigPathValue<P extends ConfigPath> = PathValue<Config, P>;
