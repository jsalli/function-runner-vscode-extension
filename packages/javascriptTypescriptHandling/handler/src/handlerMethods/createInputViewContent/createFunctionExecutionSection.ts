import { createCodeToInvokeFuncAndConsoleLogIONodes } from '@functionrunner/javascript-typescript-invoking-code-creator';
import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import { Node } from 'typescript';
import { createEmptyLineNode, createEmptyNode } from './helpers';
import { inputViewFunctionExecutionSectionComment } from '@functionrunner/shared';
import { addMultiLineComment } from '../common/addComments';

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
