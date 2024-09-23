import { InputSetViewCodeLensPositions, LanguageHandler, NotSupportedFunction, RunnableFunction, FileAndFunctionIdentifier } from '@functionrunner/shared'
import { DebugConfigurationProvider, TextDocument } from 'vscode';

export const pythonLanguageId = 'python'
export type PythonLanguageId = typeof pythonLanguageId

export class Handler implements LanguageHandler<PythonLanguageId> {
  public languageIds: string[] = [pythonLanguageId];
  
  public getDebugConfigurationProvider(): Promise<DebugConfigurationProvider> {
    throw new Error('Method not implemented.');
  }
  public isInterestedInThisLanguage(languageId: string): boolean {
    throw new Error('Method not implemented.');
  }
  public findRunnableFunctions<T extends string>(document: TextDocument): Promise<(RunnableFunction<T> | NotSupportedFunction)[]> {
    throw new Error('Method not implemented.');
  }
  public createInputViewContent(runnableFunction: RunnableFunction<PythonLanguageId>): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public createNewInputSet(fileAndFunctionIdentifier: FileAndFunctionIdentifier): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public findCodeLensPositionsFromInputSetView(document: TextDocument): Promise<InputSetViewCodeLensPositions | undefined> {
    throw new Error('Method not implemented.');
  }
  public getRunnableFunctionByFileId(fileAndFunctionIdentifier: FileAndFunctionIdentifier): Promise<RunnableFunction<PythonLanguageId>> {
    throw new Error('Method not implemented.');
  }
  public runFunctionWithInputSets(runnableFunction: RunnableFunction<PythonLanguageId>, inputViewContent: string, inputSetIdentifier: string, returnSuccessForTest: boolean | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public debugFunctionWithInputSets(runnableFunction: RunnableFunction<PythonLanguageId>, inputViewContent: string, inputSetIdentifier: string, returnSuccessForTest: boolean | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

}