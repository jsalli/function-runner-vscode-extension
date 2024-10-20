import {
	InputSetViewCodeLensPositions,
	LanguageHandler,
	NotSupportedFunction,
	FileAndFunctionIdentifier,
} from '@functionrunner/shared';
import {
	javascriptLanguageId,
	JavascriptLanguageId,
	JsTsTextDocument,
	RunnableJsTsFunction,
	typescriptLanguageId,
	TypescriptLanguageId,
} from '@functionrunner/javascript-typescript-shared';
import { DebugConfigurationProvider } from 'vscode';
import { getJsTsDebugConfigurationProvider } from './handlerMethods/getDebugConfigurationProvider/getJsTsDebugConfigurationProvider';
import { findRunnableJsTsFunctionsFromSourceCode } from './handlerMethods/findRunnableJsTsFunctionsFromSourceCode/findRunnableJsTsFunctionsFromSourceCode';
import { createJsTsInputViewContent } from './handlerMethods/createInputViewContent/createJsTsInputViewContent';
import { findCodeLensPositionsFromJsTsInputSetView } from './handlerMethods/findCodeLensPositionsFromInputSetView/findCodeLensPositionsFromJsTsInputSetView';
import { getRunnableJsTsFunctionByFileId } from './handlerMethods/getRunnableFunctionByFileId/getRunnableJsTsFunctionByFileId';
import { runJsTsFunctionWithInputSets } from './handlerMethods/runFunctionWithInputSets/runJsTsFunctionWithInputSets';
import { debugJsTsFunctionWithInputSets } from './handlerMethods/debugFunctionWithInputSets/debugJsTsFunctionWithInputSets';
import { container, injectable, Lifecycle } from 'tsyringe';

@injectable()
export class Handler
	implements LanguageHandler<JavascriptLanguageId | TypescriptLanguageId>
{
	constructor() {}

	public languageIds: string[] = [javascriptLanguageId, typescriptLanguageId];

	public getDebugConfigurationProvider(): Promise<DebugConfigurationProvider> {
		return Promise.resolve(getJsTsDebugConfigurationProvider());
	}

	public isInterestedInThisLanguage(languageId: string): boolean {
		return (
			languageId === javascriptLanguageId || languageId === typescriptLanguageId
		);
	}

	public findRunnableFunctionsFromSourceCode(
		document: JsTsTextDocument,
	): Promise<(RunnableJsTsFunction | NotSupportedFunction)[]> {
		return Promise.resolve(findRunnableJsTsFunctionsFromSourceCode(document));
	}

	public createInputViewContent(
		runnableFunction: RunnableJsTsFunction,
	): Promise<string> {
		return Promise.resolve(createJsTsInputViewContent(runnableFunction));
	}

	public findCodeLensPositionsFromInputSetView(
		document: JsTsTextDocument,
	): Promise<InputSetViewCodeLensPositions | undefined> {
		return Promise.resolve(findCodeLensPositionsFromJsTsInputSetView(document));
	}

	public getRunnableFunctionByFileId(
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): Promise<RunnableJsTsFunction> {
		return getRunnableJsTsFunctionByFileId(fileAndFunctionIdentifier);
	}

	public runFunctionWithInputSets(
		runnableFunction: RunnableJsTsFunction,
		inputViewContent: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string> {
		return runJsTsFunctionWithInputSets(
			runnableFunction,
			inputViewContent,
			returnSuccessForTest,
		);
	}

	public debugFunctionWithInputSets(
		runnableFunction: RunnableJsTsFunction,
		inputViewContent: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string> {
		return debugJsTsFunctionWithInputSets(
			runnableFunction,
			inputViewContent,
			returnSuccessForTest,
		);
	}
}

container.register<Handler>(
	'LanguageHandler',
	{ useClass: Handler },
	{ lifecycle: Lifecycle.Singleton },
);
