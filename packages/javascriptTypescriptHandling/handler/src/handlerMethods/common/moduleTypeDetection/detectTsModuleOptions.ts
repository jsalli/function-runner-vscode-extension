import { CompilerOptions, ModuleKind, ScriptTarget } from 'typescript';
import { commonJSModule, esModule } from '../constants';
import { getClosestTsconfig } from './getClosestTsconfig';

export async function detectTsModuleOptions(sourceFilePath: string): Promise<{
	moduleType: typeof commonJSModule | typeof esModule;
	compilerOptions: CompilerOptions;
	tsConfigJsonFileAbsPath: string;
}> {
	const { compilerOptions, tsConfigJsonFileAbsPath } =
		await getClosestTsconfig(sourceFilePath);

	let moduleType: typeof commonJSModule | typeof esModule;
	// Done according to https://www.typescriptlang.org/tsconfig#module
	if (compilerOptions.module === undefined) {
		if (
			compilerOptions.target === undefined ||
			compilerOptions.target === ScriptTarget.ES3 ||
			compilerOptions.target === ScriptTarget.ES5
		) {
			moduleType = commonJSModule;
		} else {
			moduleType = esModule;
		}
	} else if (compilerOptions.module === ModuleKind.CommonJS) {
		moduleType = commonJSModule;
	} else if (
		compilerOptions.module === ModuleKind.ES2015 ||
		compilerOptions.module === ModuleKind.ES2020 ||
		compilerOptions.module === ModuleKind.ES2022 ||
		compilerOptions.module === ModuleKind.ESNext
	) {
		moduleType = esModule;
	} else {
		throw new Error(
			`Unsupported Typescript module kind in tsconfig. Got ${
				ModuleKind[compilerOptions.module]
			}`,
		);
	}

	compilerOptions.sourceMap = false;

	return {
		moduleType,
		compilerOptions,
		tsConfigJsonFileAbsPath,
	};
}
