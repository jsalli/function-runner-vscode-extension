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
	createFunctionUnderTestImportNode,
	createVariableStatement,
	outputIdentifierName,
	RunnableJsTsFunction,
	RunnableJsTsFunctionArg,
} from '@functionrunner/javascript-typescript-shared';
import {
	createPrinter,
	createSourceFile,
	ExpressionStatement,
	factory,
	FunctionDeclaration,
	Identifier,
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

const mainFunctionName = '___main';

export function createCodeToInvokeFuncAndConsoleLogIONodes(
	runnableFunction: RunnableJsTsFunction,
): Node[] {
	const mainNodes: Statement[] = [];

	const importNode = createFunctionUnderTestImportNode(runnableFunction);
	mainNodes.push(importNode);

	const nodesInsideMainFunction: Statement[] = [];

	// Input variable declarations
	// 	const inputVarDecs = runCase.caseInputs.map(
	// 		(useCaseInput) => useCaseInput.inputVarDec,
	// 	);
	// 	subNodes.push(...inputVarDecs);
	const outputLetVar = factory.createIdentifier(outputIdentifierName);
	const emptyOutputVarStmt = createVariableStatement(
		outputLetVar,
		factory.createStringLiteral(''),
		undefined,
		false,
	);
	nodesInsideMainFunction.push(emptyOutputVarStmt);
	const { functionCallNode, outputIdentifier } =
		createFuncCallAndOutputAssignment(runnableFunction, 'toExistingVar');
	const catchErrorName = 'error';
	const catchErrorNodes = createCatchErrorConsoleLogMessage(
		catchErrorName,
		outputIdentifier,
	);
	const tryCatch = wrapInTryCatch(
		functionCallNode,
		catchErrorName,
		catchErrorNodes,
	);
	// Function call and output variable declaration
	nodesInsideMainFunction.push(tryCatch);
	// Post call nodes
	const postCallNodes = createFunctionRunPostCall(runnableFunction.args);
	nodesInsideMainFunction.push(...postCallNodes);

	const { mainFuncDeclaration, mainFuncCall } = createMainFunctionAndCall(
		nodesInsideMainFunction,
	);
	mainNodes.push(mainFuncDeclaration, mainFuncCall);
	return mainNodes;
}

export function createCodeToInvokeFuncAndConsoleLogIO(
	runnableFunction: RunnableJsTsFunction,
	// useTerminalColors: boolean = false,
): string {
	const mainNodes =
		createCodeToInvokeFuncAndConsoleLogIONodes(runnableFunction);
	const tsSourceFile = createSourceFile('', '', ScriptTarget.Latest);
	const printer = createPrinter({
		newLine: NewLineKind.LineFeed,
		neverAsciiEscape: true, // Keep Scandinavian characters as is, don't turn them into utf-8 codes
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
 * async function ___main() {...};
 * ___main();
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
	outputId: Identifier,
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

	const varStatement = factory.createExpressionStatement(
		factory.createBinaryExpression(
			outputId,
			SyntaxKind.EqualsToken,
			stringTemplate,
		),
	);

	return [varStatement];
}

function createFunctionRunPostCall(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	args: RunnableJsTsFunctionArg[],
	// useTerminalColors: boolean,
): Statement[] {
	const nodes: Statement[] = [];

	// const inputSetDescriptionText = 'Input set';

	// const colorsSetupForCaseDescription = factory.createStringLiteral(
	// 	colorBgCyan + colorFgBlack + colorTextInject + colorReset,
	// );
	// const caseDescriptionConsoleLog = [
	// 	factory.createStringLiteral(`===== ${caseDescription} =====`),
	// ];
	// if (useTerminalColors) {
	// 	caseDescriptionConsoleLog.unshift(colorsSetupForCaseDescription);
	// }
	// const inputSetDescriptionNode = factory.createExpressionStatement(
	// 	createPropertyAccessCallExp('console', 'log', [
	// 		factory.createStringLiteral(`===== ${inputSetDescriptionText} =====`),
	// 	]),
	// );
	// nodes.push(inputSetDescriptionNode);

	// if (args.length !== 0) {
	// 	const inputsComment = factory.createExpressionStatement(
	// 		createPropertyAccessCallExp('console', 'log', [
	// 			// factory.createStringLiteral(
	// 			// 	colorBgGreen + colorFgBlack + colorTextInject + colorReset,
	// 			// ),
	// 			factory.createStringLiteral('Function inputs:'),
	// 		]),
	// 	);
	// 	const inputsConsoleLogs = args.map((arg) =>
	// 		factory.createExpressionStatement(
	// 			createPropertyAccessCallExp('console', 'log', [
	// 				// factory.createStringLiteral(
	// 				// 	colorBgYellow + colorFgBlack + colorTextInject + colorReset,
	// 				// ),
	// 				factory.createStringLiteral(`${arg.name}: `),
	// 				`${arg.name}${ioViewIdentifierPostFix}${inputSetIdentifier}`,
	// 			]),
	// 		),
	// 	);
	// 	nodes.push(inputsComment, ...inputsConsoleLogs);
	// }

	const outputComment = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', [
			// factory.createStringLiteral(
			// 	colorBgBlue + colorFgBlack + colorTextInject + colorReset,
			// ),
			factory.createStringLiteral('===== Function output ====='),
		]),
	);
	const outputConsoleLog = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', [outputIdentifierName]),
	);
	const newLineConsoleLog = factory.createExpressionStatement(
		createPropertyAccessCallExp('console', 'log', []),
	);

	nodes.push(outputComment, outputConsoleLog, newLineConsoleLog);

	return nodes;
}
