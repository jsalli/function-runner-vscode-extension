import { LoggerService } from '../services/LoggerService';
import { KnownErrorNotification } from '../ui/KnownErrorNotification';
import { Command, Commands } from './Command';
import { injectable, registry } from 'tsyringe';

export interface NotSupportedFunctionArgs {
	functionName: string;
	sourceFilePath: string;
	message: string;
	url: string | undefined;
}

export type NotSupportedFunctionReturn = void;

@injectable()
@registry([{ token: 'Command', useClass: NotSupportedFunctionCommand }])
export class NotSupportedFunctionCommand extends Command {
	constructor(logger: LoggerService) {
		super(Commands.NotSupportedFunction, logger);
	}

	execute(args: NotSupportedFunctionArgs): NotSupportedFunctionReturn {
		try {
			new KnownErrorNotification(args.message, args.url);
		} catch (error) {
			const logMessage = 'Could not execute notSupportedFunction command';
			this.logger.error(error, logMessage);
			throw error;
		}
	}
}
