import { TypeNode } from 'typescript';

export interface NamedTypeImport {
	importName: string;
	importPropertyName?: string | undefined;
}

export function isNamedTypeImport(obj: unknown): obj is NamedTypeImport {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'importName' in obj &&
		typeof obj['importName'] === 'string'
	);
}

export interface TypeImport {
	namedImports: NamedTypeImport[] | undefined;
	defaultImport: string | undefined;
	path: string | null;
}

export interface TestableFunctionArgs {
	name: string;
	optional: boolean;
	type: TypeNodeSpecifier | undefined;
}

export interface ImportSpecifier {
	importPath: string | null;
	importType: 'default' | 'named';
	importName: string;
	importPropertyName: string | undefined;
}

export interface TypeNodeSpecifier {
	importSpecifiers: ImportSpecifier[] | undefined;
	typeAsString: string | undefined;
	typeNode: TypeNode | undefined;
}

export class DefaultExport {
	public exportType = 'DefaultExport';
}

/**
 * Don't use "instanceof" operator with the DefaultExport-class as webpack bundling might break the "instanceof" operator.
 * https://stackoverflow.com/questions/55248903/error-instanceof-myerror-returning-different-values
 *
 * Also don't use constructor name as it might change in minification. Chaniging of class names can be prevented in minification.
 * But for obfuscation of code the class minification might be good.
 */
export function isDefaultExport(obj: unknown): obj is DefaultExport {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'exportType' in obj &&
		obj.exportType === 'DefaultExport'
	);
}

export class NamedExport {
	public exportType = 'NamedExport';
}

/**
 * Don't use "instanceof" operator with the NamedExport-class as webpack bundling might break the "instanceof" operator.
 * https://stackoverflow.com/questions/55248903/error-instanceof-myerror-returning-different-values
 */
export function isNamedExport(obj: unknown): obj is NamedExport {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'exportType' in obj &&
		obj.exportType === 'NamedExport'
	);
}
