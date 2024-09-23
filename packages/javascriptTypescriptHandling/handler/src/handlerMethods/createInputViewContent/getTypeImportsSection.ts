import { Node } from 'typescript';
import {
	RunnableJsTsFunction,
	TypeImport,
	createImportDeclarationNode,
} from '@functionrunner/javascript-typescript-shared';

function getTypeImports(
	runnableJsTsFunction: RunnableJsTsFunction,
): TypeImport[] | undefined {
	if (runnableJsTsFunction) {
		return undefined;
	}
	return undefined;
	// TODO: Implement
	// const usedKeys: Set<string> = new Set();
	// const importSpecifiers: ImportSpecifier[] = [];

	// const impSpecs = runnableJsTsFunction.args.reduce(
	// 	(prev, curr): ImportSpecifier[] => {
	// 		if (curr.type?.importSpecifiers != null) {
	// 			prev.push(...curr.type.importSpecifiers);
	// 		}
	// 		return prev;
	// 	},
	// 	[] as ImportSpecifier[],
	// );

	// if (runnableJsTsFunction.returnValue?.importSpecifiers != null) {
	// 	impSpecs.push(...runnableJsTsFunction.returnValue.importSpecifiers);
	// }

	// impSpecs.forEach((impSpec) => {
	// 	if (!usedKeys.has(impSpec.importName)) {
	// 		usedKeys.add(impSpec.importName);
	// 		importSpecifiers.push(impSpec);
	// 	}
	// });

	// if (importSpecifiers.length === 0) {
	// 	return undefined;
	// }

	// const typeImportsMap: Map<string | null, TypeImport> = new Map();
	// importSpecifiers.forEach((impSpec) => {
	// 	const defaultImport =
	// 		impSpec.importType === 'default' ? impSpec.importName : undefined;
	// 	const namedImport =
	// 		impSpec.importType === 'named'
	// 			? [
	// 					{
	// 						importName: impSpec.importName,
	// 						importPropertyName: impSpec.importPropertyName,
	// 					},
	// 				]
	// 			: undefined;
	// 	if (!typeImportsMap.has(impSpec.importPath)) {
	// 		const newTypeImport: TypeImport = {
	// 			path: impSpec.importPath,
	// 			defaultImport,
	// 			namedImports: namedImport,
	// 		};
	// 		typeImportsMap.set(impSpec.importPath, newTypeImport);
	// 	} else {
	// 		const existing = typeImportsMap.get(impSpec.importPath)!;
	// 		if (defaultImport !== null && existing.defaultImport === undefined) {
	// 			existing.defaultImport = defaultImport;
	// 		}
	// 		if (Array.isArray(namedImport)) {
	// 			if (Array.isArray(existing.namedImports)) {
	// 				existing.namedImports.push(...namedImport);
	// 			} else {
	// 				existing.namedImports = namedImport;
	// 			}
	// 		}
	// 	}
	// });

	// return [...typeImportsMap.values()];
}

export function getTypeImportsSection(
	runnableJsTsFunction: RunnableJsTsFunction,
): Node[] | undefined {
	const typeImports = getTypeImports(runnableJsTsFunction);
	if (typeImports === undefined) {
		return undefined;
	}
	const imports = typeImports.map((imp) => {
		return createImportDeclarationNode(
			imp.defaultImport,
			imp.namedImports,
			runnableJsTsFunction.sourceFilePath,
		);
	});
	return imports;
}
