export class KnownError extends Error {
	constructor(
		public shortFailReason: string,
		public longFailReason: string,
		public githubIssueUrl: string,
	) {
		super(shortFailReason);
	}
}
