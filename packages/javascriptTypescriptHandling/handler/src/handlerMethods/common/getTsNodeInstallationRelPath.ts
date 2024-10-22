import { parse, relative } from 'path';
import { normalizeJoin, getExtensionAbsPath } from '@functionrunner/shared';
import { pathExists } from 'fs-extra';
import { findClosestPackageJsonPath } from './moduleTypeDetection/findClosestPackageJsonPath';

export async function getTsNodeInstallationRelPath(
	sourceFileDirAbsPath: string,
): Promise<string> {
	// TODO: Find if ts-node is installed locally. If so, use it
	const folderOfLocalTsNode = './node_modules/ts-node';
	const closestPackageJsonPath =
		await findClosestPackageJsonPath(sourceFileDirAbsPath);
	const closestPackageJsonFolderPath = parse(closestPackageJsonPath).dir;
	const folderOfLocalTsNodeAbsPath = normalizeJoin(
		closestPackageJsonFolderPath,
		folderOfLocalTsNode,
	);
	if (await pathExists(folderOfLocalTsNodeAbsPath)) {
		return 'ts-node';
	}

	const extensionAbsPath = getExtensionAbsPath();
	const tsNodeInstallationAbsPath = normalizeJoin(
		extensionAbsPath,
		'dist',
		'ts-node-installation',
		'node_modules',
		'ts-node',
	);
	const tsNodeInstallationRelPath = normalizeJoin(
		relative(sourceFileDirAbsPath, tsNodeInstallationAbsPath),
	);
	return `${tsNodeInstallationRelPath}/`;
}
