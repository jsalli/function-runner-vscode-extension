import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import {
	createRandomIdentifier,
	inputSetHeaderSectionComment,
	inputViewHeaderSectionComment,
} from '@functionrunner/shared';
import { Node } from 'typescript';

import { createEmptyLineNode, createEmptyNode } from './helpers';
import {
	addMultiLineComment,
	addSingleLineComment,
} from '../common/addComments';
import { tsNodesToString } from './tsNodesToString';
import { createInputsSection } from './createInputsSection';
import { getTypeImportsSection } from './getTypeImportsSection';

export function createJsTsInputViewContent(
	runnableFunction: RunnableJsTsFunction,
): string {
	const allNodes: Node[] = [];
	const typeImportsSectionNodes = getTypeImportsSection(runnableFunction);
	if (typeImportsSectionNodes != null) {
		allNodes.push(...typeImportsSectionNodes);
		allNodes.push(createEmptyLineNode());
	} else {
		allNodes.push(createEmptyNode());
	}

	addMultiLineComment(
		allNodes[0],
		inputViewHeaderSectionComment(
			runnableFunction.name,
			runnableFunction.sourceFilePath,
		),
	);

	const nodes = inputSetSection(runnableFunction);

	allNodes.push(...nodes);

	return tsNodesToString(allNodes);
}

function inputSetSection(runnableFunction: RunnableJsTsFunction): Node[] {
	const nodes: Node[] = [];
	const emptyNode = createEmptyNode();

	const inputSetRandomIdStr = createRandomIdentifier();
	addMultiLineComment(
		emptyNode,
		inputSetHeaderSectionComment(inputSetRandomIdStr),
	);
	nodes.push(emptyNode);

	if (runnableFunction.args.length > 0) {
		const inputNodes = createInputsSection(
			runnableFunction.args,
			inputSetRandomIdStr,
		);
		nodes.push(...inputNodes);
	} else {
		const emptyNode = createEmptyNode();
		addSingleLineComment(emptyNode, ' Function has no input arguments');
		nodes.push(emptyNode);
	}

	return nodes;
}

export function createNewRunCaseInputString(
	runnableFunction: RunnableJsTsFunction,
): string {
	const nodes = inputSetSection(runnableFunction);
	const content = tsNodesToString(nodes);
	return content;
}
