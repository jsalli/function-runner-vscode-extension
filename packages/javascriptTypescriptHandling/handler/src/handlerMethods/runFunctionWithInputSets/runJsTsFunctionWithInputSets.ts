import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { processOutputToOutputChannel } from './processOutputToOutputChannel';
import { createJsTsFuncExecutionInExtProcess } from './createJsTsFuncExecutionInExtProcess';

export const runJsTsFunctionWithInputSets = async (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	inputSetIdentifier: string,
	returnSuccessForTest: boolean | undefined,
): Promise<string> => {
	const process = await createJsTsFuncExecutionInExtProcess({
		runnableFunction,
		inputViewContent,
		inputSetIdentifier,
	});

	await processOutputToOutputChannel(
		process,
		runnableFunction.name,
		returnSuccessForTest,
	);

	// return outputResult;
	return 'moikka';
};
