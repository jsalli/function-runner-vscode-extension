import { CodePosition } from '../CodePosition';

export type RunnableFunctionType<T = string> = {
	name: string;
	codePosition: CodePosition;
	sourceFilePath: string;
	languageId: T;
};

export class RunnableFunction<T = string> implements RunnableFunctionType<T> {
	constructor(
		public name: string,
		public codePosition: CodePosition,
		public sourceFilePath: string,
		public languageId: T,
	) {}
}
