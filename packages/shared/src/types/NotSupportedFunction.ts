import { CodePosition } from '../CodePosition';

export class NotSupportedFunction {
	constructor(
		public name: string,
		public codePosition: CodePosition,
		public sourceFilePath: string,
		public languageId: string,
		public shortFailReason: string,
		public longFailReason: string | undefined,
		public githubIssueUrl: string | undefined,
	) {}
}
