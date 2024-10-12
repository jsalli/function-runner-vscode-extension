import type { DebugConfigurationProvider, TextDocument } from 'vscode';
import type { RunnableFunction } from './RunnableFunction';
import type { NotSupportedFunction } from '../types/NotSupportedFunction';
import { InputSetViewCodeLensPositions } from '../types/InputSetViewCodeLensPositions';
import { FileAndFunctionIdentifier } from '../types/FileAndFunctionIdentifier';

export abstract class LanguageHandler<T = string> {
	public abstract languageIds: string[];

	public abstract getDebugConfigurationProvider(): Promise<DebugConfigurationProvider>;

	public abstract isInterestedInThisLanguage(languageId: string): boolean;

	public abstract findRunnableFunctionsFromSourceCode(
		document: TextDocument,
	): Promise<(RunnableFunction<T> | NotSupportedFunction)[]>;

	public abstract createInputViewContent(
		runnableFunction: RunnableFunction<T>,
	): Promise<string>;

	public abstract findCodeLensPositionsFromInputSetView(
		document: TextDocument,
	): Promise<InputSetViewCodeLensPositions | undefined>;

	public abstract getRunnableFunctionByFileId(
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): Promise<RunnableFunction<T>>;

	public abstract runFunctionWithInputSets(
		runnableFunction: RunnableFunction<T>,
		inputViewContent: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string>;

	public abstract debugFunctionWithInputSets(
		runnableFunction: RunnableFunction<T>,
		inputViewContent: string,
		returnSuccessForTest: boolean | undefined,
	): Promise<string>;
}
