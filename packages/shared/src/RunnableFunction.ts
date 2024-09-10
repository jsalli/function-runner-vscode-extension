import { CodePosition } from "./CodePosition";


export abstract class RunnableFunction {
  public abstract name: string
  public abstract codePosition: CodePosition;
	public abstract sourceFilePath: string;
	public abstract languageId: string;
}