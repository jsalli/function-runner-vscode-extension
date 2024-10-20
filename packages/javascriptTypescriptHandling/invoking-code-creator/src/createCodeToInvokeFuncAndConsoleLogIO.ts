// import {
// 	colorBgBlue,
// 	colorBgCyan,
// 	colorBgGreen,
// 	colorBgYellow,
// 	colorFgBlack,
// 	colorReset,
// 	colorTextInject,
// } from '@functionrunner/shared';
import {
	createEmptyLineNode,
	createFunctionUnderTestImportNode,
	RunnableJsTsFunction,
} from '@functionrunner/javascript-typescript-shared';
import {
	createPrinter,
	createSourceFile,
	ExpressionStatement,
	factory,
	FunctionDeclaration,
	ListFormat,
	NewLineKind,
	Node,
	ScriptTarget,
	Statement,
	SyntaxKind,
} from 'typescript';
import {
	createFunctionCall,
	createPropertyAccessExpression,
} from './createFunctionCall';
import { createFuncCallAndOutputAssignment } from './common';
import { wrapInTryCatch } from './wrapInTryCatch';
import { createPropertyAccessCallExp } from './createPropertyAccessCallExp';
import { createUserSetupSection } from './createUserSetupSection';

const mainFunctionName = 'main';

function createNodesInsideTry(
	runnableFunction: RunnableJsTsFunction,
): Statement[] {
	const userSetupSection = createUserSetupSection();

	const { functionCallNode, outputIdentifier } =
		createFuncCallAndOutputAssignment(runnableFunction, 'toNewVar');
	const outputComment = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', [
			// factory.createStringLiteral(
			// 	colorBgBlue + colorFgBlack + colorTextInject + colorReset,
			// ),
			factory.createStringLiteral('===== Function output ====='),
		]),
	);
	const outputConsoleLog = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', [outputIdentifier]),
	);
	const newLineConsoleLog = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', []),
	);

	return [
		...userSetupSection,
		functionCallNode,
		outputComment,
		outputConsoleLog,
		newLineConsoleLog,
	];
}

export function createCodeToInvokeFuncAndConsoleLogIONodes(
	runnableFunction: RunnableJsTsFunction,
): Node[] {
	const mainNodes: Statement[] = [];

	const importNode = createFunctionUnderTestImportNode(runnableFunction);
	mainNodes.push(importNode);

	const nodesInsideMainFunction: Statement[] = [];

	const nodesInsideTry = createNodesInsideTry(runnableFunction);
	const catchErrorName = 'error';
	const catchErrorNodes = createCatchErrorConsoleLogMessage(catchErrorName);
	const tryCatch = wrapInTryCatch(
		nodesInsideTry,
		catchErrorName,
		catchErrorNodes,
	);
	// Function call and output variable declaration
	nodesInsideMainFunction.push(tryCatch);

	const { mainFuncDeclaration, mainFuncCall } = createMainFunctionAndCall(
		nodesInsideMainFunction,
	);
	mainNodes.push(mainFuncDeclaration, createEmptyLineNode(), mainFuncCall);
	return mainNodes;
}

export function createCodeToInvokeFuncAndConsoleLogIO(
	runnableFunction: RunnableJsTsFunction,
): string {
	const mainNodes =
		createCodeToInvokeFuncAndConsoleLogIONodes(runnableFunction);
	const tsSourceFile = createSourceFile(
		'codeToInvokeFuncAndConsoleLogIO.ts',
		'',
		ScriptTarget.Latest,
	);

	const printer = createPrinter({
		newLine: NewLineKind.LineFeed,
		neverAsciiEscape: true, // Keep Scandinavian characters as is, don't turn them into utf-8 codes
		preserveSourceNewlines: true,
	});

	const tsCode = printer.printList(
		ListFormat.MultiLine,
		factory.createNodeArray(mainNodes),
		tsSourceFile,
	);

	return tsCode;
}

/**
 * @example
 * async function main() {...};
 * main();
 *
 * @param nodes
 * @returns
 */
function createMainFunctionAndCall(nodes: Statement[]): {
	mainFuncDeclaration: FunctionDeclaration;
	mainFuncCall: ExpressionStatement;
} {
	const mainFuncDeclaration = factory.createFunctionDeclaration(
		[factory.createModifier(SyntaxKind.AsyncKeyword)],
		undefined,
		mainFunctionName,
		undefined,
		[],
		undefined,
		factory.createBlock(nodes),
	);

	const mainFuncCall = createFunctionCall(
		mainFunctionName,
		[],
		undefined,
		'ExpressionStatement',
	);

	return {
		mainFuncDeclaration,
		mainFuncCall,
	};
}

function createCatchErrorConsoleLogMessage(
	catchErrorName: string,
): Statement[] {
	const stringTemplate = factory.createTemplateExpression(
		factory.createTemplateHead(
			'Function throws an exception:\\nClass: ',
			'Function throws an exception:\\nClass: ',
		),
		[
			factory.createTemplateSpan(
				createPropertyAccessExpression([catchErrorName, 'constructor', 'name']),
				factory.createTemplateMiddle('\\nMessage: ', '\\nMessage: '),
			),
			factory.createTemplateSpan(
				createPropertyAccessExpression([catchErrorName, 'message']),
				factory.createTemplateTail('', ''),
			),
		],
	);

	const outputComment = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', [stringTemplate]),
	);

	return [outputComment];
}
