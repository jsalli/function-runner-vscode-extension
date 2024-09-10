import { env, Uri, window } from 'vscode';

const gotoGithubIssueButtonText = 'Goto Github issue';

export class KnownErrorNotification {
	constructor(message: string, githubIssueUrl: string | undefined) {
		const githubIssueUri = githubIssueUrl
			? Uri.parse(githubIssueUrl, true)
			: undefined;
		void this.showMessage(message, githubIssueUri);
	}

	private async showMessage(
		message: string,
		githubIssueUri: Uri | undefined,
	): Promise<void> {
		if (githubIssueUri != null) {
			const openUrl = await window.showInformationMessage(
				message,
				gotoGithubIssueButtonText,
			);

			if (openUrl === gotoGithubIssueButtonText) {
				await env.openExternal(githubIssueUri);
			}
		} else {
			await window.showInformationMessage(message);
		}
	}
}
