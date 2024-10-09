export function inputViewHeaderSectionComment(
	functionName: string,
	filePath: string,
): string {
	const fileAndFunctionId = JSON.stringify({ functionName, filePath });
	return `Give inputs for "${functionName}"-function.
You might need to save this unsaved tab to a file.
@functionrunner file-id ${fileAndFunctionId}
`;
}

export function inputSetHeaderSectionComment() {
	return `
@functionrunner input set
=======================
`;
}

export function inputViewUserSetupSectionComment(): string {
	return `You can setup here what ever you need for the function to run
=======================
`;
}

export function inputViewFunctionExecutionSectionComment(): string {
	return `This code executes the function
=======================
`;
}
