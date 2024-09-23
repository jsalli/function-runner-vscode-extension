import { parse } from 'path';
import { parseTsConfigJson } from './parseTsConfigJson';
import { normalizeJoin, ConfigurationService } from '@functionrunner/shared';
import { CompilerOptions } from 'typescript';
import findUp from 'find-up';
import { container } from 'tsyringe';

export async function getClosestTsconfig(sourceFilePath: string): Promise<{
	compilerOptions: CompilerOptions;
	tsConfigJsonFileAbsPath: string;
}> {
	const closestPackageJson = await findUp('package.json', {
		cwd: sourceFilePath,
	});
	if (closestPackageJson === undefined) {
		throw new Error(
			`Could not find the closest package.json file to path ${sourceFilePath}`,
		);
	}

	const closestPackageJsonFolder = parse(closestPackageJson).dir;

	const configurationService = container.resolve(ConfigurationService);

	const tsConfigJsonFileAbsPath = normalizeJoin(
		closestPackageJsonFolder,
		configurationService.get(
			'typescriptRunOptions.tsconfigRelPath',
			undefined,
			'./tsconfig.json',
		),
	);
	const compilerOptions = parseTsConfigJson(tsConfigJsonFileAbsPath);
	return { compilerOptions, tsConfigJsonFileAbsPath };
}
