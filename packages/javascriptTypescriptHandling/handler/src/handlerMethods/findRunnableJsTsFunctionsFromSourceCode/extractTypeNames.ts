import { isIdentifier, isTypeReferenceNode, Node, TypeNode } from 'typescript';

const typesToNotInclude = ['Promise', 'AsyncGenerator'];

export function extractTypeNames(typeNode: TypeNode | undefined): string[] {
	const typesSet = parseTypeNode(typeNode);
	return [...typesSet];
}

function parseTypeNode(typeNode: TypeNode | undefined): Set<string> {
	if (typeNode === undefined) {
		return new Set();
	}

	if (isTypeReferenceNode(typeNode)) {
		const namesSet: Set<string> = new Set();
		const { typeName } = typeNode;
		if (isIdentifier(typeName)) {
			if (
				!typesToNotInclude.some((dontInclude) => dontInclude === typeName.text)
			) {
				namesSet.add(typeName.text);
			}
		}
		if (typeNode.typeArguments != null) {
			typeNode.typeArguments.forEach((node: Node) => {
				const newNames = parseTypeNode(node as TypeNode);
				newNames?.forEach((newName) => namesSet.add(newName));
			});
		}
		return namesSet;
	}
	const namesSet: Set<string> = new Set();
	typeNode.forEachChild((node: Node) => {
		const newNames = parseTypeNode(node as TypeNode);
		newNames?.forEach((newName) => namesSet.add(newName));
	});
	return namesSet;
}
