/* eslint-disable no-console */
import * as assert from 'assert';
import { FileAndFunctionIdentifier } from '@functionrunner/shared';
import { Commands, Command } from '../../../../../commands/Command';
import { closeAllOpenTextDocuments } from '../../../../utils/viewUtils';
import { sleepMilliSeconds } from '../../../../utils/utils';
import {
	RunOrDebugInputSetsArgs,
	RunOrDebugInputSetsReturn,
} from '../../../../../commands/runOrDebugInputSets';
import { serializeError } from 'serialize-error';

export async function runOrDebugFunctionAndAssert({
	expectedFunctionRunAndDebugOutput,
	functionName,
	fileAndFunctionIdentifier,
	testMode,
}: {
	expectedFunctionRunAndDebugOutput: string;
	functionName: string;
	fileAndFunctionIdentifier: FileAndFunctionIdentifier;
	testMode: 'run' | 'debug';
}) {
	const args: RunOrDebugInputSetsArgs = {
		fileAndFunctionIdentifier,
		returnSuccessForTest: true,
		mode: testMode,
	};

	let functionOutputPrint: string | undefined = undefined;
	try {
		functionOutputPrint = await Command.executeCommand<
			RunOrDebugInputSetsArgs,
			RunOrDebugInputSetsReturn
		>(Commands.RunOrDebugOneInputSets, args);
	} catch (error) {
		console.error(
			`${testMode} failed with error:\n${error instanceof Error ? error.message : serializeError(error)}`,
		);
	}

	assert.notEqual(
		functionOutputPrint,
		undefined,
		`${testMode} the function "${functionName}" crashed`,
	);

	if (functionOutputPrint !== undefined) {
		assert.match(
			functionOutputPrint,
			new RegExp(expectedFunctionRunAndDebugOutput),
			`${testMode} the function "${functionName}" output print did not match expected output print`,
		);
	}

	await closeAllOpenTextDocuments();

	// Try to fix the tests stalling issue do to some timing problem
	await sleepMilliSeconds(1000);
}
