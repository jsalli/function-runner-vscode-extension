import { addSyntheticLeadingComment, Node, SyntaxKind } from 'typescript';

export function addSingleLineComment(node: Node, comment: string): void {
	addComment(node, comment, SyntaxKind.SingleLineCommentTrivia);
}

export function addMultiLineComment(node: Node, comment: string): void {
	addComment(node, comment, SyntaxKind.MultiLineCommentTrivia);
}

function addComment(
	node: Node,
	comment: string,
	style: SyntaxKind.MultiLineCommentTrivia | SyntaxKind.SingleLineCommentTrivia,
): void {
	addSyntheticLeadingComment(node, style, comment, true);
}
