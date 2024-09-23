import {
	Expression,
	factory,
	Identifier,
	NodeFlags,
	Statement,
	TypeNode,
	VariableStatement,
} from 'typescript';

export function createEmptyLineNode<T extends Statement>(): T {
	return factory.createIdentifier('\n') as unknown as T;
}

export function createEmptyNode<T extends Statement>(): T {
	return factory.createIdentifier('') as unknown as T;
}

export function createVariableStatement(
	varName: string | Identifier,
	varInitializer: Expression | undefined,
	varType: TypeNode | undefined = undefined,
	constant: boolean = true,
): VariableStatement {
	const varDec = factory.createVariableDeclaration(
		typeof varName === 'string' ? factory.createIdentifier(varName) : varName,
		undefined,
		varType,
		varInitializer,
	);
	const varDecList = factory.createVariableDeclarationList(
		[varDec],
		constant ? NodeFlags.Const : NodeFlags.Let,
	);
	const newVarStmt = factory.createVariableStatement(undefined, varDecList);
	// newVarStmt = setParentRecursive(newVarStmt, true);
	return newVarStmt;
}
