import { serializeError } from 'serialize-error';
import {
	CodePosition,
	KnownError,
	NotSupportedFunction,
} from '@functionrunner/shared';

export function createNotSupportedFunction(
	error: unknown,
	{
		name,
		codePosition,
		sourceFilePath,
		languageId,
	}: {
		name: string;
		codePosition: CodePosition;
		sourceFilePath: string;
		languageId: string;
	},
): NotSupportedFunction {
	let shortFailReason: string;
	let longFailReason: string | undefined;
	let githubIssueUrl: string | undefined;
	if (error instanceof KnownError) {
		({ shortFailReason, longFailReason, githubIssueUrl } = error);
	} else {
		const errorMessage =
			error instanceof Error
				? error.message
				: JSON.stringify(serializeError(error));
		shortFailReason = errorMessage;
	}
	const notSuppFunc = new NotSupportedFunction(
		name,
		codePosition,
		sourceFilePath,
		languageId,
		shortFailReason,
		longFailReason,
		githubIssueUrl,
	);
	return notSuppFunc;
}
