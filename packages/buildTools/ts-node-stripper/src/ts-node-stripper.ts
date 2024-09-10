import { join } from 'path';
import { copySync, existsSync, promises } from 'fs-extra';
import { rimraf } from 'rimraf';

const tsNodeInstallationFolder = 'ts-node-installation';

const outputFolder = 'out/ts-node-installation';

async function deleteExistingOut(): Promise<void> {
	const outputExistsAlready = existsSync(outputFolder);
	if (outputExistsAlready) {
		await promises.rm(outputFolder, { recursive: true });
	}
}

function copyTsNodeToOutputFolder(): void {
	copySync(tsNodeInstallationFolder, outputFolder);
}

async function main() {
	await deleteExistingOut();
	copyTsNodeToOutputFolder();

	// Remove unused folders
	await rimraf(join(outputFolder, 'node_modules', '@types'));
	await rimraf(join(outputFolder, 'node_modules', '@tsconfig'));
	await rimraf(join(outputFolder, 'node_modules', '.bin'));
	await rimraf(join(outputFolder, 'node_modules', 'typescript'));

	// Remove unused files
	await rimraf(join(outputFolder, '**/*.d.ts'));
	await rimraf(join(outputFolder, '**/*.js.map'));
	await rimraf(join(outputFolder, '**/README.md'));
	await rimraf(join(outputFolder, '**/readme.md'));
	await rimraf(join(outputFolder, '**/CHANGELOG.md'));
	await rimraf(join(outputFolder, '**/*.ts'));
	await rimraf(join(outputFolder, '**/.package-lock.json'));
	await rimraf(join(outputFolder, '**/package-lock.json'));
}

void main();
