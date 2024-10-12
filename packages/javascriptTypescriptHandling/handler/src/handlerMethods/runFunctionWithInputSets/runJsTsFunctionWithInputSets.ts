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

	const functionOutputPrint = await processOutputToOutputChannel(
		process,
		runnableFunction.name,
		returnSuccessForTest,
	);

	if (functionOutputPrint === undefined) {
		throw new Error(
			`Function ${runnableFunction.name} run didn't return output print`,
		);
	}

	return functionOutputPrint;
};
