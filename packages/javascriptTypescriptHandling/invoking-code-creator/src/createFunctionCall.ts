import {
	CallExpression,
	Expression,
	ExpressionStatement,
	factory,
	Identifier,
	PropertyAccessExpression,
	TypeNode,
} from 'typescript';

export function createPropertyAccessExpression(
	caller: (string | Identifier)[],
): PropertyAccessExpression {
	if (caller.length < 2) {
		throw new Error(`Only ${caller.length} caller props. Requires 2 or more`);
	}

	let propAccExp!: PropertyAccessExpression;
	for (let i = 1; i < caller.length; i++) {
		if (i === 1) {
			propAccExp = factory.createPropertyAccessExpression(
				typeof caller[0] === 'string'
					? factory.createIdentifier(caller[0])
					: caller[0],
				typeof caller[1] === 'string' ? caller[1] : caller[1].text,
			);
			continue;
		}
		const prop = caller[i];
		propAccExp = factory.createPropertyAccessExpression(
			propAccExp,
			typeof prop === 'string' ? prop : prop.text,
		);
	}

	return propAccExp;
}

export function createFunctionCall(
	caller: Identifier | string | (Identifier | string)[],
	args: Expression[],
	returnType: TypeNode[] | undefined,
	returnValueType: 'ExpressionStatement',
): ExpressionStatement;
export function createFunctionCall(
	caller: Identifier | string | (Identifier | string)[],
	args: Expression[],
	returnType: TypeNode[] | undefined,
	returnValueType: 'CallExpression',
): CallExpression;
export function createFunctionCall(
	caller: Identifier | string | (Identifier | string)[],
	args: Expression[],
	returnType: TypeNode[] | undefined,
	returnValueType: 'ExpressionStatement' | 'CallExpression',
): CallExpression | ExpressionStatement {
	let callerExp: Identifier | PropertyAccessExpression;
	if (Array.isArray(caller)) {
		callerExp = createPropertyAccessExpression(caller);
	} else {
		callerExp =
			typeof caller === 'string' ? factory.createIdentifier(caller) : caller;
	}
	const callExp = factory.createCallExpression(callerExp, returnType, args);

	if (returnValueType === 'CallExpression') {
		return callExp;
	}

	const expStat = factory.createExpressionStatement(
		factory.createVoidExpression(callExp),
	);
	return expStat;
}
