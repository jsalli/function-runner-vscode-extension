import type { DebugConfigurationProvider, TextDocument } from 'vscode';
import type { RunnableFunction } from './RunnableFunction';
import type { NotSupportedFunction } from './NotSupportedFunction'
import { InputSetViewCodeLensPositions } from './InputSetViewCodeLensPositions';
import { FileAndFunctionData } from '../../vscode-extension/src/@types/FileAndFunctionData';

export abstract class LanguageHandler {
  public abstract languageIds: string[]

  public abstract getDebugConfigurationProvider(): DebugConfigurationProvider

  public abstract isInterestedInThisLanguage(languageId: string): boolean

  public abstract findRunnableFunctions(document: TextDocument): (RunnableFunction | NotSupportedFunction)[]

  public abstract createInputViewContent(runnableFunction: RunnableFunction): string

  public abstract createNewInputSet(fileAndFunctionData: FileAndFunctionData): Promise<string>

  public abstract findCodeLensPositionsFromInputSetView(document: TextDocument): InputSetViewCodeLensPositions | undefined

  public abstract getRunnableFunctionByFileId(fileAndFunctionData: FileAndFunctionData): Promise<RunnableFunction>

  public abstract runFunctionWithInputSets(runnableFunction: RunnableFunction, inputViewContent: string, inputSetIndex: number, returnSuccessForTest: boolean | undefined): Promise<string>

  public abstract debugFunctionWithInputSets(runnableFunction: RunnableFunction, inputViewContent: string, inputSetIndex: number, returnSuccessForTest: boolean | undefined): Promise<string>
}