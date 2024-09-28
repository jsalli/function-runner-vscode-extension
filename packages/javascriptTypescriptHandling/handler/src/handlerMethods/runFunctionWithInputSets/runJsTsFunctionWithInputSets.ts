import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { processOutputToOutputChannel } from './processOutputToOutputChannel';
import { createJsTsFuncExecutionInExtProcess } from './createJsTsFuncExecutionInExtProcess';
import { ConfigurationService } from '@functionrunner/shared';

export const runJsTsFunctionWithInputSets = async (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	configurationService: ConfigurationService,
	returnSuccessForTest: boolean | undefined,
): Promise<string> => {
	const process = await createJsTsFuncExecutionInExtProcess({
		runnableFunction,
		inputViewContent,
		configurationService,
	});

	await processOutputToOutputChannel(
		process,
		runnableFunction.name,
		returnSuccessForTest,
	);

	// return outputResult;
	return 'moikka';
};
