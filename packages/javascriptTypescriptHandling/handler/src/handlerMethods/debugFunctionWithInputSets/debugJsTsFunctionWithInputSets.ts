/* eslint-disable @typescript-eslint/no-unused-vars */
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';

export const debugJsTsFunctionWithInputSets = (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	inputSetIdentifier: string,
	returnSuccessForTest: boolean | undefined,
): Promise<string> => {
	return Promise.resolve('moikka');
};
