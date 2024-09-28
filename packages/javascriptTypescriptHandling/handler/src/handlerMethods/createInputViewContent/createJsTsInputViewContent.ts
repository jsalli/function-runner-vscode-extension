import { RunnableJsTsFunction } from '@functionrunner/javascript-typescript-shared';
import {
	ConfigurationService,
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
import { createUserSetupSection } from './createUserSetupSection';
import { createFunctionExecutionSection } from './createFunctionExecutionSection';

export function createJsTsInputViewContent(
	runnableFunction: RunnableJsTsFunction,
	configurationService: ConfigurationService,
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

	const userSetupSection = createUserSetupSection();
	allNodes.push(...userSetupSection);

	const nodes = inputSetSection(runnableFunction);
	allNodes.push(...nodes);

	const printFunctionExecutionCode = configurationService.get(
		'general.printFunctionExecutionCodeToInputView',
	);
	if (printFunctionExecutionCode) {
		const functionExectionSection =
			createFunctionExecutionSection(runnableFunction);
		allNodes.push(...functionExectionSection);
	}

	return tsNodesToString(allNodes);
}

function inputSetSection(runnableFunction: RunnableJsTsFunction): Node[] {
	const nodes: Node[] = [];
	const emptyNode = createEmptyNode();

	addMultiLineComment(emptyNode, inputSetHeaderSectionComment());
	nodes.push(emptyNode);

	if (runnableFunction.args.length > 0) {
		const inputNodes = createInputsSection(runnableFunction.args);
		nodes.push(...inputNodes);
	} else {
		const emptyNode = createEmptyNode();
		addSingleLineComment(emptyNode, ' Function has no input arguments');
		nodes.push(emptyNode);
	}

	return nodes;
}
