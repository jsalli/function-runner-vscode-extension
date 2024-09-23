import {
	normalizePath,
	LoggerService,
	CodePosition,
	NotSupportedFunction,
} from '@functionrunner/shared';
import {
	isNodeExported,
	JsTsTextDocument,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import {
	isArrowFunction,
	isExportAssignment,
	isFunctionDeclaration,
	isVariableStatement,
	Node,
	SourceFile,
	Visitor,
	VisitResult,
} from 'typescript';
import { runnableFuncFromDefaultExportArrowFunc } from './runnableFuncFromDefaultExportArrowFunc';
import { runnableFuncFromFunctionDeclaration } from './runnableFuncFromFunctionDeclaration';
import { runnableFuncFromNamedExportArrowFunc } from './runnableFuncFromNamedExportArrowFunc';
import { container } from 'tsyringe';

export function findExportedFunctions(
	document: JsTsTextDocument,
	sourceFile: SourceFile,
	output: (RunnableJsTsFunction | NotSupportedFunction)[],
): Visitor {
	return (node: Node): VisitResult<Node | undefined> => {
		try {
			if (!isNodeExported(node)) {
				return undefined;
			}

			// export default (...) => {...}
			if (isExportAssignment(node) && isArrowFunction(node.expression)) {
				const startPos = node.getStart(sourceFile);
				const endPos = node.expression.parameters.end;
				const codePosition = new CodePosition(document, startPos, endPos);
				const foundFunc = runnableFuncFromDefaultExportArrowFunc(
					node,
					codePosition,
					document.languageId,
					sourceFile,
					normalizePath(document.uri.fsPath),
				);
				output.push(foundFunc);
			}
			// export const myFunc = (...) => {...}
			else if (isVariableStatement(node)) {
				for (const subNode of node.declarationList.declarations) {
					if (
						subNode.initializer !== undefined &&
						isArrowFunction(subNode.initializer)
					) {
						const startPos = subNode.getStart(sourceFile);
						const endPos = subNode.initializer.end;
						const codePosition = new CodePosition(document, startPos, endPos);
						const newFunc = runnableFuncFromNamedExportArrowFunc(
							subNode,
							codePosition,
							document.languageId,
							sourceFile,
							normalizePath(document.uri.fsPath),
						);
						output.push(newFunc);
					}
				}
			}
			// export function myFunc(...) {...}
			// export default function(...) {...}
			else if (isFunctionDeclaration(node)) {
				const startPos = node.getStart(sourceFile);
				const endPos = node.parameters.end;
				const codePosition = new CodePosition(document, startPos, endPos);
				const newFunc = runnableFuncFromFunctionDeclaration(
					node,
					codePosition,
					document.languageId,
					sourceFile,
					normalizePath(document.uri.fsPath),
				);
				output.push(newFunc);
			}

			return undefined;
		} catch (error: unknown) {
			const message = 'Error parsing testable functions';
			const logger = container.resolve(LoggerService);
			logger.error(error, message);
			throw error;
		}
	};
}
