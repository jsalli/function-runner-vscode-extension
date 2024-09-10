import { env, Uri, window } from 'vscode';

const createNewIssueButtonText = 'Create new Issue on Github';
const functionRunnerGithubIssuesUrl =
	'https://github.com/functionrunner-io/vscode-extension/issues';

export class UnknownErrorNotification {
	constructor(message: string) {
		void this.showMessage(message);
	}

	private async showMessage(message: string): Promise<void> {
		const openUrl = await window.showInformationMessage(
			`Could not write unit test. Reason: ${message}`,
			createNewIssueButtonText,
		);

		if (openUrl === createNewIssueButtonText) {
			await env.openExternal(Uri.parse(functionRunnerGithubIssuesUrl, true));
		}
	}
}
