import {
	CancellationToken,
	CodeLens,
	CodeLensProvider,
	DocumentSelector,
	EventEmitter,
	TextDocument,
	Event,
	DocumentFilter,
} from 'vscode';
import { LoggerService, LanguageHandler } from '@functionrunner/shared';
import { container } from 'tsyringe';

export class FunctionRunnerCodeLensProvider implements CodeLensProvider {
	public selector: DocumentSelector;
	protected languageHandlers: LanguageHandler[];

	constructor(
		protected logger: LoggerService,
		selectorDocumentFilterScheme: ('file' | 'untitled')[],
	) {
		this.languageHandlers =
			container.resolveAll<LanguageHandler>('LanguageHandler');
		const availableLanguageIds = this.languageHandlers.flatMap(
			(languageHandler) => languageHandler.languageIds,
		);

		this.selector = availableLanguageIds.flatMap((languageId) => {
			return selectorDocumentFilterScheme.map((fileSheme) => {
				const documentFilter: DocumentFilter = {
					language: languageId,
					scheme: fileSheme,
				};
				return documentFilter;
			});
		});
	}

	public async provideCodeLenses(
		document: TextDocument, // eslint-disable-line @typescript-eslint/no-unused-vars
		token: CancellationToken, // eslint-disable-line @typescript-eslint/no-unused-vars
	): Promise<CodeLens[]> {
		throw new Error('Base class implementation called');
	}

	public async resolveCodeLens(
		lens: CodeLens, // eslint-disable-line @typescript-eslint/no-unused-vars
		token: CancellationToken, // eslint-disable-line @typescript-eslint/no-unused-vars
	): Promise<CodeLens | null> {
		throw new Error('Base class implementation called');
	}

	public reset() {
		this.onDidChangeCodeLensesEventEmitter.fire();
	}

	private onDidChangeCodeLensesEventEmitter = new EventEmitter<void>();
	get onDidChangeCodeLenses(): Event<void> {
		return this.onDidChangeCodeLensesEventEmitter.event;
	}
}
