import { KnownError } from '@functionrunner/shared';
import { KnownErrorNotification } from './KnownErrorNotification';
import { UnknownErrorNotification } from './UnknownErrorNotification';

export class ErrorNotification {
	constructor(error: unknown) {
		if (error instanceof KnownError) {
			new KnownErrorNotification(error.longFailReason, error.githubIssueUrl);
		} else {
			const message =
				typeof error === 'object' &&
				error !== null &&
				'message' in error &&
				typeof error.message === 'string'
					? error.message
					: JSON.stringify(error);
			new UnknownErrorNotification(message);
		}
	}
}
