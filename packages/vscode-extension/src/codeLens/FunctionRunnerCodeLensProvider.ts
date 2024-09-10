import { CancellationToken, CodeLens, CodeLensProvider, DocumentSelector, EventEmitter, TextDocument, Event, DocumentFilter } from "vscode";
import { LoggerService } from "../services/LoggerService";
import { LanguageHandler } from "@functionrunner/shared";
import { container } from "tsyringe";


export class FunctionRunnerCodeLensProvider implements CodeLensProvider {
  public selector: DocumentSelector
  protected languageHandlers: LanguageHandler[]

  constructor(protected logger: LoggerService) {
    this.languageHandlers = container.resolveAll<LanguageHandler>('LanguageHandler')
    const availableLanguageIds = this.languageHandlers.flatMap(languageHandler => languageHandler.languageIds)
    this.selector = availableLanguageIds.map((languageId): DocumentFilter => ({ language: languageId, scheme: 'file'}))
  }

  public provideCodeLenses(
    document: TextDocument,
		token: CancellationToken
  ): CodeLens[] {
    throw new Error('Base class implementation called')
  }

  public resolveCodeLens(lens: CodeLens, token: CancellationToken): CodeLens | null {
    throw new Error('Base class implementation called')
  }

  public reset() {
		this._onDidChangeCodeLenses.fire();
	}

	private _onDidChangeCodeLenses = new EventEmitter<void>();
	get onDidChangeCodeLenses(): Event<void> {
		return this._onDidChangeCodeLenses.event;
	}
}