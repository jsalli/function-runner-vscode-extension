import { join } from 'path';
import { rimraf } from 'rimraf';
import pkg from 'fs-extra';
const { copySync, existsSync, promises } = pkg;

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
	await rimraf(join(outputFolder, '**/*.d.ts'), { glob: true });
	await rimraf(join(outputFolder, '**/*.js.map'), { glob: true });
	await rimraf(join(outputFolder, '**/README.md'), { glob: true });
	await rimraf(join(outputFolder, '**/readme.md'), { glob: true });
	await rimraf(join(outputFolder, '**/CHANGELOG.md'), { glob: true });
	await rimraf(join(outputFolder, '**/*.ts'), { glob: true });
	await rimraf(join(outputFolder, '**/.package-lock.json'), { glob: true });
	await rimraf(join(outputFolder, '**/package-lock.json'), { glob: true });
}

void main();
