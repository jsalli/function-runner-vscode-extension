import {
	AwaitExpression,
	CallExpression,
	ExpressionStatement,
	factory,
	Identifier,
	SyntaxKind,
	VariableStatement,
} from 'typescript';
import {
	RunnableJsTsFunction,
	createVariableStatement,
	defaultExportFunctionName,
	defaultExportFunctionNameToUseInCode,
	isPromiseReturned,
	outputIdentifierName,
} from '@functionrunner/javascript-typescript-shared';

/**
 * @example
 * // Create the following line
 * const output = myFunc(myArg, myArg);
 *
 * @param runnableFunction
 * @param id
 * @returns
 */
export function createFuncCallAndOutputAssignment(
	runnableFunction: RunnableJsTsFunction,
	outputAssignment: 'toNewVar' | 'toExistingVar',
): {
	functionCallNode: VariableStatement | ExpressionStatement;
	outputIdentifier: Identifier;
} {
	const functionName =
		runnableFunction.name === defaultExportFunctionName
			? defaultExportFunctionNameToUseInCode
			: runnableFunction.name;
	let callExp: CallExpression | AwaitExpression;
	callExp = factory.createCallExpression(
		factory.createIdentifier(functionName),
		undefined,
		runnableFunction.args.map((arg) => factory.createIdentifier(arg.name)),
	);

	const returnsProm = isPromiseReturned(runnableFunction);
	if (returnsProm === true) {
		callExp = factory.createAwaitExpression(callExp);
	}

	let varStatement: VariableStatement | ExpressionStatement;
	const outputId = factory.createIdentifier(outputIdentifierName);
	if (outputAssignment === 'toNewVar') {
		varStatement = createVariableStatement(outputId, callExp);
	} else {
		varStatement = factory.createExpressionStatement(
			factory.createBinaryExpression(outputId, SyntaxKind.EqualsToken, callExp),
		);
	}

	return { functionCallNode: varStatement, outputIdentifier: outputId };
}
