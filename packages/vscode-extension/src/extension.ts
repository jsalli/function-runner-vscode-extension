import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { ExtensionContext} from 'vscode';
import { LoggerService } from './services/LoggerService';
import { StorageService } from './services/StorageService';
import { CodeLensController } from './codeLens/index';
import type { Command } from './commands/index';
import './commands/index';
import { serializeError } from 'serialize-error';
import { Handler as JsTsHandler } from '@functionrunner/javascript-typescript-handler';
import { Handler as PythonHandler } from '@functionrunner/python-handler';

function registerVSCodeSubscriptions(context: ExtensionContext) {
	const storageService = container.resolve(StorageService);
	context.subscriptions.push(storageService);

	const codeLensController = container.resolve(CodeLensController);
	context.subscriptions.push(codeLensController);

	const allCommands = container.resolveAll<Command>('Command');
	context.subscriptions.push(...allCommands);
}

function registerDependenciesToDIContainer(context: ExtensionContext) {
	container.registerInstance<ExtensionContext>('ExtensionContext', context);
	container.register<JsTsHandler>(
		'LanguageHandler',
		{ useClass: JsTsHandler },
		{ lifecycle: Lifecycle.Singleton }
	);
	container.register<PythonHandler>(
		'LanguageHandler',
		{ useClass: PythonHandler },
		{ lifecycle: Lifecycle.Singleton }
	);
}

export function activate(context: ExtensionContext) {
	try {
		registerDependenciesToDIContainer(context)
	
		registerVSCodeSubscriptions(context);
	
		const logger = container.resolve(LoggerService);
	
		logger.log('Extension Started');
	} catch(error) {
		console.log(serializeError(error))
	}
	
}

export function deactivate(): void {}
