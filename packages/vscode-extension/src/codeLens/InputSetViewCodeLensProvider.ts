import {
	CancellationToken,
	CodeLens,
	Range,
	TextDocument,
} from 'vscode';
import { LoggerService } from '../services/LoggerService';
import {
	AddNewInputSetCodeLens,
	resolveAddNewInputSetCodeLens,
} from './codeLenses/AddNewInputSetCodeLens';
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
import { isInputSetView } from '../utils/isInputSetView';
import { createFileAndFunctionData } from '../utils/createFileAndFunctionData';
import { FileAndFunctionData } from '../@types/FileAndFunctionData';

@injectable()
@registry([{ token: 'FunctionRunnerCodeLensProvider', useClass: InputSetViewCodeLensProvider }])
export class InputSetViewCodeLensProvider extends FunctionRunnerCodeLensProvider {
	constructor(logger: LoggerService) {
		super(logger)
	}

	provideCodeLenses(
		document: TextDocument,
		token: CancellationToken,
	): CodeLens[] {
		try {
			if (!isInputSetView(document)) {
				return [];
			}

			const fileAndFunctionData = createFileAndFunctionData(document);
			if (fileAndFunctionData == null) {
				return [];
			}

			const languageHandler = this.languageHandlers.find(langHandler => langHandler.isInterestedInThisLanguage(document.languageId))
			if (!languageHandler) {
				return []
			}

			const inputSetViewCodeLensPositions = languageHandler.findCodeLensPositionsFromInputSetView(document);
			if (inputSetViewCodeLensPositions === undefined) {
				return [];
			}

			const lenses: CodeLens[] = [];
			lenses.push(
				...this.createHeaderCodelenses(
					inputSetViewCodeLensPositions.header,
					fileAndFunctionData
				),
			);

			// Add test case codelenses
			for (const [inputSetIndex, inputSetRange] of inputSetViewCodeLensPositions.inputSets.entries()) {
				lenses.push(
					...this.createInputSetCodelenses(
						inputSetIndex,
						inputSetRange,
						fileAndFunctionData
					),
				);
			}

			if (token.isCancellationRequested) {
				return [];
			}

			// Add footer codelenses
			lenses.push(
				...this.createFooterCodelenses(
					inputSetViewCodeLensPositions.footer,
					fileAndFunctionData,
				),
			);

			return lenses;
		} catch (error) {
			const message = 'Error parsing InputSetView Content!';
			this.logger.error(error, message);
			throw error;
		}
	}

	resolveCodeLens(lens: CodeLens, token: CancellationToken): CodeLens | null {
		try {
			if (lens instanceof AddNewInputSetCodeLens) {
				return resolveAddNewInputSetCodeLens(lens, token);
			} else if (lens instanceof RunOneInputSetCodeLens) {
				return resolveRunOneInputSetCodeLens(lens, token);
			} else if (lens instanceof CloseTextEditorCodeLens) {
				return resolveCloseTextEditorCodeLens(lens, token);
			} else if (lens instanceof DebugOneInputSetCodeLens) {
				return resolveDebugOneInputSetCodeLens(lens, token);
			}
			return null;
		} catch (error) {
			this.logger.error(error, 'Error resolving run input view code lenses');
			return null;
		}
	}
	
	private createHeaderCodelenses(
		headerRange: Range,
		fileAndFunctionData: FileAndFunctionData,
	): CodeLens[] {
		const closeCodeLensHeader = new CloseTextEditorCodeLens(
			headerRange,
			fileAndFunctionData,
		);
		return [closeCodeLensHeader];
	}

	private createInputSetCodelenses(
		inputSetIndex: number,
		inputSetRange: Range,
		fileAndFunctionData: FileAndFunctionData,
	): CodeLens[] {
		const runOneTestCodeLens = new RunOneInputSetCodeLens(
			inputSetIndex,
			inputSetRange,
			fileAndFunctionData
		);
		const debugOneTestCodeLens = new DebugOneInputSetCodeLens(
			inputSetIndex,
			inputSetRange,
			fileAndFunctionData
		);
		return [runOneTestCodeLens, debugOneTestCodeLens];
	}

	private createFooterCodelenses(
		footerRange: Range,
		fileAndFunctionData: FileAndFunctionData,
	): CodeLens[] {
		const addNewInputSetCodeLens = new AddNewInputSetCodeLens(
			footerRange,
			fileAndFunctionData
		);

		const closeCodeLensFooter = new CloseTextEditorCodeLens(
			footerRange,
			fileAndFunctionData
		);
		return [
			addNewInputSetCodeLens,
			closeCodeLensFooter,
		];
	}
}
