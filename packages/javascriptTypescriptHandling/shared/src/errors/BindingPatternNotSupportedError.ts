import { BindingName, isParameter, SyntaxKind } from 'typescript';
import { KnownError } from '@functionrunner/shared';

export class BindingPatternNotSupportedError extends KnownError {
	constructor(node: BindingName, id: string) {
		const bindingType = SyntaxKind[node.kind];

		const arrOrObj =
			node.kind === SyntaxKind.ObjectBindingPattern ? 'Object' : 'Array';
		let shortFailReason: string;
		let longFailReason: string;
		if (isParameter(node.parent)) {
			shortFailReason = `${arrOrObj} destructing in function arguments is not supported yet`;

			longFailReason = `${arrOrObj} destructing with ${bindingType} in function arguments is not supported yet | ${id}`;
		} else {
			shortFailReason = `${arrOrObj} destructing in function arguments is not supported yet`;

			longFailReason = `${shortFailReason} | ${id}`;
		}

		const githubIssueUrl =
			'https://github.com/testent-io/vscode-extension/issues/3';

		super(shortFailReason, longFailReason, githubIssueUrl);
	}
}
