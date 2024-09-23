import {
	factory,
	Identifier,
	ImportDeclaration,
	ImportSpecifier,
	isIdentifier,
} from 'typescript';
import { RunnableJsTsFunction } from './RunnableJsTsFunction';
import {
	NamedTypeImport,
	isDefaultExport,
	isNamedExport,
	isNamedTypeImport,
} from './RunnableJsTsFunctionSubProperties';
import { isToken } from './isFunctions';
import { parse } from 'path';

export function createFunctionUnderTestImportNode(
	runnableFunction: RunnableJsTsFunction,
): ImportDeclaration {
	let defaultImportName: string | undefined;
	let namedImports: string[] | undefined;
	if (isDefaultExport(runnableFunction.exportType)) {
		defaultImportName = runnableFunction.name;
	} else if (isNamedExport(runnableFunction.exportType)) {
		namedImports = [runnableFunction.name];
	} else {
		throw new Error(
			// @ts-expect-error Prevent fall through in case the function type is mis initialized
			`Unknown function export type. Got ${runnableFunction.functionType.constructor.name}`,
		);
	}
	const importPath = `./${parse(runnableFunction.sourceFilePath).base}`;

	const futImpDec = createImportDeclarationNode(
		defaultImportName,
		namedImports,
		importPath,
	);

	return futImpDec;
}

interface ImportSpecifierData {
	propertyName: string | Identifier | undefined;
	name: string | Identifier;
}

function isImportSpecifierData(
	maybeImportSpecifierData: unknown,
): maybeImportSpecifierData is ImportSpecifierData {
	if (isNode(maybeImportSpecifierData) === true) {
		return false;
	}
	return (
		typeof maybeImportSpecifierData === 'object' &&
		maybeImportSpecifierData !== null &&
		'name' in maybeImportSpecifierData &&
		maybeImportSpecifierData.name !== undefined
	);
}

function namedImportsToImportSpecifiers(
	namedImports:
		| (string | Identifier | ImportSpecifierData | NamedTypeImport)[]
		| undefined,
): ImportSpecifier[] | undefined {
	const importSpecifiers = namedImports
		?.map(
			(imp: string | Identifier | ImportSpecifierData | NamedTypeImport) => {
				if (typeof imp === 'string') {
					return factory.createIdentifier(imp);
				} else if (isImportSpecifierData(imp)) {
					return {
						propertyName:
							typeof imp.propertyName === 'string'
								? factory.createIdentifier(imp.propertyName)
								: imp.propertyName,
						name:
							typeof imp.name === 'string'
								? factory.createIdentifier(imp.name)
								: imp.name,
					};
				} else if (isNamedTypeImport(imp)) {
					if (imp.importPropertyName === undefined) {
						return factory.createIdentifier(imp.importName);
					}
					return {
						propertyName: factory.createIdentifier(imp.importName),
						name: imp.importPropertyName
							? factory.createIdentifier(imp.importPropertyName)
							: undefined,
					};
				} else if (isIdentifier(imp)) {
					return imp;
				}
				throw new Error('Unsupported type');
			},
		)
		.map((imp) => {
			if (isToken(imp) && isIdentifier(imp)) {
				return factory.createImportSpecifier(false, undefined, imp);
			}
			//TODO: Fix
			throw new Error('Moikka');
			//return factory.createImportSpecifier(false, imp.propertyName, imp.name);
		});
	return importSpecifiers;
}

export function createImportDeclarationNode(
	defaultImportName: string | Identifier | undefined,
	namedImports:
		| (string | Identifier | ImportSpecifierData | NamedTypeImport)[]
		| undefined,
	path: string,
): ImportDeclaration {
	const defaultImport =
		defaultImportName === undefined
			? undefined
			: typeof defaultImportName === 'string'
				? factory.createIdentifier(defaultImportName)
				: defaultImportName;

	const importSpecifiers = namedImportsToImportSpecifiers(namedImports);

	const importClause = factory.createImportClause(
		false,
		defaultImport,
		importSpecifiers === undefined
			? undefined
			: factory.createNamedImports(importSpecifiers),
	);

	const importDeclaration = factory.createImportDeclaration(
		undefined,
		importClause,
		factory.createStringLiteral(path),
	);
	return importDeclaration;
}
