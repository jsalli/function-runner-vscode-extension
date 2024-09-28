import { CancellationToken, CodeLens, Range, TextDocument } from 'vscode';
import {
	LoggerService,
	FileAndFunctionIdentifier,
} from '@functionrunner/shared';
import {
	CloseTextEditorCodeLens,
	resolveCloseTextEditorCodeLens,
} from './codeLenses/CloseTextEditorCodeLens';
import {
	DebugOneInputSetCodeLens,
	resolveDebugOneInputSetCodeLens,
} from './codeLenses/DebugOneInputSetCodeLens';
import {
	resolveRunOneInputSetCodeLens,
	RunOneInputSetCodeLens,
} from './codeLenses/RunOneInputSetCodeLens';
import { injectable, registry } from 'tsyringe';
import { FunctionRunnerCodeLensProvider } from './FunctionRunnerCodeLensProvider';
import { isInputSetView } from '@functionrunner/shared';
import { createFileAndFunctionIdentifier } from '../utils/createFileAndFunctionIdentifier';

@injectable()
@registry([
	{
		token: 'FunctionRunnerCodeLensProvider',
		useClass: InputSetViewCodeLensProvider,
	},
])
export class InputSetViewCodeLensProvider extends FunctionRunnerCodeLensProvider {
	constructor(logger: LoggerService) {
		super(logger, ['file', 'untitled']);
	}

	async provideCodeLenses(
		document: TextDocument,
		token: CancellationToken,
	): Promise<CodeLens[]> {
		try {
			if (!isInputSetView(document)) {
				return [];
			}

			const fileAndFunctionIdentifier =
				createFileAndFunctionIdentifier(document);
			if (fileAndFunctionIdentifier == null) {
				return [];
			}

			const languageHandler = this.languageHandlers.find((langHandler) =>
				langHandler.isInterestedInThisLanguage(document.languageId),
			);
			if (!languageHandler) {
				return [];
			}

			const inputSetViewCodeLensPositionsAndId =
				await languageHandler.findCodeLensPositionsFromInputSetView(document);
			if (inputSetViewCodeLensPositionsAndId === undefined) {
				return [];
			}

			const lenses: CodeLens[] = [];
			lenses.push(
				...this.createHeaderCodelenses(
					inputSetViewCodeLensPositionsAndId.header,
					fileAndFunctionIdentifier,
				),
			);

			// Add test case codelenses
			for (const inputSetRangeAndId of inputSetViewCodeLensPositionsAndId.inputSets) {
				lenses.push(
					...this.createInputSetCodelenses(
						inputSetRangeAndId.range,
						fileAndFunctionIdentifier,
					),
				);
			}

			if (token.isCancellationRequested) {
				return [];
			}

			// Add footer codelenses
			lenses.push(
				...this.createFooterCodelenses(
					inputSetViewCodeLensPositionsAndId.footer,
					fileAndFunctionIdentifier,
				),
			);

			return lenses;
		} catch (error) {
			const message = 'Error parsing InputSetView Content!';
			this.logger.error(error, message);
			throw error;
		}
	}

	async resolveCodeLens(lens: CodeLens): Promise<CodeLens | null> {
		try {
			if (lens instanceof RunOneInputSetCodeLens) {
				return resolveRunOneInputSetCodeLens(lens);
			} else if (lens instanceof CloseTextEditorCodeLens) {
				return resolveCloseTextEditorCodeLens(lens);
			} else if (lens instanceof DebugOneInputSetCodeLens) {
				return resolveDebugOneInputSetCodeLens(lens);
			}
			return null;
		} catch (error) {
			this.logger.error(error, 'Error resolving run input view code lenses');
			return null;
		}
	}

	private createHeaderCodelenses(
		headerRange: Range,
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): CodeLens[] {
		const closeCodeLensHeader = new CloseTextEditorCodeLens(
			headerRange,
			fileAndFunctionIdentifier,
		);
		return [closeCodeLensHeader];
	}

	private createInputSetCodelenses(
		inputSetRange: Range,
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): CodeLens[] {
		const runOneTestCodeLens = new RunOneInputSetCodeLens(
			inputSetRange,
			fileAndFunctionIdentifier,
		);
		const debugOneTestCodeLens = new DebugOneInputSetCodeLens(
			inputSetRange,
			fileAndFunctionIdentifier,
		);
		return [runOneTestCodeLens, debugOneTestCodeLens];
	}

	private createFooterCodelenses(
		footerRange: Range,
		fileAndFunctionIdentifier: FileAndFunctionIdentifier,
	): CodeLens[] {
		const closeCodeLensFooter = new CloseTextEditorCodeLens(
			footerRange,
			fileAndFunctionIdentifier,
		);
		return [closeCodeLensFooter];
	}
}
