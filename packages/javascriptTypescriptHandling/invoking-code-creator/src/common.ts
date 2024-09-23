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
	ioViewIdentifierPostFix,
	isPromiseReturned,
	outputIdentifierName,
} from '@functionrunner/javascript-typescript-shared';

/**
 * @example
 * // Create the following line
 * const output_3ck4943 = myFunc(myArg__1, myArg__2);
 *
 * @param runnableFunction
 * @param id
 * @returns
 */
export function createFuncCallAndOutputAssignment(
	runnableFunction: RunnableJsTsFunction,
	id: string,
	outputAssignment: 'toNewVar' | 'toExistingVar',
): {
	functionCallNode: VariableStatement | ExpressionStatement;
	outputIdentifier: Identifier;
} {
	let callExp: CallExpression | AwaitExpression;
	callExp = factory.createCallExpression(
		factory.createIdentifier(
			runnableFunction.name !== undefined
				? runnableFunction.name
				: defaultExportFunctionName,
		),
		undefined,
		runnableFunction.args.map((arg) =>
			factory.createIdentifier(`${arg.name}${ioViewIdentifierPostFix}${id}`),
		),
	);

	const returnsProm = isPromiseReturned(runnableFunction);
	if (returnsProm === true || returnsProm === null) {
		callExp = factory.createAwaitExpression(callExp);
	}

	let varStatement: VariableStatement | ExpressionStatement;
	const outputId = factory.createIdentifier(
		`${outputIdentifierName}${ioViewIdentifierPostFix}${id}`,
	);
	if (outputAssignment === 'toNewVar') {
		varStatement = createVariableStatement(outputId, callExp);
	} else {
		varStatement = factory.createExpressionStatement(
			factory.createBinaryExpression(outputId, SyntaxKind.EqualsToken, callExp),
		);
	}

	return { functionCallNode: varStatement, outputIdentifier: outputId };
}
