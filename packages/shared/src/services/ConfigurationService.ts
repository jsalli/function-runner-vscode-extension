import {
	ConfigurationChangeEvent,
	ConfigurationScope,
	ConfigurationTarget,
	Event,
	EventEmitter,
	workspace,
} from 'vscode';
import type { ExtensionContext } from 'vscode';
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

	private onDidChangeEventEmitter =
		new EventEmitter<ConfigurationChangeEvent>();
	public get onDidChange(): Event<ConfigurationChangeEvent> {
		return this.onDidChangeEventEmitter.event;
	}

	private onDidChangeAnyEventEmitter =
		new EventEmitter<ConfigurationChangeEvent>();
	public get onDidChangeAny(): Event<ConfigurationChangeEvent> {
		return this.onDidChangeAnyEventEmitter.event;
	}

	private onConfigurationChanged(e: ConfigurationChangeEvent) {
		if (!e.affectsConfiguration(configPrefix)) {
			this.onDidChangeAnyEventEmitter.fire(e);

			return;
		}

		this.onDidChangeAnyEventEmitter.fire(e);
		this.onDidChangeEventEmitter.fire(e);
	}

	public get(): Config;
	public get<T extends ConfigPath>(
		section: T,
		scope?: ConfigurationScope | null,
		defaultValue?: ConfigPathValue<T>,
	): ConfigPathValue<T>;
	public get<T extends ConfigPath>(
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

	public getAny<T>(
		section: string,
		scope?: ConfigurationScope | null,
	): T | undefined;
	public getAny<T>(
		section: string,
		scope: ConfigurationScope | null | undefined,
		defaultValue: T,
	): T;
	public getAny<T>(
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

	public changed<T extends ConfigPath>(
		e: ConfigurationChangeEvent | undefined,
		section: T,
		scope?: ConfigurationScope | null | undefined,
	): boolean {
		return (
			e?.affectsConfiguration(`${configPrefix}.${section}`, scope!) ?? true
		);
	}

	public inspect<T extends ConfigPath, V extends ConfigPathValue<T>>(
		section: T,
		scope?: ConfigurationScope | null,
	) {
		return workspace
			.getConfiguration(section === undefined ? undefined : configPrefix, scope)
			.inspect<V>(section === undefined ? configPrefix : section);
	}

	public inspectAny<T>(section: string, scope?: ConfigurationScope | null) {
		return workspace.getConfiguration(undefined, scope).inspect<T>(section);
	}

	public name<T extends ConfigPath>(section: T): string {
		return section;
	}

	public update<T extends ConfigPath>(
		section: T,
		value: ConfigPathValue<T> | undefined,
		target: ConfigurationTarget,
	): Thenable<void> {
		return workspace
			.getConfiguration(configPrefix)
			.update(section, value, target);
	}

	public updateAny(
		section: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	? // eslint-disable-next-line @typescript-eslint/no-explicit-any
		T[Key] extends Record<string, any>
		? // eslint-disable-next-line @typescript-eslint/no-explicit-any
			| `${Key}.${SubPath<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
