import {
	createPrinter,
	createSourceFile,
	factory,
	ListFormat,
	NewLineKind,
	Node,
	ScriptTarget,
} from 'typescript';

export function tsNodesToString(nodeArray: Node[]): string {
	const emptyTsSourceFile = createSourceFile('', '', ScriptTarget.Latest);
	const printer = createPrinter({
		newLine: NewLineKind.LineFeed,
		neverAsciiEscape: true, // Keep Scandinavian characters as is, don't turn them into utf-8 codes
	});
	const result = printer.printList(
		ListFormat.MultiLine,
		factory.createNodeArray(nodeArray),
		emptyTsSourceFile,
	);
	return result;
}
