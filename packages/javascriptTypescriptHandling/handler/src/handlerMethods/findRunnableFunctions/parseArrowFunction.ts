import {
	RunnableJsTsFunctionArg,
	TypeNodeSpecifier,
} from '@functionrunner/javascript-typescript-shared';
import {
	ArrowFunction,
	getCombinedModifierFlags,
	ModifierFlags,
	SourceFile,
} from 'typescript';
import { parseFunctionArguments, parseReturn } from './common';

export function parseArrowFunction(
	node: ArrowFunction,
	sourceFile: SourceFile,
): {
	async: boolean;
	generator: boolean;
	args: RunnableJsTsFunctionArg[];
	returnValue: TypeNodeSpecifier;
} {
	const async = (getCombinedModifierFlags(node) & ModifierFlags.Async) !== 0;
	const generator = false;
	const args: RunnableJsTsFunctionArg[] = parseFunctionArguments(
		node.parameters,
		sourceFile,
	);
	const returnValue = parseReturn(node.type, sourceFile);
	return {
		async,
		generator,
		args,
		returnValue,
	};
}
