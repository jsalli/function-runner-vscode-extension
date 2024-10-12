import 'reflect-metadata';
import { container } from 'tsyringe';
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
import { serializeError } from 'serialize-error';
import {
	RunnableFunctionCache,
	vscodeUniqueExtensionIDInjectionToken,
} from '@functionrunner/shared';
import { extensionTempFolder, vscodeUniqueExtensionID } from './constants';
// Import classes to register those to tsyringe
import './commands/index';
import '@functionrunner/javascript-typescript-handler';
import '@functionrunner/python-handler';

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

		// Set context as a global as some tests depend on it
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).testExtensionContext = context;

		logger.log('Extension Started');
	} catch (error) {
		const logger = container.resolve(LoggerService);
		logger.log(JSON.stringify(serializeError(error)));
	}
}

export function deactivate(): void {}
