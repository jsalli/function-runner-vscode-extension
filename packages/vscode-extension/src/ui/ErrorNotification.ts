import { KnownError } from '@functionrunner/shared';
import { KnownErrorNotification } from './KnownErrorNotification';
import { UnknownErrorNotification } from './UnknownErrorNotification';

export class ErrorNotification {
	constructor(error: any) {
		if (error instanceof KnownError) {
			new KnownErrorNotification(error.longFailReason, error.githubIssueUrl);
		} else {
			new UnknownErrorNotification(error.message ?? error);
		}
	}
}
