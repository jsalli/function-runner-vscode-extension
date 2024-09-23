import { container, injectable, registry } from 'tsyringe';
import { StorageKeys, StorageService } from '@functionrunner/shared';
import { Command, Commands } from './Command';
import { LoggerService } from '@functionrunner/shared';

@injectable()
@registry([
	{ token: 'Command', useClass: ClearFunctionRunnerExtensionPreferences },
])
export class ClearFunctionRunnerExtensionPreferences extends Command {
	constructor(logger: LoggerService) {
		super(Commands.ClearFunctionRunnerExtensionPreferences, logger);
	}

	async execute(): Promise<void> {
		try {
			const storageService = container.resolve(StorageService);
			const storePromises = Object.keys(StorageKeys).map((key) =>
				storageService.store(key as StorageKeys, undefined),
			);
			await Promise.all(storePromises);

			this.logger.log(
				"Function Runner extension's stored preferences have been cleared",
			);
		} catch (error) {
			const logMessage =
				"Error clearing Function Runner extension's preferences";
			this.logger.error(error, logMessage);
			throw error;
		}
	}
}
