import {
	CallExpression,
	Expression,
	factory,
	Identifier,
	isIdentifier,
	isPropertyAccessExpression,
	PropertyAccessExpression,
} from 'typescript';
import { createPropertyAccessExpression } from './createFunctionCall';

export function createPropertyAccessCallExp(
	propAccess: PropertyAccessExpression,
	args?: (string | Expression)[], // string is converted into an Identifier
): CallExpression;
export function createPropertyAccessCallExp(
	parent: string | Identifier,
	prop: string | Identifier,
	args?: (string | Expression)[], // string is converted into an Identifier
): CallExpression;
export function createPropertyAccessCallExp(
	propAccessOrparent: (string | Identifier) | PropertyAccessExpression,
	propOrArgs?: (string | Identifier) | (string | Expression)[],
	maybeArgs?: (string | Expression)[],
): CallExpression {
	let propAccessStatement: PropertyAccessExpression;
	let args: (string | Expression)[] | undefined;

	// Test for the second override
	if (
		(typeof propAccessOrparent === 'string' ||
			isIdentifier(propAccessOrparent)) &&
		propOrArgs !== undefined &&
		!Array.isArray(propOrArgs)
	) {
		propAccessStatement = createPropertyAccessExpression([
			propAccessOrparent,
			propOrArgs,
		]);
		args = maybeArgs;
	}
	// Test for the first override
	else if (
		typeof propAccessOrparent !== 'string' &&
		isPropertyAccessExpression(propAccessOrparent) &&
		(propOrArgs === undefined || Array.isArray(propOrArgs))
	) {
		propAccessStatement = propAccessOrparent;
		args = propOrArgs;
	} else {
		const message = 'Wrong arguments for createPropertyAccessCallExp';
		throw new Error(message);
	}

	return factory.createCallExpression(
		propAccessStatement,
		undefined,
		args !== undefined
			? args.map((arg) =>
					typeof arg === 'string' ? factory.createIdentifier(arg) : arg,
				)
			: [],
	);
}
