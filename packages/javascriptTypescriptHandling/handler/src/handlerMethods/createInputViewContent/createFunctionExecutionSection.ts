import { createCodeToInvokeFuncAndConsoleLogIONodes } from '@functionrunner/javascript-typescript-invoking-code-creator';
import {
	RunnableJsTsFunction,
	createEmptyLineNode,
	createEmptyNode,
	addMultiLineComment,
} from '@functionrunner/javascript-typescript-shared';
import { Node } from 'typescript';
import { inputViewFunctionExecutionSectionComment } from '@functionrunner/shared';

export function createFunctionExecutionSection(
	runnableFunction: RunnableJsTsFunction,
): Node[] {
	const emptyLine = createEmptyLineNode();

	const functionExecutionSectionComment =
		inputViewFunctionExecutionSectionComment();
	const functionExecutionSectionHeaderCommentNode = createEmptyNode();
	addMultiLineComment(
		functionExecutionSectionHeaderCommentNode,
		functionExecutionSectionComment,
	);

	const tsCodeToInvokeFunction =
		createCodeToInvokeFuncAndConsoleLogIONodes(runnableFunction);

	return [
		emptyLine,
		functionExecutionSectionHeaderCommentNode,
		...tsCodeToInvokeFunction,
	];
}
