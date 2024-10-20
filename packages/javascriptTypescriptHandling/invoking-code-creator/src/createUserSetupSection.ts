import { inputViewUserSetupSectionComment } from '@functionrunner/shared';
import {
	createEmptyNode,
	createEmptyLineNode,
	addMultiLineComment,
	addSingleLineComment,
} from '@functionrunner/javascript-typescript-shared';
import { Statement } from 'typescript';

export function createUserSetupSection(): Statement[] {
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
		userSetupSectionHeaderCommentNode,
		userSetupExample1CommentedOutNode,
		userSetupExample2CommentedOutNode,
		emptyLine,
	];
}
