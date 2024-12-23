export const publisherName = 'function-runner'; // Defined in package.json 'publisher'-field
export const extensionName = 'function-runner-vscode-extension'; // Defined in package.json 'name'-field
export const extensionDisplayName = 'Function Runner'; // Defined in package.json 'displayName'-field
export const vscodeUniqueExtensionID = `${publisherName}.${extensionName}`;
export const extensionTempFolder = '.functionrunner';

export const terminalName = `${extensionName}-run-in-terminal`;

export const enum ContextKeys {
	ViewsManageTestsOneOpen = 'functionrunner:views:tests:manage:one:open',
	ViewsManageTestsAllOpen = 'functionrunner:views:tests:manage:all:open',
	ViewsInputsOpen = 'functionrunner:views:inputs:open',
	ViewsInputsClose = 'functionrunner:views:inputs:close',
	RunTestsForFunctionOne = 'functionrunner:run:tests:forFunction:one',
	RunTestsForFunctionAll = 'functionrunner:run:tests:forFunction:all',
	RunTestsAll = 'functionrunner:run:tests:all',
}

export const enum DocumentSchemes {
	File = 'file',
	Untitled = 'untitled',
}
