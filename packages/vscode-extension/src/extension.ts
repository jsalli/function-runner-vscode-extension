import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { ExtensionContext } from 'vscode';
import {
	LoggerService,
	StorageService,
	ConfigurationService,
	vscodeExtensionModeInjectionToken,
	vscodeExtensionTempFolderInjectionToken,
} from '@functionrunner/shared';
import { CodeLensController } from './codeLens/index';
import type { Command } from './commands/index';
import './commands/index';
import { serializeError } from 'serialize-error';
import { Handler as JsTsHandler } from '@functionrunner/javascript-typescript-handler';
import { Handler as PythonHandler } from '@functionrunner/python-handler';
import {
	RunnableFunctionCache,
	vscodeUniqueExtensionIDInjectionToken,
} from '@functionrunner/shared';
import { extensionTempFolder, vscodeUniqueExtensionID } from './constants';

function registerVSCodeSubscriptions(context: ExtensionContext) {
	const storageService = container.resolve(StorageService);
	context.subscriptions.push(storageService);

	const codeLensController = container.resolve(CodeLensController);
	context.subscriptions.push(codeLensController);

	const allCommands = container.resolveAll<Command>('Command');
	context.subscriptions.push(...allCommands);
}

function registerDependenciesToDIContainer(context: ExtensionContext) {
	container.registerInstance('ExtensionContext', context);
	container.register(ConfigurationService, { useClass: ConfigurationService });
	container.register(LoggerService, { useClass: LoggerService });
	container.register(RunnableFunctionCache, {
		useClass: RunnableFunctionCache,
	});
	container.register<JsTsHandler>(
		'LanguageHandler',
		{ useClass: JsTsHandler },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register<PythonHandler>(
		'LanguageHandler',
		{ useClass: PythonHandler },
		{ lifecycle: Lifecycle.Singleton },
	);

	container.registerInstance(
		vscodeUniqueExtensionIDInjectionToken,
		vscodeUniqueExtensionID,
	);
	container.registerInstance(
		vscodeExtensionModeInjectionToken,
		context.extensionMode,
	);
	container.registerInstance(
		vscodeExtensionTempFolderInjectionToken,
		extensionTempFolder,
	);
}

export function activate(context: ExtensionContext) {
	try {
		registerDependenciesToDIContainer(context);

		registerVSCodeSubscriptions(context);

		const logger = container.resolve(LoggerService);

		logger.log('Extension Started');
	} catch (error) {
		const logger = container.resolve(LoggerService);
		logger.log(JSON.stringify(serializeError(error)));
	}
}

export function deactivate(): void {}
