import { relative } from 'path';
import { normalizeJoin, getExtensionAbsPath } from '@functionrunner/shared';

export function getTsNodeInstallationRelPath(
	sourceFileDirAbsPath: string,
): string {
	// TODO: Find if ts-node is installed locally. If so, use it
	const extensionAbsPath = getExtensionAbsPath();
	const tsNodeInstallationAbsPath = normalizeJoin(
		extensionAbsPath,
		'dist',
		'ts-node-installation',
		'node_modules',
	);
	const tsNodeInstallationRelPath = normalizeJoin(
		relative(sourceFileDirAbsPath, tsNodeInstallationAbsPath),
	);
	return `${tsNodeInstallationRelPath}/`;
}
