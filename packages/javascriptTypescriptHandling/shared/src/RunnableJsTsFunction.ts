import { CodePosition, RunnableFunction } from '@functionrunner/shared';
import {
	DefaultExport,
	NamedExport,
	TypeImport,
	TypeNodeSpecifier,
} from './RunnableJsTsFunctionSubProperties';

export class RunnableJsTsFunction extends RunnableFunction<
	'typescript' | 'javascript'
> {
	constructor(
		name: string,
		codePosition: CodePosition,
		sourceFilePath: string,
		languageId: 'typescript' | 'javascript',
		public async: boolean,
		public generator: boolean,
		public args: RunnableJsTsFunctionArg[],
		public returnValue: TypeNodeSpecifier | undefined,
		public exportType: DefaultExport | NamedExport,
		public dependencyImports?: TypeImport[],
	) {
		super(name, codePosition, sourceFilePath, languageId);
	}
}

export class RunnableJsTsFunctionArg {
	constructor(
		public name: string,
		public optional: boolean,
		public type: TypeNodeSpecifier | undefined,
	) {}
}
