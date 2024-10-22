import { parse } from 'path';
import { parseTsConfigJson } from './parseTsConfigJson';
import { normalizeJoin, ConfigurationService } from '@functionrunner/shared';
import { CompilerOptions } from 'typescript';
import { container } from 'tsyringe';
import { pathExists } from 'fs-extra';
import { window } from 'vscode';
import { findClosestPackageJsonPath } from './findClosestPackageJsonPath';

export async function getClosestTsconfig(sourceFilePath: string): Promise<{
	compilerOptions: CompilerOptions;
	tsConfigJsonFileAbsPath: string;
}> {
	const closestPackageJsonPath =
		await findClosestPackageJsonPath(sourceFilePath);

	const closestPackageJsonFolder = parse(closestPackageJsonPath).dir;

	const configurationService = container.resolve(ConfigurationService);

	let tsConfigJsonFileAbsPath = normalizeJoin(
		closestPackageJsonFolder,
		configurationService.get(
			'typescriptRunOptions.tsconfigRelPath',
			undefined,
			'./tsconfig.json',
		),
	);

	while (
		// eslint-disable-next-line no-await-in-loop
		(await pathExists(tsConfigJsonFileAbsPath)) === false
	) {
		// eslint-disable-next-line no-await-in-loop
		const userGivenTsConfigPath = await window.showInputBox({
			title:
				'Give path to the tsconfig to use relative to the closest package.json. ESC to stop',
		});
		if (userGivenTsConfigPath === undefined) {
			throw new Error('No tsconfig given. Aborting.');
		}
		tsConfigJsonFileAbsPath = normalizeJoin(
			closestPackageJsonFolder,
			userGivenTsConfigPath,
		);
	}

	const compilerOptions = parseTsConfigJson(tsConfigJsonFileAbsPath);
	return { compilerOptions, tsConfigJsonFileAbsPath };
}
