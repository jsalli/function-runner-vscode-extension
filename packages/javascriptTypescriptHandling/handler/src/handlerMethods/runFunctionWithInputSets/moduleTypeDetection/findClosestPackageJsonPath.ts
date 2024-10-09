import findUp from 'find-up';

export async function findClosestPackageJsonPath(
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
