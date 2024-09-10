import { CodePosition } from "./CodePosition";


export abstract class NotSupportedFunction {
  public abstract name: string
  public abstract codePosition: CodePosition;
	public abstract sourceFilePath: string;
	public abstract languageId: string;

  public abstract shortFailReason: string;
	public abstract longFailReason: string | undefined;
	public abstract githubIssueUrl: string | undefined;
}