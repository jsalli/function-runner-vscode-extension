import { factory, Identifier, Statement, TryStatement } from 'typescript';

export function wrapInTryCatch(
	tryNode: Statement | Statement[],
	catchErrorName?: string | Identifier,
	catchNode?: Statement | Statement[],
): TryStatement {
	return factory.createTryStatement(
		factory.createBlock(Array.isArray(tryNode) ? tryNode : [tryNode], true),
		factory.createCatchClause(
			catchErrorName,
			factory.createBlock(
				catchNode !== undefined
					? Array.isArray(catchNode)
						? catchNode
						: [catchNode]
					: [],
			),
		),
		undefined,
	);
}
