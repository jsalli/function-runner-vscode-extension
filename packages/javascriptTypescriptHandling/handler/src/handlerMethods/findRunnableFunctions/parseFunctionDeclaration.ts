import { TypeNodeSpecifier } from '@functionrunner/javascript-typescript-shared';
import {
	FunctionDeclaration,
	getCombinedModifierFlags,
	ModifierFlags,
	SourceFile,
	SyntaxKind,
} from 'typescript';
import { parseFunctionArguments, parseReturn } from './common';
import { RunnableJsTsFunctionArg } from '@functionrunner/javascript-typescript-shared';

export function parseFunctionDeclaration(
	node: FunctionDeclaration,
	sourceFile: SourceFile,
): {
	async: boolean;
	generator: boolean;
	args: RunnableJsTsFunctionArg[];
	returnValue: TypeNodeSpecifier;
} {
	const async = (getCombinedModifierFlags(node) & ModifierFlags.Async) !== 0;
	const generator =
		node.asteriskToken !== undefined
			? node.asteriskToken.kind === SyntaxKind.AsteriskToken
			: false;
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
