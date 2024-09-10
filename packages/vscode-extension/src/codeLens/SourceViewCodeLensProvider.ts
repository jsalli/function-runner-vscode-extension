import {
	NotSupportedFunction,
	RunnableFunction,
} from '@functionrunner/shared';
import {
	CancellationToken,
	CodeLens,
	TextDocument,
} from 'vscode';
import { LoggerService } from '../services/LoggerService';
import {
	OpenInputSetViewCodeLens,
	resolveOpenInputSetViewCodeLens,
} from './codeLenses/OpenInputSetViewCodeLens';
import { injectable, registry } from 'tsyringe';
import { FunctionRunnerCodeLensProvider } from './FunctionRunnerCodeLensProvider';
import { isInputSetView } from '../utils/isInputSetView';


@injectable()
@registry([{ token: 'FunctionRunnerCodeLensProvider', useClass: SourceViewCodeLensProvider }])
export class SourceViewCodeLensProvider extends FunctionRunnerCodeLensProvider{	
	constructor(logger: LoggerService) {
		super(logger)
	}

	public provideCodeLenses(
		document: TextDocument,
		token: CancellationToken,
	): CodeLens[] {
		try {
			if (isInputSetView(document) || document.isUntitled) {
				return []
			}
	
			const languageHandler = this.languageHandlers.find(langHandler => langHandler.isInterestedInThisLanguage(document.languageId))
			if (!languageHandler) {
				return []
			}
			const foundFunctions = languageHandler.findRunnableFunctions(document)
	
			if (
				token.isCancellationRequested ||
				foundFunctions.length === 0
			) {
				return [];
			}
	
			const lenses = foundFunctions.flatMap(func => this.provideCodeLensesForFoundFunction(func))
			return lenses;
		} catch(error) {
			const message = 'Error parsing SourceView Content!';
			this.logger.error(error, message);
			throw error;
		}
		
	}

	private provideCodeLensesForFoundFunction(
		foundFunction: RunnableFunction | NotSupportedFunction,
	): CodeLens[] {
		if (foundFunction instanceof RunnableFunction) {
			return [new OpenInputSetViewCodeLens(foundFunction)]
		}
		// else if (foundFunction instanceof NotSupportedFunction) {
		// 	return [new NotSupportedFunctionCodeLens(foundFunction)]
		// }

		return [];
	}

	public resolveCodeLens(
		lens: CodeLens,
		token: CancellationToken,
	): CodeLens | null {
		try {
			if (lens instanceof OpenInputSetViewCodeLens) {
				return resolveOpenInputSetViewCodeLens(lens, token);
			}
			// else if (lens instanceof NotSupportedFunctionCodeLens) {
			// 	return resolveNotSupportedFunctionCodeLens(lens, token);
			// }
			return null;
		} catch (error) {
			this.logger.error(error, 'Error resolving source view code lenses');
			return null;
		}
	}
}
