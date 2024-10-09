import { inputViewUserSetupSectionComment } from '@functionrunner/shared';
import {
	addMultiLineComment,
	addSingleLineComment,
} from '../common/addComments';
import { createEmptyNode, createEmptyLineNode } from './helpers';
import { Node } from 'typescript';

export function createUserSetupSection(): Node[] {
	const userSetupSectionComment = inputViewUserSetupSectionComment();

	const emptyLine = createEmptyLineNode();

	const userSetupSectionHeaderCommentNode = createEmptyNode();
	addMultiLineComment(
		userSetupSectionHeaderCommentNode,
		userSetupSectionComment,
	);

	const userSetupExample1CommentedOutNode = createEmptyNode();
	const userSetupCodeExample1 = 'process.env.MY_ENV_VAR = "my_value"';
	addSingleLineComment(
		userSetupExample1CommentedOutNode,
		userSetupCodeExample1,
	);

	const userSetupExample2CommentedOutNode = createEmptyNode();
	const userSetupCodeExample2 =
		'const dbConnection = await someDbConnectionCreator(...)';
	addSingleLineComment(
		userSetupExample2CommentedOutNode,
		userSetupCodeExample2,
	);

	return [
		emptyLine,
		userSetupSectionHeaderCommentNode,
		userSetupExample1CommentedOutNode,
		userSetupExample2CommentedOutNode,
		emptyLine,
	];
}
