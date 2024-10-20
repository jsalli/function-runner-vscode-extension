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

export function isRunnableJsTsFunction(
	maybeRunnableJsTsFunctionObj: unknown,
): maybeRunnableJsTsFunctionObj is RunnableJsTsFunction {
	return (
		typeof maybeRunnableJsTsFunctionObj === 'object' &&
		maybeRunnableJsTsFunctionObj !== null &&
		maybeRunnableJsTsFunctionObj.constructor.name === 'RunnableJsTsFunction' &&
		'languageId' in maybeRunnableJsTsFunctionObj &&
		(maybeRunnableJsTsFunctionObj.languageId === 'javascript' ||
			maybeRunnableJsTsFunctionObj.languageId === 'typescript')
	);
}
