import {
	createVariableStatement,
	RunnableJsTsFunctionArg,
} from '@functionrunner/javascript-typescript-shared';
import { factory, Node, SyntaxKind, TypeNode } from 'typescript';

export function createInputsSection(args: RunnableJsTsFunctionArg[]): Node[] {
	const inputNodes: Node[] = [];
	for (const arg of args) {
		let inputType: TypeNode | undefined;
		if (arg.type?.typeNode !== undefined) {
			const input = args.find((funcArg) => funcArg.name === arg.name)!;
			if (input.optional === true) {
				const optionalType = factory.createUnionTypeNode([
					arg.type.typeNode,
					factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
				]);
				inputType = optionalType;
			} else {
				inputType = arg.type?.typeNode;
			}
		} else {
			inputType = undefined;
		}

		const defaultValue = factory.createIdentifier('undefined');

		const argNode = createVariableStatement(arg.name, defaultValue, inputType);

		inputNodes.push(argNode);
	}
	return inputNodes;
}
