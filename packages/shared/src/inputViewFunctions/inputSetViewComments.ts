export function inputViewHeaderSectionComment(
	functionName: string,
	filePath: string,
): string {
	const fileAndFunctionId = JSON.stringify({ functionName, filePath });
	return `Give inputs for "${functionName}"-function's
@functionrunner input-set-view ${functionName}
@functionrunner file-id ${fileAndFunctionId}
`;
}

export function inputSetHeaderSectionComment(useCaseId: string) {
	return `
@functionrunner input set ${useCaseId}
=======================
Input set ID ${useCaseId}
=======================
`;
}
