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
import { findRunnableJsTsFunctions } from './handlerMethods/findRunnableFunctions/findRunnableJsTsFunctions';
import { createNewJsTsInputSet } from './handlerMethods/createNewInputSet/createNewJsTsInputSet';
import { createJsTsInputViewContent } from './handlerMethods/createInputViewContent/createJsTsInputViewContent';
import { findCodeLensPositionsFromJsTsInputSetView } from './handlerMethods/findCodeLensPositionsFromInputSetView/findCodeLensPositionsFromJsTsInputSetView';
import { getRunnableJsTsFunctionByFileId } from './handlerMethods/getRunnableFunctionByFileId/getRunnableJsTsFunctionByFileId';
import { runJsTsFunctionWithInputSets } from './handlerMethods/runFunctionWithInputSets/runJsTsFunctionWithInputSets';
import { debugJsTsFunctionWithInputSets } from './handlerMethods/debugFunctionWithInputSets/debugJsTsFunctionWithInputSets';

export class Handler
	implements LanguageHandler<JavascriptLanguageId | TypescriptLanguageId>
{
	public languageIds: string[] = [javascriptLanguageId, typescriptLanguageId];

	public getDebugConfigurationProvider(): Promise<DebugConfigurationProvider> {
		return Promise.resolve(getJsTsDebugConfigurationProvider());
	}
	public isInterestedInThisLanguage(languageId: string): boolean {
		return (
			languageId === javascriptLanguageId || languageId === typescriptLanguageId
		);
	}
	public findRunnableFunctions(
		document: JsTsTextDocument,
	): Promise<(RunnableJsTsFunction | NotSupportedFunction)[]> {
		return Promise.resolve(findRunnableJsTsFunctions(document));
	}
	public createInputViewContent(
		runnableFunction: RunnableJsTsFunction,
	): Promise<string> {
		return Promise.resolve(createJsTsInputViewContent(runnableFunction));
	}
	public createNewInputSet(
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): Promise<string> {
		return Promise.resolve(createNewJsTsInputSet(fileAndFunctionIdentifier));
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
		inputSetIdentifier: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string> {
		return runJsTsFunctionWithInputSets(
			runnableFunction,
			inputViewContent,
			inputSetIdentifier,
			returnSuccessForTest,
		);
	}
	public debugFunctionWithInputSets(
		runnableFunction: RunnableJsTsFunction,
		inputViewContent: string,
		inputSetIdentifier: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string> {
		return debugJsTsFunctionWithInputSets(
			runnableFunction,
			inputViewContent,
			inputSetIdentifier,
			returnSuccessForTest,
		);
	}
}
