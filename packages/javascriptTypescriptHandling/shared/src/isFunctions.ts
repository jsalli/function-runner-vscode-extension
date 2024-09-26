import {
	ArrowFunction,
	Declaration,
	ExportAssignment,
	FunctionDeclaration,
	getCombinedModifierFlags,
	isArrowFunction,
	isExportAssignment,
	isFunctionDeclaration,
	isIdentifier,
	isTypeReferenceNode,
	isVariableDeclaration,
	isVariableStatement,
	ModifierFlags,
	Node,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore This will cause error on build as it is Typescript internal and not recognized
	isToken as isJsTsToken,
	TypeNode,
	VariableStatement,
} from 'typescript';
import { RunnableJsTsFunction } from './RunnableJsTsFunction';
import { TextDocument } from 'vscode';
import { JsTsTextDocument } from './JsTsTextDocument';
import { javascriptLanguageId, typescriptLanguageId } from './constants';

export function isAsyncFunction(
	func: FunctionDeclaration | ArrowFunction,
): boolean {
	return (getCombinedModifierFlags(func) & ModifierFlags.Async) !== 0;
}

export function isPromiseReturned(
	funcDecNode: FunctionDeclaration | ArrowFunction,
): boolean | null;
export function isPromiseReturned(
	runnableFunction: RunnableJsTsFunction,
): boolean | null;
export function isPromiseReturned(
	fDecNodeOrRunnFunc:
		| FunctionDeclaration
		| ArrowFunction
		| RunnableJsTsFunction,
): boolean | null {
	if (fDecNodeOrRunnFunc instanceof RunnableJsTsFunction) {
		if (fDecNodeOrRunnFunc.async) {
			return true;
		}

		const returnType = fDecNodeOrRunnFunc.returnValue?.typeNode;
		if (returnType === undefined) {
			return null;
		}

		const returnsPromise =
			isTypeReferenceNode(returnType) &&
			isIdentifier(returnType.typeName) &&
			returnType.typeName.text === 'Promise';
		return returnsPromise;
	}

	const returnType = isReturnTypeAPromise(fDecNodeOrRunnFunc.type);
	if (
		(getCombinedModifierFlags(fDecNodeOrRunnFunc) & ModifierFlags.Async) !==
			0 ||
		returnType === true
	) {
		return true;
	} else if (returnType === null) {
		return null;
	}

	return false;
}

export function isReturnTypeAPromise(
	typeNode: TypeNode | undefined,
): boolean | null {
	if (typeNode === undefined) {
		return null;
	}

	if (isTypeReferenceNode(typeNode)) {
		const { typeName } = typeNode;
		if (isIdentifier(typeName) && typeName.text === 'Promise') {
			return true;
		}
	}
	return false;
}

export function isNodeExported(node: Node): boolean {
	if (
		isExportAssignment(node) ||
		(getCombinedModifierFlags(node as Declaration) & ModifierFlags.Export) !== 0
	) {
		return true;
	}
	return false;
}

export function isExportedFunctionDeclaration(
	node: Node | undefined,
): node is FunctionDeclaration {
	if (
		node !== undefined &&
		isNodeExported(node) &&
		isFunctionDeclaration(node)
	) {
		return true;
	}
	return false;
}

export function isExportedArrowFunction(
	node: Node | undefined,
): node is VariableStatement | ExportAssignment {
	if (node !== undefined && isNodeExported(node)) {
		if (isExportAssignment(node) && isArrowFunction(node.expression)) {
			return true;
		} else if (
			isVariableStatement(node) &&
			isVariableDeclaration(node.declarationList.declarations[0]) &&
			node.declarationList.declarations[0].initializer !== undefined &&
			isArrowFunction(node.declarationList.declarations[0].initializer)
		) {
			return true;
		}
		return false;
	}
	return false;
}

export function isToken(maybeNode: unknown): maybeNode is Node {
	return isJsTsToken(maybeNode as Node);
}

export function isJsTsTextDocument(
	document: TextDocument,
): document is JsTsTextDocument {
	return (
		document.languageId === javascriptLanguageId ||
		document.languageId === typescriptLanguageId
	);
}
