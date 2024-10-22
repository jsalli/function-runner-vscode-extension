import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { processOutputToOutputChannel } from '../common/processOutputToOutputChannel';
import { createJsTsFuncExecutionInExtProcess } from '../common/createJsTsFuncExecutionInExtProcess';

export const runJsTsFunctionWithInputSets = async (
	runnableFunction: RunnableJsTsFunction,
	inputViewContent: string,
	returnSuccessForTest: boolean | undefined,
): Promise<string> => {
	const process = await createJsTsFuncExecutionInExtProcess({
		runnableFunction,
		inputViewContent,
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
