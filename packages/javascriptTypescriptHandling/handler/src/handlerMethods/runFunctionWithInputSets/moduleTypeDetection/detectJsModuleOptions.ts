import {
	CompilerOptions,
	ModuleKind,
	ModuleResolutionKind,
	ScriptTarget,
} from 'typescript';
import findUp from 'find-up';
import { readFilePathASync } from '@functionrunner/shared';
import { commonJSModule, esModule } from '../constants';

async function findClosestPackageJsonPath(
	sourceFilePath: string,
): Promise<string> {
	const closestPackageJsonPath = await findUp('package.json', {
		cwd: sourceFilePath,
	});
	if (closestPackageJsonPath === undefined) {
		throw new Error(
			`Could not find the closest package.json file to path ${sourceFilePath}`,
		);
	}
	return closestPackageJsonPath;
}

export async function detectJsModuleOptions(sourceFilePath: string): Promise<{
	moduleType: typeof commonJSModule | typeof esModule;
	compilerOptions: CompilerOptions;
}> {
	const closestPackageJsonPath =
		await findClosestPackageJsonPath(sourceFilePath);
	const packageJsonRawContent = await readFilePathASync(closestPackageJsonPath);
	const packageJsonContent: { type?: string } = JSON.parse(
		packageJsonRawContent,
	);

	let moduleType: typeof commonJSModule | typeof esModule = commonJSModule;
	if (packageJsonContent.type?.toLowerCase() === 'module') {
		moduleType = esModule;
	}

	const compilerOptions = getDefaultJsCompilerOptions(moduleType);

	return { moduleType, compilerOptions };
}

function getDefaultJsCompilerOptions(
	moduleType: typeof commonJSModule | typeof esModule,
): CompilerOptions {
	const defaultCompilerOptions: CompilerOptions = {
		allowJs: true,
		target: ScriptTarget.ES2015,
		module:
			moduleType === commonJSModule ? ModuleKind.CommonJS : ModuleKind.ES2015,
		lib: ['ES2015'],
		moduleResolution: ModuleResolutionKind.NodeNext,
		sourceMap: false,
	};

	return defaultCompilerOptions;
}
